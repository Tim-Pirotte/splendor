import {dummyData} from "./dummy-data.js";
import {renderPage} from "./renderer/renderer.js";
import * as token from "./token/token.js";

function init() {
  renderPage(dummyData);
  token.init()
}

init();