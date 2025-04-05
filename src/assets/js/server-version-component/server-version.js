import {getApiInfo} from "../api.js";

function isCompatible(minimumServerVersion) {
    const serverVersion = sessionStorage.getItem("serverVersion");

    if (serverVersion !== null) return Promise.resolve(parseInt(serverVersion) >= minimumServerVersion);

    return getApiInfo()
        .then(res => {
            const serverVersion = res["version"] || "1";
            setServerVersion(serverVersion);
            return parseInt(serverVersion) >= minimumServerVersion;
        });
}

function setServerVersion(serverVersion) {
    sessionStorage.setItem("serverVersion", serverVersion);
}

export { isCompatible };