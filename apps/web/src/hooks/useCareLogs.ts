import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { CareLogType } from "@/types/CareLogType";

export const useCareLogs = (plantingId: string, page:number, pageSize:number) => {
	const {
		data,
		isPending: isCareLogsPending,
		isError: isCareLogsError,
	} = useQuery({
		queryKey: ["careLogs", plantingId, page, pageSize],
		queryFn: async () => {
			const data = await apiFetch(`/plantings/${plantingId}/care-logs?page=${page}&pageSize=${pageSize}`);
			return data as {
				careLogs: CareLogType[];
				totalOfLogs: number;
				paginationParams: {
					page: number;
					pageSize: number;
				};
			};
		},
		enabled: !!plantingId,
	});

	return {
		careLogs: data?.careLogs ?? [],
		totalOfLogs: data?.totalOfLogs ?? 0,
		usedPaginationParams: data?.paginationParams,
		isCareLogsPending,
		isCareLogsError,
	};
};
