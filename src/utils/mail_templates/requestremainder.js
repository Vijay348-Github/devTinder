const pendingReminderTemplate = ({ name, count }) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hello ${name},</h2>
            
            <p>You have <strong>${count}</strong> pending connection request(s)
            that are older than 24 hours.</p>

            <p>Please log in to your account to review them.</p>

            <br/>
            <a href="http://52.91.222.110/login"
               style="background-color:#2563eb;
                      color:white;
                      padding:10px 20px;
                      text-decoration:none;
                      border-radius:5px;">
               View Requests
            </a>

            <p style="margin-top:30px; font-size:12px; color:gray;">
                — Connect Team
            </p>
        </div>
    `;
};

module.exports = pendingReminderTemplate;