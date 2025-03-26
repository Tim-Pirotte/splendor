import { getResults } from "./helper";

function renderResultStatus(isWinner){
    
}

function renderResultTable(){

}

function renderResults() {
    getResults().then(data => {
        renderResultStatus(data[0].name === "DFD");
        renderResultTable(data);
    });
}


export { renderResults };