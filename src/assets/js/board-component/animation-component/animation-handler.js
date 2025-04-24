/* This animation system is based on the following resource:
   https://thomaswilburn.github.io/viz-book/perf-flip.html
   It uses the FLIP technique (First, Last, Invert, Play) */

function animateFromTo($sourceNode, $targetNode, animation) {
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
  $targetNode.animate(
    insertVariables(animation.keyFrames, invertedPosSize),
    {
      duration: animation.duration,
      easing: animation.easeFunction,
      },
  );
}

function insertVariables(targetString, varsToInsert) {
  for (const [varName, value] of Object.entries(varsToInsert)) {
    targetString.replaceAll(`{{ ${varName} }}`, value);
  }
}
