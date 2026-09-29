import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		projects: [
			{
				test: {
					name: "unit",
					include: ["src/tests/unit/**/*.{test,spec}.ts"],
				},
			},
			{
				test: {
					name: "integration",
					include: ["src/tests/integration/**/*.{test,spec}.ts"],
					setupFiles: ["./src/tests/integration/setup.ts"],
				},
			},
		],
	},
});