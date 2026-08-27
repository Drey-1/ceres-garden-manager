import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";

export const useToday = () => {
	const { data, isPending, isError } = useQuery({
		queryKey: ["today"],
		queryFn: async () => apiFetch("/today"),
	});
	const todayOverview = data?.todayOverview ?? [];

	return { todayOverview, isPending, isError };
};
