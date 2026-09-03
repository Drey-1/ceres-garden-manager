import type { ReactNode } from "react";

type DialogProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
};

export type { DialogProps };
