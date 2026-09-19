import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
	className?: string;
	ref?: Ref<HTMLDivElement>;
};

export default function Card({
	children,
	ref,
	className,
	...props
}: CardProps) {
	return (
		<div
			ref={ref}
			className={cn(
				"flex items-center gap-4 rounded-2xl bg-white p-4 w-full drop-shadow-lg text-lg text-zinc-800 overflow-hidden",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
