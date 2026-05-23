const nodemailer = require("nodemailer");

function env(name, fallback = "") {
  return process.env[name] || fallback;
}

function createTransporter() {
  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT", "587"));
  const secure = String(env("SMTP_SECURE", "false")).toLowerCase() === "true";
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS") || env("SMTP_AUTH_SECRET");

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your local environment.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });
}

async function sendGatewayMessage({ to, message, subject = "VPL Alert" }) {
  const transporter = createTransporter();

  const result = await transporter.sendMail({
    from: env("SMTP_FROM") || env("SMTP_USER"),
    to,
    subject,
    text: message
  });

  return {
    accepted: result.accepted,
    rejected: result.rejected,
    messageId: result.messageId
  };
}

module.exports = {
  sendGatewayMessage
};
