function redirectFromIndexToPageInPages(page, relativePathIndicators = ".") {
    location.href = `${relativePathIndicators}/pages/${page}.html`;
}

export { redirectFromIndexToPageInPages };
