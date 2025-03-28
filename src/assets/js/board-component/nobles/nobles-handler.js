function selectNoble(e) {
  const $selectedNoble = e.target.closest("li");
  console.log($selectedNoble);
}

export { selectNoble };