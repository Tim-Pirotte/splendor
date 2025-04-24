/* This animation system is based on the following resource:
   https://thomaswilburn.github.io/viz-book/perf-flip.html
   It uses the FLIP technique (First, Last, Invert, Play) */

function animateFromTo($sourceNode, $targetNode, keyframes, duration, easingFunction) {
    const sourcePosition = $sourceNode.getBoundingClientRect();
    const targetPosition = $targetNode.getBoundingClientRect();

    const invertedPosSize = getInvertedPositionSize(sourcePosition, targetPosition);

    startTargetAnimation($targetNode, invertedPosSize, keyframes, duration, easingFunction);
}

function getInvertedPositionSize(sourcePosition, targetPosition) {
  return {
    top: sourcePosition.top - targetPosition.top,
    left: sourcePosition.left - targetPosition.left,
    width: targetPosition.width / sourcePosition.width,
    height: targetPosition.height / sourcePosition.height,
  };
}

function startTargetAnimation($targetNode, invertedPosSize, keyframes, duration, easingFunction) {
  $targetNode.animate([
    { transform: `translateX(${invertedPosSize.left}px) translateY(${invertedPosSize.top}px)` },
    { transform: "translateX(0) translateY(0)" }
  ], {
    duration: 300,
    easing: "linear",
  });
}