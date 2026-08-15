import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPendingActions } from "../../modules/today/today.service.js";

describe("getPendingActions", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("return an empty array if there's no types of pendency", () => {
		vi.setSystemTime(new Date(2026, 0, 4));
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			estimatedDaysToHarvest: 30,
			wateringFrequencyDays: 2,
			fertilizingFrequencyDays: 10,
			careLogs: [{ type: "WATER", createdAt: new Date(2026, 0, 3) }],
		};

		const pendencies = getPendingActions(planting);

		expect(pendencies).toEqual([]);
	});

	it("return an array with only one types of pendency", () => {
		vi.setSystemTime(new Date(2026, 0, 3));
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			estimatedDaysToHarvest: 30,
			wateringFrequencyDays: 2,
			fertilizingFrequencyDays: 10,
			careLogs: [],
		};

		const pendencies = getPendingActions(planting);

		expect(pendencies).toHaveLength(1);
		expect(pendencies).toEqual(["WATER"]);
	});

	it("return an array with two types of pendency", () => {
		vi.setSystemTime(new Date(2026, 0, 11));
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			estimatedDaysToHarvest: 30,
			wateringFrequencyDays: 2,
			fertilizingFrequencyDays: 10,
			careLogs: [
				{ type: "WATER", createdAt: new Date(2026, 0, 3) },
				{ type: "WATER", createdAt: new Date(2026, 0, 5) },
				{ type: "WATER", createdAt: new Date(2026, 0, 7) },
				{ type: "WATER", createdAt: new Date(2026, 0, 9) },
			],
		};

		const pendencies = getPendingActions(planting);

		expect(pendencies).toHaveLength(2);
		expect(pendencies).toEqual(["WATER", "FERTILIZE"]);
	});

	it("return an array with all types of pendency", () => {
		vi.setSystemTime(new Date(2026, 0, 31));
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			estimatedDaysToHarvest: 30,
			wateringFrequencyDays: 5,
			fertilizingFrequencyDays: 10,
			careLogs: [
				{ type: "WATER", createdAt: new Date(2026, 0, 6) },
				{ type: "WATER", createdAt: new Date(2026, 0, 11) },
				{ type: "FERTILIZE", createdAt: new Date(2026, 0, 11) },
				{ type: "WATER", createdAt: new Date(2026, 0, 16) },
				{ type: "WATER", createdAt: new Date(2026, 0, 21) },
				{ type: "FERTILIZE", createdAt: new Date(2026, 0, 21) },
				{ type: "WATER", createdAt: new Date(2026, 0, 26) },
			],
		};

		const pendencies = getPendingActions(planting);

		expect(pendencies).toHaveLength(3);
		expect(pendencies).toEqual(["WATER", "FERTILIZE", "HARVEST"]);
	});
});
