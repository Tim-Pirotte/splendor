/* This animation system is based on the following resource:
   https://thomaswilburn.github.io/viz-book/perf-flip.html
   It uses the FLIP technique (First, Last, Invert, Play) */

function animateFromTo($sourceNode, $targetNode, animation) {
    animation = JSON.parse(JSON.stringify(animation))

    const sourcePosition = $sourceNode.getBoundingClientRect();
    const targetPosition = $targetNode.getBoundingClientRect();

    const invertedPosSize = getInvertedPositionSize(sourcePosition, targetPosition);

    startTargetAnimation($targetNode, invertedPosSize, animation);
}

function getInvertedPositionSize(sourcePosition, targetPosition) {
  return {
    top: sourcePosition.top - targetPosition.top,
    left: sourcePosition.left - targetPosition.left,
    width: targetPosition.width / sourcePosition.width,
    height: targetPosition.height / sourcePosition.height,
  };
}

function startTargetAnimation($targetNode, invertedPosSize, animation) {
  insertVariablesIntoKeyframes(animation, invertedPosSize);

  const animationPlayer = $targetNode.animate(
    animation.keyFrames,
    {
      duration: animation.duration,
      easing: animation.easeFunction,
      },
  );

  animationPlayer.addEventListener("finish", () => cleanupAnimation($targetNode, animation.keyFrames));
}

function insertVariablesIntoKeyframes(animation, invertedPosSize) {
  for (const keyFrame of animation.keyFrames) {
    insertVariablesIntoKeyframe(keyFrame, invertedPosSize);
  }
}

function cleanupAnimation($targetNode, keyframes) {
  for (const keyframe of keyframes) {
    for (const property of Object.keys(keyframe)) {
      $targetNode.style.removeProperty(property);
    }
  }
}

function insertVariablesIntoKeyframe(keyFrame, invertedPosSize) {
  for (const [key, value] of Object.entries(keyFrame)) {
    if (typeof value === "string") {
      keyFrame[key] = insertVariables(value, invertedPosSize);
    }
  }
}

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

export { animateFromTo };
