import { useCreateCareLog } from "@/hooks/useCreateCareLog";
import { capitalize, cn } from "@/lib/utils";
import type { PendingCareType } from "@/types/TodayOverviewType";

export default function CareButton({
	careType,
	plantingId,
	className,
}: {
	careType: PendingCareType;
	plantingId: string;
	className?: string;
}) {
	const { mutate: createCareLog } = useCreateCareLog();
	return (
		<button
			type="button"
			onClick={() => createCareLog({ type: careType, plantingId: plantingId })}
			className={cn(
				"hover:brightness-95 outline-gray-200 outline-2 py-1 px-3 rounded-2xl text-white hover:scale-110 transition-all cursor-pointer",
				className,
			)}
		>
			{capitalize(careType)}
		</button>
	);
}
