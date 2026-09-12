import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { PlantingType } from "@/types/PlantingType";

export const usePlanting = (plantingId: string) => {
	const {
		data: planting,
		isPending: isPlantingPending,
		isError: isPlantingError,
	} = useQuery({
		queryKey: ["planting", plantingId],
		queryFn: async () => {
			const data = await apiFetch(`/plantings/${plantingId}`);
			return data?.planting as PlantingType;
		},
		enabled: !!plantingId,
	});

	return { planting, isPlantingPending, isPlantingError };
};
