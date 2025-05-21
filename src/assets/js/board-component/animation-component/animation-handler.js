/* This animation system is based on the following resource:
   https://thomaswilburn.github.io/viz-book/perf-flip.html
   It uses the FLIP technique (First, Last, Invert, Play) */

import { insertVariables } from "./template-renderer.js";
import { ANIMATION_FUNCTIONS } from "./data.js";

function animateFromTo($sourceNode, $targetNode, animation, fnToRunAfterAnimation) {
    animation = deepCopyObject(animation);

    const sourcePosition = $sourceNode.getBoundingClientRect();
    const targetPosition = $targetNode.getBoundingClientRect();

    const invertedPosSize = getInvertedPositionSize(sourcePosition, targetPosition);

    startTargetAnimation($targetNode, invertedPosSize, animation, $sourceNode, fnToRunAfterAnimation);
}

function animateShiftListItems($listItems, sourceBoundingBoxes, targetBoundingBoxes, animation) {
    for (const [index, $listItem] of $listItems.entries()) {
        const animationCopy = deepCopyObject(animation);
        const invertedPosSize = getInvertedPositionSize(sourceBoundingBoxes[index], targetBoundingBoxes[index]);

        startTargetAnimation($listItem, invertedPosSize, animationCopy, null);
    }
}

function deepCopyObject(object) {
    return JSON.parse(JSON.stringify(object));
}

function getVisibleListItemsBoundingBoxes($container) {
    return [...$container.querySelectorAll(":scope > li:not(.hidden)")]
        .map($listItem => $listItem.getBoundingClientRect());
}

function getInvertedPositionSize(sourcePosition, targetPosition) {
    return {
        top: sourcePosition.top - targetPosition.top,
        left: sourcePosition.left - targetPosition.left,
        bottom: sourcePosition.bottom - targetPosition.bottom,
        right: sourcePosition.right - targetPosition.right,
        width: targetPosition.width / sourcePosition.width,
        height: targetPosition.height / sourcePosition.height,
    };
}

function startTargetAnimation($targetNode, invertedPosSize, animation, $sourceNode, fnToRunAfterAnimation) {
    insertVariablesIntoKeyframes(animation, invertedPosSize, $sourceNode, $targetNode);

    const animationPlayer = $targetNode.animate(
        animation.keyFrames,
        {
            duration: animation.duration,
            easing: animation.easeFunction,
        },
    );

    animationPlayer.addEventListener(
        "finish",
        () => cleanupAnimation($targetNode, animation.keyFrames, fnToRunAfterAnimation)
    );
}

function insertVariablesIntoKeyframes(animation, invertedPosSize, $sourceNode, $targetNode) {
    invertedPosSize["$sourceNode"] = $sourceNode;
    invertedPosSize["$targetNode"] = $targetNode;

    for (const keyFrame of animation.keyFrames) {
        insertVariablesIntoKeyframe(keyFrame, invertedPosSize);
    }
}

function cleanupAnimation($targetNode, keyframes, fnToRunAfterAnimation) {
    for (const keyframe of keyframes) {
        for (const property of Object.keys(keyframe)) {
            $targetNode.style.removeProperty(property);
        }
    }

    if (fnToRunAfterAnimation) fnToRunAfterAnimation($targetNode);
}

function insertVariablesIntoKeyframe(keyFrame, invertedPosSize) {
    for (const [key, value] of Object.entries(keyFrame)) {
        if (typeof value === "string") {
            keyFrame[key] = insertVariables(value, invertedPosSize, ANIMATION_FUNCTIONS);
        }
    }
}

export { animateFromTo, animateShiftListItems, getVisibleListItemsBoundingBoxes };
