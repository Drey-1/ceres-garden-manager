import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { CreatePlantingPayload } from "@/types/CreatePlantingPayload";

export const useUpdatePlanting = (plantingId: string) => {
	const queryClient = useQueryClient();

	const { mutate: updatePlanting, isPending: isUpdatingPlanting } = useMutation(
		{
			mutationFn: async (payload: Partial<CreatePlantingPayload>) => {
				await apiFetch(`/plantings/${plantingId}`, {
					method: "PATCH",
					body: JSON.stringify(payload),
				});
			},

			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["planting", plantingId] });
				queryClient.invalidateQueries({ queryKey: ["plantings"] });
				queryClient.invalidateQueries({ queryKey: ["today"] });
			},

			onError: () => {
				window.alert("Your planting update has failed, try again later.");
			},
		},
	);

	return { updatePlanting, isUpdatingPlanting };
};
