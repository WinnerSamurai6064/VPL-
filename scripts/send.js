require("dotenv").config();

const { getGatewayAddress } = require("../src/carriers");
const { sendGatewayMessage } = require("../src/mailer");

async function main() {
  const phone = process.argv[2] || process.env.VPL_DEFAULT_PHONE;
  const carrier = process.argv[3] || process.env.VPL_DEFAULT_CARRIER;
  const message = process.argv.slice(4).join(" ") || "VPL test alert";

  const gateway = getGatewayAddress(phone, carrier);

  console.log("Sending gateway SMS attempt...");
  console.log(`Carrier: ${gateway.carrier}`);
  console.log(`Gateway: ${gateway.to}`);
  console.log(`Message: ${message}`);

  const result = await sendGatewayMessage({
    to: gateway.to,
    subject: "VPL CLI Alert",
    message
  });

  console.log("SMTP result:");
  console.log(JSON.stringify(result, null, 2));
  console.log("Note: SMTP accepted does not guarantee carrier SMS delivery.");
}

main().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
