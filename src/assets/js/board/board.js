import {dummyData} from "./dummy-data.js";
import {renderPage} from "./renderer.js";

function init() {
  console.log(dummyData);
  renderPage(dummyData);
}

init();