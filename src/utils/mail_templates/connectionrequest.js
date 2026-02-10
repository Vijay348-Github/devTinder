// utils/mailTemplates/connectionRequestEmail.js
module.exports = ({ fromName }) => ({
    subject: "New Connection Request 🤝",
    html: `
    <h3>You have a new connection request!</h3>
    <p><b>${fromName}</b> wants to connect with you.</p>
    <p>Open Dev Tinder to accept or reject.</p>
  `,
});
