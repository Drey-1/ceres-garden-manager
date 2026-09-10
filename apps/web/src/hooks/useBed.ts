import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { BedType } from "@/types/BedType";

export const useBed = (bedId: string) => {
	const {
		data: bed,
		isPending: isBedPending,
		isError: isBedError,
	} = useQuery({
		queryKey: ["bed", bedId],
		queryFn: async () => {
			const data = await apiFetch(`/beds/${bedId}`);
			return data?.bed as BedType;
		},
		enabled: !!bedId,
	});

	return { bed, isBedPending, isBedError };
};
