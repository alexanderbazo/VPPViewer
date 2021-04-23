const RESULT_STRING_POSITIVE = "VPs wurden bereits für die angegebene Matrikelnummer dokumentiert",
    RESULT_STRING_NEGATIVE = "Für die angegebene Matrikelnummer wurden noch keine VPs dokumentiert";

function requestVPRecords() {
    let matriculationNumberAsString = document.querySelector(".vp-request-form .matriculation-number").value;
    matriculationNumber = parseInt(matriculationNumberAsString);
    if (matriculationNumber >= 1000000 && matriculationNumber <= 4000000) {
        document.querySelector(".waiting").classList.remove("hidden");
        document.querySelector(".results").classList.add("hidden");
        fetch(`/${matriculationNumber}/vps`).then(response => response.json()).then((result => onResultsAvailable(result)));
    } else {
        showError("Bitte geben Sie eine valide Matrikelnummer ein.")
    }
}

function onResultsAvailable(results) {
    showVPs(results.vps);
}

function showVPs(vps) {
    document.querySelector(".results .vps").innerHTML = vps;
    if (vps !== 0) {
        document.querySelector(".results .description").innerHTML = RESULT_STRING_POSITIVE;
    } else {
        document.querySelector(".results .description").innerHTML = RESULT_STRING_NEGATIVE;
    }
    document.querySelector(".waiting").classList.add("hidden");
    document.querySelector(".results").classList.remove("hidden");
    document.querySelector(".results").scrollIntoView()
}

function showError(error) {
    document.querySelector(".results").innerHTML = error;
    document.querySelector(".waiting").classList.add("hidden");
    document.querySelector(".results").classList.remove("hidden");
    document.querySelector(".results").scrollIntoView()
}

function init() {
    let requestButton = document.querySelector(".vp-request-form .request-button");
    requestButton.addEventListener("click", requestVPRecords);
}

init();