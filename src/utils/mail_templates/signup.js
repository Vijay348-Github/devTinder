// utils/mailTemplates/welcomeEmail.js
module.exports = ({ name }) => ({
  subject: "Welcome to Dev Tinder 🚀",
  html: `
    <h2>Welcome, ${name} 👋</h2>
    <p>You’re officially part of Dev Tinder.</p>
    <p>Start connecting with new people now 💻❤️</p>
    <br />
    <p>– Dev Tinder Team</p>
  `,
});
