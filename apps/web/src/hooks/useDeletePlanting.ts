import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";

export const useDeletePlanting = (plantingId: string) => {
	const queryClient = useQueryClient();

	const { mutate: deletePlanting, isPending: isDeletingPlanting } = useMutation(
		{
			mutationFn: async () => {
				await apiFetch(`/plantings/${plantingId}`, { method: "DELETE" });
			},

			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["plantings"] });
				queryClient.invalidateQueries({ queryKey: ["today"] });
			},

			onError: () => {
				window.alert("Your planting delete has failed, try again later.");
			},
		},
	);

	return { deletePlanting, isDeletingPlanting };
};
