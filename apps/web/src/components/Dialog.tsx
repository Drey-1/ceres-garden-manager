import { XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import type { DialogProps } from "@/types/DialogPropsType";

export default function Dialog({
	isOpen,
	onClose,
	title,
	children,
}: DialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [isOpen]);

	const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
		e.preventDefault();
		onClose();
	};

	const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		if (e.target === dialogRef.current) {
			onClose();
		}
	};

	return (
		<dialog
			ref={dialogRef}
			onCancel={handleCancel}
			onClick={handleDialogClick}
			className="backdrop:bg-black/50 rounded-2xl m-auto "
		>
			<div className="relative w-max flex flex-col items-center gap-4 rounded-2xl bg-white p-6 drop-shadow-lg text-lg text-zinc-800">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-2 top-2 p-1 rounded-2xl cursor-pointer border-2 border-dashed bg-gray-50 hover:brightness-90 hover:scale-105 active:brightness-95 "
				>
					<XIcon className="size-6" />
				</button>
				{title && (
					<h2 className="text-2xl text-center font-bold text-border text-shadow-lg">
						{title}
					</h2>
				)}
				{children}
			</div>
		</dialog>
	);
}
