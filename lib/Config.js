/* eslint-env node */

import { readFileSync } from "fs";

function loadConfig(filePath) {
    let content = readFileSync(filePath),
        configValues = JSON.parse(content);
    return configValues;
}

class Config {

    constructor(filePath = "config.json") {
        let configValues = loadConfig(filePath);
        this.trackingFileURL = configValues.trackingFileURL;
        this.csvSeparator = configValues.csvSeparator;
        this.csvHeaders = configValues.csvHeaders;
        this.firstLineWithData = configValues.firstLineWithData;
        this.formTemplateFile = configValues.formTemplateFile;
        this.formTargetSheetName = configValues.formTargetSheetName;
        this.notificationAddress = configValues.notificationAddress;
        Object.freeze(this);
    }

}

export default Config;