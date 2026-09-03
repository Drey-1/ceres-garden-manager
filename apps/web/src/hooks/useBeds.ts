import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { BedType } from "@/types/BedType";

export const useBeds = () => {
	const { data: bedsList, isPending, isError } = useQuery({
		queryKey: ["beds"],
		queryFn: async () => {
			const data = await apiFetch("/beds");
			return (data?.beds ?? []) as BedType[];
		},
	});

	return { bedsList: bedsList ?? [], isPending, isError };
};
