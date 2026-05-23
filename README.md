# VPL - Virtual Phone Line

VPL is an experimental personal VM alert sender.

It attempts to send messages through email-to-SMS carrier gateways:

```text
VM/app -> SMTP email -> carrier email gateway -> SMS attempt
```

## Important warning

This is not reliable enough for OTP, password resets, production user notifications, bulk messaging, or customer communication.

Use it only for personal VM alerts and experiments.

## Supported experimental gateways

- MTN Nigeria
- Airtel Nigeria
- Glo Nigeria
- 9mobile Nigeria

Carrier gateways may be blocked, delayed, deprecated, or silently ignored.

## Run with Docker Compose

Create a private local `.env` file beside this README. Do not commit it.

Required local values:

```text
PORT=7070
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your mail login
SMTP_PASS=your mail app password
SMTP_FROM=your sender address
VPL_DEFAULT_PHONE=07000000000
VPL_DEFAULT_CARRIER=mtn
```

Then run:

```bash
docker compose --env-file .env up --build
```

Health check:

```bash
curl http://127.0.0.1:7070/health
```

Send test:

```bash
curl -X POST http://127.0.0.1:7070/send \
  -H "Content-Type: application/json" \
  -d '{"phone":"07000000000","carrier":"mtn","message":"VPL test alert"}'
```

## Run without Docker

```bash
npm install
npm start
```

CLI test:

```bash
npm run send -- 07000000000 mtn "VPL test alert"
```

## Windows + Docker Desktop note

On Windows with Docker Desktop and WSL/Debian, run from inside the cloned repo:

```bash
docker compose --env-file .env up --build
```

Then visit:

```text
http://localhost:7070/health
```
