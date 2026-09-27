import Link from "next/link";
import type { ComponentType } from "react";

export default function NavLink({
	Icon,
	label,
	href,
	onClick,
}: {
	href?: string;
	onClick?: () => void;
	Icon: ComponentType<{ className: string }>;
	label: string;
}) {
	const className =
		"flex gap-2 items-center hover:backdrop-brightness-50 hover:scale-105 p-1 rounded-xl transition-all cursor-pointer";
	if (href) {
		return (
			<Link href={href} className={className}>
				<Icon className="size-10" />
				<span className="text-2xl hidden md:inline">{label}</span>
			</Link>
		);
	}
	return (
		<button type="button" onClick={onClick} className={className}>
			<Icon className="size-10" />
			<span className="text-2xl hidden md:inline">{label}</span>
		</button>
	);
}
