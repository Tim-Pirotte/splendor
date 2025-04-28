/* Variables available for animation
*  Inverted positions: left, top, right, bottom
*  Inverted sizes: width, height
*  Nodes: $sourceNode (Unless if it's a shift list animation), $targetNode */

let animationDelayBeforePolling = 1000;

function setAnimationDelayBeforePolling(value) {
    animationDelayBeforePolling = value;
}

function getAnimationDelayBeforePolling() {
    return animationDelayBeforePolling;
}

const ANIMATION_FUNCTIONS = {

};

const reserveCardAnimation = {
    keyFrames: [
        { transform: "translateX({{ left }}px) translateY({{ top }}px) scale(1.3)" },
        { transform: "translateX(0) translateY(0) scale(1)" },
    ],
    duration: 1_000,
    easeFunction: "ease-in-out",
};

const reserveCardFromDeckAnimationFront = {
    keyFrames: [
        {
            offset: 0,
            transform: "translateX({{ left }}px) translateY({{ top }}px) scale(1.3) rotateY(180deg)",
        },
        {
            offset: 0.5,
            transform: "translateX(calc({{ left }}px * 0.5)) translateY(calc({{ top }}px * 0.5)) scale(1.3) rotateY(180deg)",
        },
        {
            offset: 0.7,
            transform: "translateX(calc({{ left }}px * 0.3)) translateY(calc({{ top }}px * 0.3)) scale(1.5) rotateY(0)",
        },
        {
            offset: 1,
            transform: "translateX(0) translateY(0) scale(1) rotateY(0)",
        },
    ],
    duration: 1_300,
    easeFunction: "ease-in-out",
};

const reserveCardFromDeckAnimationBack = {
    keyFrames: [
        {
            offset: 0,
            transform: "translateX({{ left }}px) translateY({{ top }}px) scale(1.3) rotateY(0)",
        },
        {
            offset: 0.5,
            transform: "translateX(calc({{ left }}px * 0.5)) translateY(calc({{ top }}px * 0.5)) scale(1.3) rotateY(0)",
        },
        {
            offset: 0.7,
            transform: "translateX(calc({{ left }}px * 0.3)) translateY(calc({{ top }}px * 0.3)) scale(1.5) rotateY(180deg)",
        },
        {
            offset: 1,
            transform: "translateX(0) translateY(0) scale(1) rotateY(180deg)",
        },
    ],
    duration: 1_300,
    easeFunction: "ease-in-out",
};

const reserveCardShiftAnimation = {
    keyFrames: [
        { transform: "translateX({{ left }}px) translateY({{ top }}px)" },
        { transform: "translateX(0) translateY(0)" },
    ],
    duration: 1_000,
    easeFunction: "ease-in-out",
};

const buyCardAnimation = {
    keyFrames: [
        { transform: "translateX(calc({{ left }}px + 3.9375rem)) translateY(calc({{ top }}px + 5.75rem)) scale(1.3)" },
        { transform: "translateX(-2.8rem) translateY(-3.75rem) scale(0.14)" },
    ],
    duration: 1_500,
    easeFunction: "ease-in-out",
};

export {
    setAnimationDelayBeforePolling,
    getAnimationDelayBeforePolling,
    reserveCardAnimation,
    reserveCardFromDeckAnimationFront,
    reserveCardFromDeckAnimationBack,
    reserveCardShiftAnimation,
    buyCardAnimation,
    ANIMATION_FUNCTIONS,
};
