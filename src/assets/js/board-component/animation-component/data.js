const cardAnimation = {
  keyFrames: [
    { transform: "translateX({{ left }}px) translateY({{ top }}px) scale(1.3)" },
    { transform: "translateX(0) translateY(0) scale(1)" },
  ],
  duration: 1_000,
  easeFunction: "ease-in-out",
};

export { cardAnimation };