const nodemailer = require("nodemailer");

console.log("SMTP USER:", process.env.BREVO_SMTP_USER);
console.log("SMTP KEY:", process.env.BREVO_SMTP_KEY);

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

const sendEmail = async ({ to, subject, text, html }) => {
    console.log("SEND EMAIL TO:", to);

    if (!to) {
        throw new Error("Recipient email missing");
    }

    return transporter.sendMail({
        from: `"Connect" <connect.noreply2026@gmail.com>`,
        to,
        subject,
        text,
        html,
    });
};

module.exports = sendEmail;
