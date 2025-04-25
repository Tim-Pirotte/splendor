const cardAnimation = {
  keyFrames: [
    { transform: "translateX({{ left }}px) translateY({{ top }}px)" },
    { transform: "translateX(0) translateY(0)" },
  ],
  duration: 1_000,
  easeFunction: "linear",
};

export { cardAnimation };