const request = require("supertest");

process.env.NODE_ENV = "test";
process.env.API_KEY = "test-secret-key";

const app = require("../src/app");

describe("LunarOps Control API - Security and Functionality Tests", () => {
  test("GET /health should return service status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("lunarops-control");
    expect(response.body.timestamp).toBeDefined();
  });

  test("GET /mission/status should reject request without API key", async () => {
    const response = await request(app).get("/mission/status");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized. Invalid or missing API key.");
  });

  test("GET /mission/status should reject request with invalid API key", async () => {
    const response = await request(app)
      .get("/mission/status")
      .set("x-api-key", "wrong-key");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized. Invalid or missing API key.");
  });

  test("GET /mission/status should allow request with valid API key", async () => {
    const response = await request(app)
      .get("/mission/status")
      .set("x-api-key", "test-secret-key");

    expect(response.statusCode).toBe(200);
    expect(response.body.mission).toBe("LunarOps Control");
    expect(response.body.environment).toBe("Simulated Lunar Infrastructure");
    expect(response.body.status).toBe("operational");
  });

  test("POST /telemetry should reject incomplete payload", async () => {
    const incompletePayload = {
      moduleId: "HAB-01",
      oxygenLevel: 21
    };

    const response = await request(app)
      .post("/telemetry")
      .set("x-api-key", "test-secret-key")
      .send(incompletePayload);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain("Missing required fields");
  });

  test("POST /telemetry should accept normal telemetry without alerts", async () => {
    const normalTelemetry = {
      moduleId: "HAB-01",
      oxygenLevel: 21,
      batteryLevel: 78,
      temperature: 22,
      radiationLevel: 0.8
    };

    const response = await request(app)
      .post("/telemetry")
      .set("x-api-key", "test-secret-key")
      .send(normalTelemetry);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Telemetry received successfully.");
    expect(response.body.alerts).toEqual([]);
    expect(response.body.telemetry.moduleId).toBe("HAB-01");
    expect(response.body.telemetry.receivedAt).toBeDefined();
  });

  test("POST /telemetry should generate critical alerts for unsafe telemetry", async () => {
    const criticalTelemetry = {
      moduleId: "HAB-02",
      oxygenLevel: 17.8,
      batteryLevel: 12,
      temperature: -145,
      radiationLevel: 3.1
    };

    const response = await request(app)
      .post("/telemetry")
      .set("x-api-key", "test-secret-key")
      .send(criticalTelemetry);

    expect(response.statusCode).toBe(201);
    expect(response.body.alerts.length).toBeGreaterThanOrEqual(4);

    const alertTypes = response.body.alerts.map((alert) => alert.type);

    expect(alertTypes).toContain("LOW_OXYGEN");
    expect(alertTypes).toContain("LOW_BATTERY");
    expect(alertTypes).toContain("EXTREME_TEMPERATURE");
    expect(alertTypes).toContain("HIGH_RADIATION");
  });

  test("GET /alerts should reject request without API key", async () => {
    const response = await request(app).get("/alerts");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized. Invalid or missing API key.");
  });

  test("GET /alerts should return alerts with valid API key", async () => {
    const response = await request(app)
      .get("/alerts")
      .set("x-api-key", "test-secret-key");

    expect(response.statusCode).toBe(200);
    expect(response.body.alerts).toBeDefined();
    expect(Array.isArray(response.body.alerts)).toBe(true);
  });
});