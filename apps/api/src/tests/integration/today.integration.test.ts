import supertest from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app.js";

describe("Today flow", () => {
	it("must successfully register, login, and create a planting to access in /today", async () => {
		const testerData = { email: "JohnDoe@test.com", password: "12345678" };

		const registerRes = await supertest(app)
			.post("/auth/register")
			.send(testerData)
			.expect(201);
		expect(registerRes.body.message).toBe("User created.");

		const loginRes = await supertest(app)
			.post("/auth/login")
			.send(testerData)
			.expect(200);
		expect(loginRes.body).toHaveProperty("accessToken");

		const { accessToken } = loginRes.body;
		expect(accessToken).toBeDefined();

		const bedRes = await supertest(app)
			.post("/beds")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ name: "Bed-1", location: "At backyard" })
			.expect(201);
		expect(bedRes.body.bed).toHaveProperty("id");

		const bedId = bedRes.body.bed.id;
		expect(bedId).toBeDefined();

		const plantingRes = await supertest(app)
			.post(`/beds/${bedId}/plantings`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				species: "tomato",
				plantedAt: "2026-06-15T00:00:00.000Z",
				wateringFrequencyDays: 1,
				fertilizingFrequencyDays: 10,
				estimatedDaysToHarvest: 30,
			})
			.expect(201);
		expect(plantingRes.body.planting).toHaveProperty("id");

		const plantingId = plantingRes.body.planting.id;
		expect(plantingId).toBeDefined();

        const todayRes = await supertest(app)
			.get(`/today`)
			.set("Authorization", `Bearer ${accessToken}`)
			.expect(200);
		expect(todayRes.body.todayOverview[0]).toHaveProperty("id", plantingId);
        expect(todayRes.body.todayOverview[0]).toHaveProperty("pendingActions")

        const todayActions = todayRes.body.todayOverview[0].pendingActions;
		expect(todayActions).toBeDefined();
        expect(todayActions).toContain("WATER")
	});
});
