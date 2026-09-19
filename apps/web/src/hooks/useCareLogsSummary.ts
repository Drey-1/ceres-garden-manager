import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";

export const useCareLogsSummary = (plantingId: string) => {
	const {
		data: careLogsSummary,
		isPending: isCareLogsSummaryPending,
		isError: isCareLogsSummaryError,
	} = useQuery({
		queryKey: ["careSummary", plantingId],
		queryFn: async () => {
			const data = await apiFetch(`/plantings/${plantingId}/care-logs/summary`);
			return data?.careLogsSummary as {
				water: { quantity: number | null };
				fertilize: { quantity: number | null };
				harvest: { quantity: number | null };
			};
		},
		enabled: !!plantingId,
	});

	return { careLogsSummary, isCareLogsSummaryError, isCareLogsSummaryPending };
};
