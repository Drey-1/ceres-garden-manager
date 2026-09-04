import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { CreatePlantingPayload } from "@/types/CreatePlantingPayload";

export const useCreatePlanting = (bedId: string) => {
	const queryClient = useQueryClient();

	const { mutate: createPlanting } = useMutation({
		mutationFn: async (payload: CreatePlantingPayload) => {
			const data = await apiFetch(`/beds/${bedId}/plantings`, {
				method: "POST",
				body: JSON.stringify(payload),
			});

			return data;
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["plantings", bedId] });
			queryClient.invalidateQueries({ queryKey: ["today"] });
		},

		onError: () => {
			window.alert("Your planting creation has failed, try again later.");
		},
	});

	return { createPlanting };
};
