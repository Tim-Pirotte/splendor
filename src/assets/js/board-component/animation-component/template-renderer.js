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

  currentTokenBuffer = processExpression(expression, currentTokenBuffer, tokenStack, varsToInsert, functions);

  if (currentTokenBuffer.length !== 0) {
    if (!(currentTokenBuffer in varsToInsert)) varDoesNotExistError(currentTokenBuffer, expression);
    return varsToInsert[currentTokenBuffer];
  }

  if (tokenStack.length !== 0) return tokenStack[0].value;

  throw new SyntaxError(`Expected expression to end (${expression})`);
}

function getExpression(targetString, nextTemplatePos, templateStartSymbol, templateEndPos) {
  return targetString.slice(nextTemplatePos + templateStartSymbol.length, templateEndPos).trim();
}

function processExpression(expression, currentTokenBuffer, tokenStack, varsToInsert, functions) {
  for (const char of expression) {
    switch (char) {
      case "(":
        currentTokenBuffer = processFunctionCallStart(currentTokenBuffer, expression, tokenStack, functions);
        break;
      case ")":
        currentTokenBuffer = processFunctionCallEnd(currentTokenBuffer, tokenStack, varsToInsert, expression, functions);
        break;
      case ",":
        currentTokenBuffer = processFunctionArgument(tokenStack, varsToInsert, currentTokenBuffer, expression);
        break;
      case " ":
        break;
      default:
        currentTokenBuffer += char;
    }
  }

  return currentTokenBuffer;
}

function processFunctionCallStart(currentTokenBuffer, expression, tokenStack, functions) {
  if (currentTokenBuffer.length === 0) throw new SyntaxError(`A '(' symbol must have a function name preceding it (${expression})`);
  if (!(currentTokenBuffer in functions)) funcDoesNotExistError(currentTokenBuffer, expression);

  tokenStack.push({ type: "functionName", name: currentTokenBuffer });
  return "";
}

function processFunctionCallEnd(currentTokenBuffer, tokenStack, varsToInsert, expression, functions) {
  if (currentTokenBuffer.length !== 0) {
    if (!(currentTokenBuffer in varsToInsert)) varDoesNotExistError();
    tokenStack.push({ type: "argument", value: varsToInsert[currentTokenBuffer] });
  }

  const args = [];
  while (true) {
    if (tokenStack.length === 0) throw new SyntaxError(`Unopened ')' tag (${expression})`);

    const token = tokenStack.pop();

    if (token.type === "functionName") {
      if (!(token.name in functions)) funcDoesNotExistError(currentTokenBuffer, expression);
      tokenStack.push({type: "argument", value: functions[token.name](args)});
      currentTokenBuffer = "";
      break;
    }

    args.push(token.value);
  }
  return currentTokenBuffer;
}

function processFunctionArgument(tokenStack, varsToInsert, currentTokenBuffer, expression) {
  if (!(currentTokenBuffer in varsToInsert)) varDoesNotExistError(currentTokenBuffer, expression);
  tokenStack.push({ type: "argument", value: varsToInsert[currentTokenBuffer] });
  return "";
}

function funcDoesNotExistError(currentTokenBuffer, expression) {
  throw new SyntaxError(`Function ${currentTokenBuffer} does not exist (${expression})`);
}

function varDoesNotExistError(currentTokenBuffer, expression) {
  throw new SyntaxError(`Variable ${currentTokenBuffer} does not exist (${expression})`)
}

export { insertVariables };
