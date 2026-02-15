const cron = require("node-cron");
const { subDays } = require("date-fns");
const ConnectionRequest = require("../models/connectionrequest");
const sendEmail = require("../utils/sendemail");
const pendingReminderTemplate = require("../utils/mail_templates/requestremainder");

cron.schedule("0 8 * * *", async () => {
    console.log("⏰ Running daily pending request reminder job...");

    try {
        // Finding requests older than 24 hours & still pending
        const pendingConnections = await ConnectionRequest.find({
            status: "interested",
            createdAt: { $lte: subDays(new Date(), 1) },
        }).populate("toId");

        if (!pendingConnections.length) {
            console.log("✅ No pending reminders to send today.");
            return;
        }

        const userMap = {};

        pendingConnections.forEach((req) => {
            if (req.toId && req.toId.email) {
                const email = req.toId.email;

                if (!userMap[email]) {
                    userMap[email] = {
                        name: req.toId.firstName || "User",
                        count: 0,
                    };
                }

                userMap[email].count += 1;
            }
        });

        // 3️⃣ Send one email per user
        for (const email in userMap) {
            const { name, count } = userMap[email];

            try {
                await sendEmail({
                    to: email,
                    subject: `You have ${count} pending connection request(s)`,
                    text: `Hi ${name}, you have ${count} pending connection request(s) waiting.`,
                    html: pendingReminderTemplate({ name, count }),
                });
            } catch (error) {
                console.error(`Failed to send email to ${email}:`, error);
            }
        }

        console.log("🎉 Reminder job completed successfully.");
    } catch (error) {
        console.error("🔥 Error in reminder cron job:", error);
    }
});
