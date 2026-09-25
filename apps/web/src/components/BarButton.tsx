import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export default function BarButton({
	text,
	Icon,
	clickFunction,
	className,
}: {
	text: string;
	Icon?: ComponentType<{ className: string }>;
	clickFunction: () => void;
	className?: string;
}) {
	return (
		<button
			type="button"
			onClick={clickFunction}
			className={cn(
				"flex border-2 border-white rounded-2xl p-4 gap-4 items-center  text-white cursor-pointer hover:scale-101  transition-all active:brightness-50",
				className,
			)}
		>
			{Icon && (
				<div className="bg-card rounded-xl">
					<Icon className={"size-8"} />
				</div>
			)}

			<p className="text-lg sm:text-3xl">{text}</p>
		</button>
	);
}
