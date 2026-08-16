import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { toDateOnly } from "../../utils/toDateOnly.js";

describe("toDateOnly", () => {
	beforeEach(() => {
		vi.stubEnv("TZ", "America/Sao_Paulo");
		process.env.TZ = "America/Sao_Paulo";
	});
	afterAll(() => {
		vi.unstubAllEnvs();
	});
	it("must reset date time to midnight of the same day", () => {
		const dateUTC = new Date(Date.UTC(2026, 0, 1, 12));
		const formattedDate = toDateOnly(dateUTC);

		expect(formattedDate).toEqual(new Date(Date.UTC(2026, 0, 1, 0)));
	});

	it("must not shift the date when time is close to day boundary", () => {
		const startOfDay = new Date(Date.UTC(2026, 0, 1, 1));
		const endOfDay = new Date(Date.UTC(2026, 0, 1, 23));
		const formattedStart = toDateOnly(startOfDay);
		const formattedEnd = toDateOnly(endOfDay);

		expect(formattedStart).toEqual(new Date(Date.UTC(2026, 0, 1, 0)));
		expect(formattedEnd).toEqual(new Date(Date.UTC(2026, 0, 1, 0)));
	});

	it("must handle year/month rollover correctly", () => {
		const dateUTC = new Date(Date.UTC(2026, 11, 31, 17));
		const formattedDate = toDateOnly(dateUTC);

		expect(formattedDate).toEqual(new Date(Date.UTC(2026, 11, 31, 0)));
	});
});
