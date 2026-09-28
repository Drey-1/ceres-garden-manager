const envLabels = [
	"DATABASE_URL",
	"JWT_ACCESS_SECRET",
	"JWT_REFRESH_SECRET",
	"JWT_ACCESS_EXPIRES_IN",
	"JWT_REFRESH_EXPIRES_IN",
	"PORT",
];
export default function environmentValidator() {
	const undefineds = envLabels.filter((label) => {
		const data = process.env[label];
		return !data;
	});
	if (undefineds.length > 0) {
		console.error(
			`${undefineds.join(", ")} was not defined in ".env" configurations`,
		);
		process.exit(1);
	}
}
