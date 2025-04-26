function insertVariables(targetString, varsToInsert, functions, templateStartSymbol = "{{", templateEndSymbol = "}}") {
  let result = "";
  let currentPos = 0;

  while (currentPos < targetString.length) {
    const nextTemplatePos = getNextTemplatePos(targetString, currentPos, templateStartSymbol);

    if (nextTemplatePos === -1) {
      result += targetString.slice(currentPos);
      break;
    }

    result += targetString.slice(currentPos, nextTemplatePos);

    const templateEndPos = getTemplateEndPos(targetString, nextTemplatePos, templateEndSymbol);
    const textToInsert = evaluateExpression(targetString, nextTemplatePos, templateStartSymbol, templateEndPos, varsToInsert, functions);

    result += textToInsert;
    currentPos = templateEndPos + templateEndSymbol.length;
  }

  return result;
}

function getNextTemplatePos(targetString, currentPos, templateStartSymbol) {
  return targetString.indexOf(templateStartSymbol, currentPos);
}

function getTemplateEndPos(targetString, nextTemplatePos, templateEndSymbol) {
  const templateEndPos = targetString.indexOf(templateEndSymbol, nextTemplatePos);
  if (templateEndPos === -1) throw new SyntaxError(`Unclosed template tag at ${nextTemplatePos}`);

  return templateEndPos;
}

function evaluateExpression(targetString, nextTemplatePos, templateStartSymbol, templateEndPos, varsToInsert, functions) {
  let result = "";

  const expression = getExpression(targetString, nextTemplatePos, templateStartSymbol, templateEndPos);
  const tokenStack = [];
  let currentTokenBuffer = "";

  for (const char of expression) {
    switch (char) {
      case "(":
        if (currentTokenBuffer.length === 0) throw new SyntaxError(`A '(' symbol must have a function name preceding it (${expression})`);
        tokenStack.push({ type: "functionName", name: currentTokenBuffer });
        currentTokenBuffer = "";
        break;
      case ")":
        if (currentTokenBuffer.length !== 0) tokenStack.push({ type: "argument", value: varsToInsert[currentTokenBuffer] });

        const args = [];
        while (true) {
          if (tokenStack.length === 0) throw new SyntaxError(`Unopened ')' tag (${expression})`);

          const token = tokenStack.pop();

          if (token.type === "functionName") {
            tokenStack.push({ type: "argument", value: functions[token.name](args) });
            currentTokenBuffer = "";
            break;
          }

          args.push(token.value);
        }
        break;
      case ",":
        tokenStack.push({ type: "argument", value: varsToInsert[currentTokenBuffer] });
        currentTokenBuffer = "";
        break;
      case " ":
        break;
      default:
        currentTokenBuffer += char;
    }
  }

  if (currentTokenBuffer.length !== 0) return varsToInsert[currentTokenBuffer];
  if (tokenStack.length !== 0) return tokenStack[0].value;
  throw new SyntaxError("Expected expression to end (${expression})");
}

function getExpression(targetString, nextTemplatePos, templateStartSymbol, templateEndPos) {
  return targetString.slice(nextTemplatePos + templateStartSymbol.length, templateEndPos).trim();
}

function evaluateExpressionOLD(targetString, nextTemplatePos, templateStartSymbol, templateEndPos, varsToInsert) {
  const varToInsert = targetString.slice(nextTemplatePos + templateStartSymbol.length, templateEndPos).trim();
  if (!(varToInsert in varsToInsert)) throw new SyntaxError(`Variable ${varToInsert} does not exist`);

  return varToInsert;
}

export { insertVariables };
