let animationDelayBeforePolling = 0;

function setAnimationDelayBeforePolling(value) {
  animationDelayBeforePolling = value;
}

function getAnimationDelayBeforePolling() {
  return animationDelayBeforePolling;
}

const reserveCardAnimation = {
  keyFrames: [
    { transform: "translateX({{ left }}px) translateY({{ top }}px) scale(1.3)" },
    { transform: "translateX(0) translateY(0) scale(1)" },
  ],
  duration: 1_000,
  easeFunction: "ease-in-out",
};

const buyCardAnimation = {
  keyFrames: [
    {
      transform: "translateX({{ left }}px) translateY({{ top }}px) scale(1.3)",
      color: "transparent",
    },
    { transform: "translateX(-2rem) translateY(-2.75rem) scale(0.23)" },
  ],
  duration: 20_000,
  easeFunction: "ease-in-out",
};

export { setAnimationDelayBeforePolling, getAnimationDelayBeforePolling, reserveCardAnimation, buyCardAnimation };