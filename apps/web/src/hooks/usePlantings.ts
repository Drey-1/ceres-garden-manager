import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { PlantingType } from "@/types/PlantingType";

export const usePlantings = (bedId: string) => {
	const {
		data: plantings,
		isPending: isPlantingsPending,
		isError: isPlantingsError,
	} = useQuery({
		queryKey: ["plantings", bedId],
		queryFn: async () => {
			const data = await apiFetch(`/beds/${bedId}/plantings`);
			return (data?.plantings ?? []) as PlantingType[];
		},
		enabled: !!bedId,
	});

	return { plantings: plantings ?? [], isPlantingsPending, isPlantingsError };
};
