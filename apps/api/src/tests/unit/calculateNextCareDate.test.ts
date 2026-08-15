import { describe, expect, it } from "vitest";
import { calculateNextCareDate } from "../../modules/today/today.service.js";

describe("calculateNextCareDate", () => {
	it("must return date plus frequency in days", () => {
		const date = new Date(2026, 0, 1, 14);
		const nextCareDate = calculateNextCareDate(date, 3);

		expect(nextCareDate).toEqual(new Date(2026, 0, 4, 14));
	});

	it("must return date with next month when is the end of the month", () => {
		const date = new Date(2026, 0, 31, 14);
		const nextCareDate = calculateNextCareDate(date, 3);

		expect(nextCareDate).toEqual(new Date(2026, 1, 3, 14));
	});

    it("must return date with next year when is the end of the year", () => {
		const date = new Date(2026, 11, 31, 14);
		const nextCareDate = calculateNextCareDate(date, 3);

		expect(nextCareDate).toEqual(new Date(2027, 0, 3, 14));
	});

    it("must return the same date if 'frequencyDays' is 0", () => {
		const date = new Date(2026, 11, 31, 14);
		const nextCareDate = calculateNextCareDate(date,0);

		expect(nextCareDate).toEqual(date);
	});
});
