/* This animation system is based on the following resource:
   https://thomaswilburn.github.io/viz-book/perf-flip.html
   It uses the FLIP technique (First, Last, Invert, Play) */

import {insertVariables} from "./template-renderer.js";

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

export { animateFromTo };
