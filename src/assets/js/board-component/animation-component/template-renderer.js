function insertVariables(targetString, varsToInsert, templateStartSymbol = "{{", templateEndSymbol = "}}") {
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
    const varToInsert = getVarToInsert(targetString, nextTemplatePos, templateStartSymbol, templateEndPos, varsToInsert);

    result += varsToInsert[varToInsert];
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

function getVarToInsert(targetString, nextTemplatePos, templateStartSymbol, templateEndPos, varsToInsert) {
  const varToInsert = targetString.slice(nextTemplatePos + templateStartSymbol.length, templateEndPos).trim();
  if (!(varToInsert in varsToInsert)) throw new SyntaxError(`Variable ${varToInsert} does not exist`);

  return varToInsert;
}

export { insertVariables };
