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

/* Examples:
* 1: expression = 'myTestVar'
*   - Default case gets triggered until the end of the string
*   - Stack is empty and buffer isn't so return the var equal to the token buffer
* 2: expression = 'testFunc(arg1, nestedFunc(arg2, arg3), arg4)'
*   - Default case gets triggered until the first '(' symbol
*   - Function token is pushed to the stack with name = testFunc
*   - Default case gets triggered until ',' is encountered
*   - Argument token is pushed to the stack with value = value of arg1
*   - Default case gets triggered until the '(' symbol
*   - Function token is pushed to the stack with name = nestedFunc
*   - Default case gets triggered until ',' is encountered
*   - Argument token is pushed to the stack with value = value of arg2
*   - Default case gets triggered until ')' is encountered
*   - Argument token is pushed to the stack with value = value of arg3
*   - arg3 gets popped of the stack and added to args
*   - arg2 gets popped of the stack and added to args
*   - nestedFunc gets popped of the stack and gets called with the args
*   - result gets pushed to the stack so now we are basically left with 'testFunc(arg1, resOfNestedFunc, arg4)'
*   - Default case gets triggered until ')' is encountered
*   - Argument token is pushed to the stack with value = value of arg4
*   - arg4 gets popped of the stack and added to args
*   - resOfNestedFunc gets popped of the stack and added to args
*   - arg1 gets popped of the stack and added to args
*   - testFunc gets popped of the stack and gets called with the args
*   - result gets pushed to the stack
*   - The buffer is empty and the stack is of length 1 so we return the value at position 0 in the stack */
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
      tokenStack.push({type: "argument", value: functions[token.name](args.toReversed())});
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
