import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isHarvestReady } from "../../modules/today/today.service.js";

describe("isHarvestReady", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("must return true when 'estimatedDateToHarvest' is lower than now date", () => {
		vi.setSystemTime(new Date(2026, 1, 2));
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			estimatedDaysToHarvest: 30,
		};

		const verdict = isHarvestReady(planting);

		expect(verdict).toBe(true);
	});

	it("must return false when 'estimatedDateToHarvest' is greater than now date", () => {
		vi.setSystemTime(new Date(2026, 0, 30));
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			estimatedDaysToHarvest: 30,
		};

		const verdict = isHarvestReady(planting);

		expect(verdict).toBe(false);
	});

    it("must return true when 'estimatedDateToHarvest' is equal now date", () => {
		vi.setSystemTime(new Date(2026, 0, 31));
		const planting = {
			plantedAt: new Date(2026, 0, 1),
			estimatedDaysToHarvest: 30,
		};

		const verdict = isHarvestReady(planting);

		expect(verdict).toBe(true);
	});
});
