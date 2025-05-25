function getRelativePathIndicators(isUserOnIndexPage) {
    return isUserOnIndexPage ? "." : "..";
}

export { getRelativePathIndicators };
