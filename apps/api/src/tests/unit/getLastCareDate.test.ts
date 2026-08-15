import { describe, expect, it } from "vitest";
import { getLastCareDate } from "../../modules/today/today.service.js";

describe("getLastCareDate", () => {
	it("must return 'plantedAt' when 'careLogs' is empty of searched type", () => {
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			careLogs: [{ type: "FERTILIZE", createdAt: new Date(2026, 0, 23) }],
		};
		const lastCareDate = getLastCareDate(planting, "WATER");

		expect(lastCareDate).toEqual(new Date(2026, 0, 1));
	});

	it("must return 'createdAt' of the one log with searched type", () => {
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			careLogs: [{ type: "FERTILIZE", createdAt: new Date(2026, 0, 23) }],
		};
		const lastCareDate = getLastCareDate(planting, "FERTILIZE");

		expect(lastCareDate).toEqual(new Date(2026, 0, 23));
	});

	it("must return 'createdAt' of the latest log into non-cronological array", () => {
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			careLogs: [
				{ type: "WATER", createdAt: new Date(2026, 0, 16) },
				{ type: "WATER", createdAt: new Date(2026, 0, 30) },
				{ type: "WATER", createdAt: new Date(2026, 0, 5) },
			],
		};
		const lastCareDate = getLastCareDate(planting, "WATER");

		expect(lastCareDate).toEqual(new Date(2026, 0, 30));
	});

	it("must return 'createdAt' of the latest log into mixed types array", () => {
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			careLogs: [
                { type: "FERTILIZE", createdAt: new Date(2026, 0, 1) },
				{ type: "WATER", createdAt: new Date(2026, 0, 23) },
				{ type: "FERTILIZE", createdAt: new Date(2026, 0, 5) },
                { type: "FERTILIZE", createdAt: new Date(2026, 0, 29) },
				{ type: "WATER", createdAt: new Date(2026, 0, 30) },
			],
		};
		const lastCareDate = getLastCareDate(planting, "FERTILIZE");

		expect(lastCareDate).toEqual(new Date(2026, 0, 29));
	});
});
