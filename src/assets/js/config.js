const GROUPNUMBER = "04";
const GROUPTOKEN = "Group4-9486-769";

const ERRORHANDLERSELECTOR = ".errormessages p";

const LOCALSERVER = `http://localhost:8001`;
const DEPLOYEDSERVER = `https://project-1.ti.howest.be/2024-2025/splendor/api`;
const GROUPDEPLOYEDSERVER = `https://project-1.ti.howest.be/2024-2025/group-${GROUPNUMBER}/api`;

const MAX_PRESTIGE_POINTS = 15;

const POLLING_TIME_OUT = 2000;

function getAPIUrl() {
  return DEPLOYEDSERVER;
}

export { getAPIUrl, GROUPTOKEN, ERRORHANDLERSELECTOR, MAX_PRESTIGE_POINTS, POLLING_TIME_OUT };
