const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const connectionRequest = require("../models/connectionrequest");
const sendEmail = require("./sendemail");

cron.schedule("0 8 * * *", async () => {
    try {
        const pendingConnections = await connectionRequest
            .find({
                status: "interested",
                createdAt: { $lte: subDays(new Date(), 1) },
            })
            .populate("fromId toId");

        const listOfEmailIds = [
            ...new Set(
                pendingConnections
                    .filter((r) => r.toId && r.toId.email)
                    .map((r) => r.toId.email),
            ),
        ];
        for (const email of listOfEmailIds) {
            try {
                const emailResponse = await sendEmail({
                    to: email,
                    subject: "Pending Connection Requests",
                    text: "You have pending connection requests from yesterday. Please check your account for more details.",
                    html: `
        <h2>Pending Connection Requests</h2>
        <p>You have pending connection requests which are older than 24 hours.</p>
        <p>Please log in to your account to review them.</p>
    `,
                });

                console.log(`Email sent to ${email}:`, emailResponse);
            } catch (error) {
                console.error(`Error sending email to ${email}:`, error);
            }
        }
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});
