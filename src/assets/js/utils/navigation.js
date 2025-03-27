/*** Redirect to the specified game page ***/
function redirectToPage(page, relativePathIndicators = ".") {
    location.href = `${relativePathIndicators}/pages/${page}.html`;
}

export { redirectToPage };
