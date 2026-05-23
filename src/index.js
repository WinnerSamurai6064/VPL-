require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { getGatewayAddress, carriers } = require("./carriers");
const { sendGatewayMessage } = require("./mailer");

const app = express();
const port = Number(process.env.PORT || 7070);

app.use(helmet());
app.use(express.json({ limit: "50kb" }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 20 }));

app.get("/", (req, res) => {
  res.json({
    ok: true,
    app: "VPL - Virtual Phone Line",
    warning: "Experimental email-to-SMS gateway sender. Not reliable for OTP or production messaging.",
    carriers: Object.keys(carriers)
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, status: "alive" });
});

app.post("/send", async (req, res) => {
  try {
    const phone = req.body.phone || process.env.VPL_DEFAULT_PHONE;
    const carrier = req.body.carrier || process.env.VPL_DEFAULT_CARRIER;
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ ok: false, error: "message is required." });
    }

    const gateway = getGatewayAddress(phone, carrier);
    const result = await sendGatewayMessage({
      to: gateway.to,
      subject: req.body.subject || "VPL Alert",
      message
    });

    res.json({
      ok: true,
      gateway,
      result,
      note: "SMTP accepted does not guarantee SMS delivery by the carrier."
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`VPL running on port ${port}`);
});
