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
    { transform: "translateX(calc({{ left }}px + 3.9375rem)) translateY(calc({{ top }}px + 5.75rem)) scale(1.3)" },
    { transform: "translateX(-2.8rem) translateY(-3.75rem) scale(0.14)" },
  ],
  duration: 1_500,
  easeFunction: "ease-in-out",
};

export { setAnimationDelayBeforePolling, getAnimationDelayBeforePolling, reserveCardAnimation, buyCardAnimation };