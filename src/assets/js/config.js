const GROUP_NUMBER = "04";
const GROUP_TOKEN = "Group4-9486-769";

const ERROR_HANDLER_SELECTOR = ".errormessages p";

const LOCAL_SERVER = "http://localhost:8001";
const DEPLOYED_SERVER = "https://project-1.ti.howest.be/2024-2025/splendor/api";
const GROUP_DEPLOYED_SERVER = `https://project-1.ti.howest.be/2024-2025/group-${GROUP_NUMBER}/api`;

const MAX_PRESTIGE_POINTS = 15;

const POLLING_TIME_OUT = 2000;

function getAPIUrl() {
    return DEPLOYED_SERVER;
}

export { getAPIUrl, GROUP_TOKEN, ERROR_HANDLER_SELECTOR, MAX_PRESTIGE_POINTS, POLLING_TIME_OUT };
