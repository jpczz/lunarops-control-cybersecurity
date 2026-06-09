const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

const missionState = {
  mission: "LunarOps Control",
  environment: "Simulated Lunar Infrastructure",
  status: "operational",
  lastTelemetry: null,
  alerts: []
};

function apiKeyMiddleware(req, res, next) {
  const receivedApiKey = req.header("x-api-key");
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    return res.status(500).json({
      error: "API key is not configured on the server."
    });
  }

  if (!receivedApiKey || receivedApiKey !== expectedApiKey) {
    return res.status(401).json({
      error: "Unauthorized. Invalid or missing API key."
    });
  }

  next();
}

function validateTelemetryPayload(payload) {
  const requiredFields = [
    "moduleId",
    "oxygenLevel",
    "batteryLevel",
    "temperature",
    "radiationLevel"
  ];

  const missingFields = requiredFields.filter((field) => payload[field] === undefined);

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`
    };
  }

  if (
    typeof payload.moduleId !== "string" ||
    typeof payload.oxygenLevel !== "number" ||
    typeof payload.batteryLevel !== "number" ||
    typeof payload.temperature !== "number" ||
    typeof payload.radiationLevel !== "number"
  ) {
    return {
      valid: false,
      message: "Invalid payload types. Check telemetry field types."
    };
  }

  return {
    valid: true
  };
}

function analyzeTelemetry(telemetry) {
  const alerts = [];

  if (telemetry.oxygenLevel < 19.5) {
    alerts.push({
      level: "critical",
      type: "LOW_OXYGEN",
      message: "Oxygen level below safe threshold."
    });
  }

  if (telemetry.batteryLevel < 20) {
    alerts.push({
      level: "high",
      type: "LOW_BATTERY",
      message: "Battery level is below operational threshold."
    });
  }

  if (telemetry.temperature < -120 || telemetry.temperature > 80) {
    alerts.push({
      level: "critical",
      type: "EXTREME_TEMPERATURE",
      message: "Temperature outside safe operational range."
    });
  }

  if (telemetry.radiationLevel > 2.5) {
    alerts.push({
      level: "critical",
      type: "HIGH_RADIATION",
      message: "Radiation level above safe threshold."
    });
  }

  return alerts;
}

app.get("/", (req, res) => {
  res.json({
    message: "LunarOps Control API",
    description: "Secure API for simulated lunar logistics and telemetry operations."
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "lunarops-control",
    timestamp: new Date().toISOString()
  });
});

app.get("/mission/status", apiKeyMiddleware, (req, res) => {
  res.json(missionState);
});

app.post("/telemetry", apiKeyMiddleware, (req, res) => {
  const validation = validateTelemetryPayload(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      error: validation.message
    });
  }

  const telemetry = {
    ...req.body,
    receivedAt: new Date().toISOString()
  };

  const generatedAlerts = analyzeTelemetry(telemetry);

  missionState.lastTelemetry = telemetry;
  missionState.alerts = generatedAlerts;

  res.status(201).json({
    message: "Telemetry received successfully.",
    telemetry,
    alerts: generatedAlerts
  });
});

app.get("/alerts", apiKeyMiddleware, (req, res) => {
  res.json({
    alerts: missionState.alerts
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON payload.",
      details: "The request body must be a valid JSON object."
    });
  }

  return res.status(500).json({
    error: "Internal server error."
  });
});

module.exports = app;