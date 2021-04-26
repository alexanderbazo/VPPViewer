/* eslint-env browser */

let waitingDialog,
    resultsElement,
    formElement;

function validateInputElements(inputElements) {
    let invalidElements = 0,
        validElements = {};
    for (let el in inputElements) {
        if (!inputElements.hasOwnProperty(el)) {
            continue;
        }
        let isValid = inputElements[el].checkValidity();
        if (!isValid) {
            inputElements[el].classList.add("invalid");
            invalidElements++;
        } else {
            validElements[el] = inputElements[el].value;
        }
    }
    if (invalidElements === 0) {
        return validElements;
    } else {
        return undefined;
    }
}

function requestForm() {
    let validatedElements = validateInputElements({
        name: formElement.querySelector(".name"),
        email: formElement.querySelector(".email"),
        supervisor: formElement.querySelector(".supervisor"),
        chair: formElement.querySelector(".chair"),
        context: formElement.querySelector(".context"),
        title: formElement.querySelector(".title"),
        volume: formElement.querySelector(".volume"),
    });
    if (validatedElements !== undefined) {
        let formData = new FormData();
        for (let el in validatedElements) {
            if (!validatedElements.hasOwnProperty(el)) {
                continue;
            }
            formData.append(el, validatedElements[el]);
        }
        showWaitingDialog();
        // TODO Add Error handling
        fetch("/generator", { body: formData, method: "post" }).then((response) => response.blob()).then(onFileAvailable);
    }
}

function onFileAvailable(blob) {
    let url = window.URL.createObjectURL(blob),
        downloadElement = document.createElement("a");
    downloadElement.href = url;
    downloadElement.download = "VP-Formular-Medieninformatik.xlsx";
    document.body.append("downloadElement");
    downloadElement.click();
    downloadElement.remove();
    URL.revokeObjectURL(url);
}

function showWaitingDialog() {
    waitingDialog.classList.remove("hidden");
    resultsElement.classList.add("hidden");
}

function hideWaitingDialog() {
    waitingDialog.classList.add("hidden");
    resultsElement.classList.remove("hidden");
}


function clearValidationClass(event) {
    event.target.classList.remove("invalid")
}

function init() {
    let requestButton = document.querySelector(".request-form.generator .request-button");
    formElement = document.querySelector(".request-form.generator");
    waitingDialog = document.querySelector(".generator .waiting");
    resultsElement = document.querySelector(".generator .results");
    formElement.querySelectorAll("input").forEach((el) => el.addEventListener("focus", clearValidationClass));
    requestButton.addEventListener("click", requestForm);
}

export default {
    init: init
};