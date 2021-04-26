/* eslint-env node */

import express from "express";
import multer from "multer";

import stream from "stream";

import Config from "./lib/Config.js";
import VPProvider from "./lib/VPProvider.js";
import FormGenerator from "./lib/FormGenerator.js";
import Mailer from "./lib/Mailer.js";

var appConfig,
    provider,
    generator,
    mailer,
    app; // express

async function handleVPRequest(req, res) {
    let matriculationNumber = req.params.id,
        results = await provider.requestDocumentedVPsForStudent(matriculationNumber);
    res.json(results);
}

async function handleFormRequest(req, res) {
    let formFormBuffer = await generator.getFormBufferFor({
            title: req.body.title,
            researcher: req.body.name,
            context: req.body.context,
            supervisor: req.body.supervisor,
            chair: req.body.chair,
            vps: req.body.volume
        }),
        readStream = new stream.PassThrough();
    readStream.end(formFormBuffer);
    res.set("Content-disposition", "attachment; filename=" + "VP-Liste.xlsx");
    res.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    readStream.pipe(res);
    mailer.sendGeneratorNotification({
        title: req.body.title,
        researcher: req.body.name,
        context: req.body.context,
        supervisor: req.body.supervisor,
        chair: req.body.chair,
        vps: req.body.volume
    });
}

function setupExpress(port) {
    let upload = multer();
    app = express();
    app.use(express.static("app"));
    app.use(upload.array());
    app.get("/:id/vps", handleVPRequest);
    app.post("/generator", handleFormRequest);
    app.listen(port);
}

function run(port) {
    appConfig = new Config();
    provider = new VPProvider(appConfig);
    generator = new FormGenerator(appConfig);
    mailer = new Mailer(appConfig);
    setupExpress(port);
}

run(process.argv[2]);