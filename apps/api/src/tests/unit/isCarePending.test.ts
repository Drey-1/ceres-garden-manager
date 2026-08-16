import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isCarePending } from "../../modules/today/today.service.js";

describe("isCarePending", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("must return true when 'nextCareDate' is lower than now date", () => {
		vi.setSystemTime(new Date(2026, 0, 30));

		const planting = {
			plantedAt: new Date(2026, 0, 1),
			careLogs: [{ type: "WATER", createdAt: new Date(2026, 0, 1) }],
		};
		const verdict = isCarePending(planting, "WATER", 2);

		expect(verdict).toBe(true);
	});

	it("must return false when 'nextCareDate' is greater than now date", () => {
		vi.setSystemTime(new Date(2026, 0, 30));

		const planting = {
			plantedAt: new Date(2026, 0, 1),
			careLogs: [
				{ type: "WATER", createdAt: new Date(2026, 0, 1) },
				{ type: "WATER", createdAt: new Date(2026, 0, 29) },
			],
		};
		const verdict = isCarePending(planting, "WATER", 2);

		expect(verdict).toBe(false);
	});

	it("must return true when 'nextCareDate' is equal now date", () => {
		vi.setSystemTime(new Date(2026, 0, 3));

		const planting = {
			plantedAt: new Date(2026, 0, 1),
			careLogs: [{ type: "WATER", createdAt: new Date(2026, 0, 1) }],
		};
		const verdict = isCarePending(planting, "WATER", 2);

		expect(verdict).toBe(true);
	});

	it("must return depending on the date of plantedAt when careLogs is empty", () => {
		vi.setSystemTime(new Date(2026, 0, 3));

		const planting = {
			plantedAt: new Date(2026, 0, 1),
			careLogs: [],
		};
		const verdict = isCarePending(planting, "WATER", 2);

		expect(verdict).toBe(true);
	});
});
