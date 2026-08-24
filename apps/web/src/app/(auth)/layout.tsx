export default function AuthLayout({ children }: LayoutProps<"/">) {
	return (
		<main className="hero-bg min-h-screen flex flex-col">
			<div className="py-3 px-6 text-3xl font-bold flex">Ceres</div>
			<section className=" flex items-center justify-center">{children}</section>
		</main>
	);
}
