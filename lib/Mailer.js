/* eslint-env node */

import nodemailer from "nodemailer";

const MAIL_TEMPLATE = "<h1>Versuchspersonenstunden</h1>\
<p>Soeben wurde ein Formular zur Erfassung von Versuchspersonsenstunden generiert:</p>\
<ul>\
<li>Versuchtsleitung: $researcher</li>\
<li>Betreuer*in: $supervisor</li>\
<li>Lehrstuhl: $chair</li>\
<li>Title: $title</li>\
<li>Anzahl VPs: $vps</li>\
</ul>";

function createMailBody(data) {
    let body = MAIL_TEMPLATE;
    body = body.replace("$researcher", data.researcher);
    body = body.replace("$supervisor", data.supervisor);
    body = body.replace("$chair", data.chair);
    body = body.replace("$title", data.title);
    body = body.replace("$vps", data.vps);
    return body;
}

class Mailer {

    constructor(config) {
        this.config = config;
        this.transporter = nodemailer.createTransport(this.config.mailer);
    }

    sendGeneratorNotification(data) {
        this.transporter.sendMail({
            from: this.config.mailer.address,
            to: this.config.notificationAddress,
            subject: "Formular für Versuchspersonen generiert",
            html: createMailBody(data)
        });
    }

}

export default Mailer;