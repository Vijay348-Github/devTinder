const express = require("express");
const emailRoute = express.Router();
const sendEmail = require("../utils/sendemail");

emailRoute.post("/test-email", async (req, res) => {
    console.log("REQ BODY:", req.body);

    const { to } = req.body;

    if (!to) {
        return res.status(400).json({ error: "Email required" });
    }

    try {
        await sendEmail({
            to,
            subject: "Brevo SMTP test",
            text: "If you received this, Brevo is working 🎉",
            html: "<h3>If you received this, Brevo is working 🎉</h3>",
        });

        res.json({ success: true, message: "Email sent" });
    } catch (err) {
        console.error("EMAIL ERROR:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = emailRoute;
