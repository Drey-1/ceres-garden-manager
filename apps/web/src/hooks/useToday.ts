import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { TodayOverviewType } from "@/types/TodayOverviewType";

export const useToday = () => {
	const { data, isPending, isError } = useQuery({
		queryKey: ["today"],
		queryFn: async () => apiFetch("/today"),
	});
	const todayOverview: TodayOverviewType = data?.todayOverview ?? [];
	const pendingPlantings = todayOverview.filter(
		(planting) => planting.pendingActions.length > 0,
	);

	return { pendingPlantings, isPending, isError };
};
