function redirectFromIndexToPageInPages(page, relativePathIndicators = ".") {
    location.href = `${relativePathIndicators}/pages/${page}.html`;
}

function navigateToMain(e) {
    location.href = "../index.html";
}

export { redirectFromIndexToPageInPages, navigateToMain };
