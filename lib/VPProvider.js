/* eslint-env node */

import fetch from "node-fetch";
import csv from "csv-parser";
import { Readable } from "stream";

async function downloadCurrentTrackingRecords(trackingFileURL) {
    let response = await fetch(trackingFileURL),
        result = await response.text();
    return result;
}


function createLiveDataSet(config) {
    /**
     * Note: Using Promise-syntax here to prevent errors since other approaches did cause errors where objects
     * instead of strings where passed to csv parser
     */
    return new Promise(async function(resolve, reject) {
        let results = [],
            records = await downloadCurrentTrackingRecords(config.trackingFileURL);
        Readable.from(records).pipe(csv({
                separator: config.csvSeparator,
                skipLines: config.firstLineWithData - 1,
                headers: config.csvHeaders
            }))
            .on("data", (data) => results.push(data))
            .on("end", () => {
                resolve(results);
            });
    });
}

async function getVPsForStudentWith(matriculationNumber, config) {
    let data = await createLiveDataSet(config),
        vps = 0;
    data.forEach(entry => {
        if (parseInt(entry.matriculationNumber) === parseInt(matriculationNumber)) {
            vps += parseFloat(entry.numberOfVPs.replace(",", "."));
        }
    });
    return {
        matriculationNumber: matriculationNumber,
        vps: vps,
        lastEdited: data[data.length - 1].dateOfEntry
    };
}


class VPProvider {

    constructor(config) {
        this.config = config;
    }

    async requestDocumentedVPsForStudent(matriculationNumber) {
        let vps = await getVPsForStudentWith(matriculationNumber, this.config);
        return vps;
    }


}

export default VPProvider;