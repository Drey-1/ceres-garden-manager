export function getExpirationDate(expirationTime: string) {
	if (!expirationTime || typeof expirationTime !== "string") {
		throw new Error(
			"expirationTime must be a non-null string (eg: '30s','10m','2h','7d').",
		);
	}

	const label = expirationTime.slice(-1);
	const value = Number(expirationTime.slice(0, -1));

	const multipliersMap: Record<string, number> = {
		s: 1000,
		m: 1000 * 60,
		h: 1000 * 60 * 60,
		d: 1000 * 60 * 60 * 24,
	};

    if (!(label in multipliersMap)) {
        throw new Error(
            `Invalid time unit, use only: 's', 'm', 'h', 'd'.`
        );
    }
    if (Number.isNaN(value) || value <= 0) {
        throw new Error(
            `Invalid numeric value. Must be a number greater than zero.`
        );
    }

	const nowDate = new Date();
	const expirationTimeInMs = multipliersMap[label]! * value;

	return new Date(nowDate.getTime() + expirationTimeInMs);
}
