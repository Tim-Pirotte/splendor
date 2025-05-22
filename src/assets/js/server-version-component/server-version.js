import * as API from "../api.js";

function checkCompatibility(minimumServerVersion) {
    const serverVersion = sessionStorage.getItem("serverVersion");

    if (serverVersion !== null) return Promise.resolve(parseInt(serverVersion) >= minimumServerVersion);

    return API.getApiInfo()
        .then(res => {
            const version = res["version"] || "1";
            sessionStorage.setItem("serverVersion", version);
            return parseInt(version) >= minimumServerVersion;
        });
}

function checkCompatibilityFromSessionStorage(minimumServerVersion) {
    return parseInt(sessionStorage.getItem("serverVersion")) >= minimumServerVersion;
}

export { checkCompatibility, checkCompatibilityFromSessionStorage };