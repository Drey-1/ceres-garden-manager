import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
	title: "Ceres",
	description: "An intuitive garden manager, for care with plants.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
		>
			<body className="min-h-full flex flex-col">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
