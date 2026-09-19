import type { ReactNode } from "react";

export default function SubmitButton({ children }: { children: ReactNode }) {
	return (
		<button
			type="submit"
			className="p-2 text-gray-800 hover:text-white text-lg font-bold border-2 border-[#6BA37E] hover:bg-[#6BA37E] rounded transition-colors"
		>
			{children}
		</button>
	);
}
