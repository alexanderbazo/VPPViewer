/* eslint-env node */

import fetch from "node-fetch";
import ExcelJS from "exceljs";

async function createWorkbookFromTemplate(templateFileURL) {
    let response = await fetch(templateFileURL),
        buffer = await response.buffer(),
        workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    return workbook;
}

async function updateWorkbookForExperiment(workbook, targetSheet, experiment) {
    let sheet = workbook.getWorksheet(targetSheet);
    // TODO Define mapping in config file?
    sheet.getCell("A3").value = experiment.title;
    sheet.getCell("E6").value = experiment.vps;
    sheet.getCell("F6").value = experiment.researcher;
    sheet.getCell("G6").value = experiment.context;
    sheet.getCell("H6").value = experiment.chair;
    sheet.getCell("I6").value = experiment.supervisor;
}

class FormGenerator {

    constructor(config) {
        this.config = config;
    }

    async getFormBufferFor(experiment) {
        let workbook = await createWorkbookFromTemplate(this.config.formTemplateFile);
        updateWorkbookForExperiment(workbook, this.config.formTargetSheetName, experiment);
        return workbook.xlsx.writeBuffer();
    }

}

export default FormGenerator;