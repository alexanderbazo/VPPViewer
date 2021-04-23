/* eslint-env node */

import express from "express";

import Config from "./lib/Config.js";
import VPProvider from "./lib/VPProvider.js";

var appConfig,
    provider,
    app; // express

async function handleVPRequest(req, res) {
    let matriculationNumber = req.params.id,
        vps = await provider.requestDocumentedVPsForStudent(matriculationNumber);
    res.json({
        matriculationNumber: matriculationNumber,
        vps: vps
    });
}

function setupExpress(port) {
    app = express();
    app.use(express.static("app"));
    app.get("/:id/vps", handleVPRequest);
    app.listen(port);
}

function run(port) {
    appConfig = new Config();
    provider = new VPProvider(appConfig);
    setupExpress(port);
}

run(process.argv[2]);