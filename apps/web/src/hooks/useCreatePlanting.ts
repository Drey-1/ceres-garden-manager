import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { CreatePlantingPayload } from "@/types/CreatePlantingPayload";

export const useCreatePlanting = (bedId: string) => {
	const queryClient = useQueryClient();

	const { mutate: createPlanting, isPending: isCreatingPlanting } = useMutation({
		mutationFn: async (payload: CreatePlantingPayload) => {
			await apiFetch(`/beds/${bedId}/plantings`, {
				method: "POST",
				body: JSON.stringify(payload),
			});
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["plantings", bedId] });
			queryClient.invalidateQueries({ queryKey: ["today"] });
		},

		onError: () => {
			window.alert("Your planting creation has failed, try again later.");
		},
	});

	return { createPlanting, isCreatingPlanting };
};
