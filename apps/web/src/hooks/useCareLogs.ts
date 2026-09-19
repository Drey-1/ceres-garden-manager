import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { CareLogType } from "@/types/CareLogType";

export const useCareLogs = (plantingId: string, pageSize: number) => {
	return useInfiniteQuery({
		queryKey: ["careLogs", plantingId, pageSize],
		queryFn: async ({ pageParam = 1 }) => {
			const data = await apiFetch(
				`/plantings/${plantingId}/care-logs?page=${pageParam}&pageSize=${pageSize}`,
			);
			return data as {
				careLogs: CareLogType[];
				totalOfLogs: number;
				paginationParams: {
					page: number;
					pageSize: number;
				};
			};
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			const { page, pageSize } = lastPage.paginationParams;
			const totalOfPages = Math.ceil(lastPage.totalOfLogs / pageSize);
			return page < totalOfPages ? page + 1 : undefined;
		},
		enabled: !!plantingId,
	});
};
