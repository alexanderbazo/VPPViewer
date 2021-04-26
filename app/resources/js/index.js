const RESULT_STRING_POSITIVE = "Für die angegebene Matrikelnummer wurden bereits <strong>$VP</strong> VPs dokumentiert (<i>Stand $DATE</i>).",
    RESULT_STRING_NEGATIVE = "Für die angegebene Matrikelnummer wurden noch keine VPs dokumentiert (<i>Stand $DATE</i>).";

function requestVPRecords() {
    let matriculationNumberAsString = document.querySelector(".request-form .matriculation-number").value;
    matriculationNumber = parseInt(matriculationNumberAsString);
    if (matriculationNumber >= 1000000 && matriculationNumber <= 4000000) {
        document.querySelector(".waiting.vps").classList.remove("hidden");
        document.querySelector(".results.vps").classList.add("hidden");
        fetch(`/${matriculationNumber}/vps`).then(response => response.json()).then((result => onResultsAvailable(result)));
    } else {
        showError("Bitte geben Sie eine valide Matrikelnummer ein.")
    }
}

function onResultsAvailable(results) {
    showResults(results);
}

function showResults(results) {
    if (results.vps !== 0) {
        document.querySelector(".results.vps .description").innerHTML = RESULT_STRING_POSITIVE.replace("$VP", results.vps).replace("$DATE", results.lastEdited);
    } else {
        document.querySelector(".results.vps .description").innerHTML = RESULT_STRING_NEGATIVE.replace("$DATE", results.lastEdited);
    }
    document.querySelector(".waiting.vps").classList.add("hidden");
    document.querySelector(".results.vps").classList.remove("hidden");
    document.querySelector(".results.vps").scrollIntoView()
}

function showError(error) {
    document.querySelector(".results.vps .description").innerHTML = error;
    document.querySelector(".waiting.vps").classList.add("hidden");
    document.querySelector(".results.vps").classList.remove("hidden");
    document.querySelector(".results.vps").scrollIntoView()
}

function init() {
    let requestButton = document.querySelector(".request-form.vps .request-button");
    requestButton.addEventListener("click", requestVPRecords);
}

init();