import {getApiInfo} from "../api.js";

function initServerVersion() {
    if (sessionStorage.getItem("serverVersion") !== null) return;

    getApiInfo()
        .then(res => setServerVersion(res))
        .catch();
}

function setServerVersion(res) {
    if ("version" in res) {
        sessionStorage.setItem("serverVersion", res["version"]);
    } else {
        sessionStorage.setItem("serverVersion", "V1");
    }
}

function isV2Server() {
    return sessionStorage.getItem("serverVersion") === "V2";
}

initServerVersion();


export { isV2Server };