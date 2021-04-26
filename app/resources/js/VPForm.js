/* eslint-env browser */

const RESULT_STRING_POSITIVE = "Für die angegebene Matrikelnummer wurden bereits <strong>$VP</strong> VPs dokumentiert (<i>Stand $DATE</i>).",
    RESULT_STRING_NEGATIVE = "Für die angegebene Matrikelnummer wurden noch keine VPs dokumentiert (<i>Stand $DATE</i>).";

let waitingDialog,
    resultsElement,
    formElement;

function getValidatedInput(input) {
    let matriculationNumber = parseInt(input);
    if (matriculationNumber >= 1000000 && matriculationNumber <= 4000000) {
        return matriculationNumber;
    }
    return undefined;
}

function requestVPRecords() {
    let matriculationNumberAsString = formElement.querySelector(".matriculation-number").value,
        validatedInput = getValidatedInput(matriculationNumberAsString);
    if (validatedInput !== undefined) {
        showWaitingDialog();
        fetch(`/${validatedInput}/vps`).then(response => response.json()).then((result => showResults(result)));
    } else {
        showError("Bitte geben Sie eine valide Matrikelnummer ein.")
    }
}

function showWaitingDialog() {
    waitingDialog.classList.remove("hidden");
    resultsElement.classList.add("hidden");
}

function hideWaitingDialog() {
    waitingDialog.classList.add("hidden");
    resultsElement.classList.remove("hidden");
}

function showResults(results) {
    let resultDescriptionElement = resultsElement.querySelector(".description");
    if (results.vps !== 0) {
        resultDescriptionElement.innerHTML = RESULT_STRING_POSITIVE.replace("$VP", results.vps).replace("$DATE", results.lastEdited);
    } else {
        resultDescriptionElement.innerHTML = RESULT_STRING_NEGATIVE.replace("$DATE", results.lastEdited);
    }
    hideWaitingDialog();
    resultDescriptionElement.scrollIntoView()
}

function showError(error) {
    let resultDescriptionElement = resultsElement.querySelector(".description");
    resultDescriptionElement.innerHTML = error;
    hideWaitingDialog();
    resultDescriptionElement.scrollIntoView();

}

function init() {
    let requestButton = document.querySelector(".request-form.vps .request-button");
    formElement = document.querySelector(".request-form.vps");
    waitingDialog = document.querySelector(".vps .waiting");
    resultsElement = document.querySelector(".vps .results");
    requestButton.addEventListener("click", requestVPRecords);
}

export default {
    init: init
};