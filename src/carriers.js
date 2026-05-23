const carriers = {
  mtn: {
    name: "MTN Nigeria",
    gateway: (phone) => `${phone}@mtnnigeria.net`
  },
  airtel: {
    name: "Airtel Nigeria",
    gateway: (phone) => `${phone}@ng.airtel.com`
  },
  glo: {
    name: "Glo Nigeria",
    gateway: (phone) => `${phone}@gloworld.com`
  },
  "9mobile": {
    name: "9mobile Nigeria",
    gateway: (phone) => `${phone}@etisalat.com.ng`
  },
  etisalat: {
    name: "9mobile Nigeria",
    gateway: (phone) => `${phone}@etisalat.com.ng`
  }
};

function normalizeCarrier(carrier) {
  return String(carrier || "").trim().toLowerCase();
}

function normalizePhone(phone) {
  return String(phone || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^\+/, "");
}

function getGatewayAddress(phone, carrier) {
  const normalizedCarrier = normalizeCarrier(carrier);
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    throw new Error("Phone number is required.");
  }

  const selectedCarrier = carriers[normalizedCarrier];

  if (!selectedCarrier) {
    throw new Error(`Unsupported carrier: ${carrier}. Use mtn, airtel, glo, or 9mobile.`);
  }

  return {
    carrier: selectedCarrier.name,
    phone: normalizedPhone,
    to: selectedCarrier.gateway(normalizedPhone)
  };
}

module.exports = {
  carriers,
  getGatewayAddress,
  normalizePhone,
  normalizeCarrier
};
