/* eslint-env node */

import express from "express";

import stream from "stream";

import Config from "./lib/Config.js";
import VPProvider from "./lib/VPProvider.js";
import FormGenerator from "./lib/FormGenerator.js";

var appConfig,
    provider,
    generator,
    app; // express

async function handleVPRequest(req, res) {
    let matriculationNumber = req.params.id,
        results = await provider.requestDocumentedVPsForStudent(matriculationNumber);
    res.json(results);
}

async function handleFormRequest(req, res) {
    let formFormBuffer = await generator.getFormBufferFor({
            title: "Remote-Studie zum Coding-Verhalten",
            researcher: "Alexander Bazo",
            context: "Abschlussarbeit",
            supervisor: "Alexander Bazo (Supervisor)",
            chair: "Medieninformatik",
            vps: "1"
        }),
        readStream = new stream.PassThrough();
    readStream.end(formFormBuffer);
    res.set("Content-disposition", "attachment; filename=" + "VP-Liste.xlsx");
    res.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    readStream.pipe(res);
}

function setupExpress(port) {
    app = express();
    app.use(express.static("app"));
    app.get("/:id/vps", handleVPRequest);
    app.get("/generator", handleFormRequest);
    app.listen(port);
}

function run(port) {
    appConfig = new Config();
    provider = new VPProvider(appConfig);
    generator = new FormGenerator(appConfig);
    setupExpress(port);
}

run(process.argv[2]);