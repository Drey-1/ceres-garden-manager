import { SquarePenIcon, TrashIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function Header({
	children,
	updateFunction,
	deleteFunction,
}: {
	children: ReactNode;
	updateFunction: () => void;
	deleteFunction: () => void;
}) {
	return (
		<header className="flex flex-col justify-between md:flex-row gap-1 rounded-2xl bg-white w-full min-h-max drop-shadow-lg text-lg text-zinc-800 overflow-hidden">
			{children}
			<div className="flex flex-row md:flex-col text-white bg-gray-300 gap-1 pt-1 md:pt-0 md:pl-1">
				<button
					type="button"
					onClick={updateFunction}
					className="flex justify-center items-center bg-blue-600 w-full md:h-full p-4 cursor-pointer hover:brightness-90 active:brightness-120 "
				>
					<SquarePenIcon className="size-8" />
				</button>
				<button
					type="button"
					onClick={deleteFunction}
					className="flex justify-center items-center bg-red-500 w-full md:h-full p-4 cursor-pointer hover:brightness-90 active:brightness-120 "
				>
					<TrashIcon className="size-8" />
				</button>
			</div>
		</header>
	);
}
