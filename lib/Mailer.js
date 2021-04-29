/* eslint-env node */

import nodemailer from "nodemailer";
import fs from "fs";
import { start } from "repl";

function createMailBody(data, template) {
    let startDateAsLocalString = new Date(data.startDate).toLocaleDateString(),
        endDateAsLocalString = new Date(data.endDate).toLocaleDateString(),
        creationDateAsLocalString = new Date(data.createdAt).toLocaleDateString(),
        body = template;
    body = body.replace("$researcher", data.researcher);
    body = body.replace("$contactMail", data.contactMail);
    body = body.replace("$title", data.title);
    body = body.replace("$context", data.context);
    body = body.replace("$supervisor", data.supervisor);
    body = body.replace("$chair", data.chair);
    body = body.replace("$startDate", startDateAsLocalString);
    body = body.replace("$endDate", endDateAsLocalString);
    body = body.replace("$createdAt", creationDateAsLocalString);
    body = body.replace("$vps", data.vps);
    return body;
}

class Mailer {

    constructor(config) {
        this.config = config;
        this.template = fs.readFileSync(this.config.emailTemplate, "utf-8");
        this.transporter = nodemailer.createTransport(this.config.mailer);
    }

    sendGeneratorNotification(data) {
        this.transporter.sendMail({
            from: this.config.mailer.address,
            to: this.config.notificationAddress,
            subject: "Formular für Versuchspersonen generiert",
            html: createMailBody(data, this.template)
        });
    }

}

export default Mailer;