import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";

export const useDeleteBed = (bedId: string) => {
	const queryClient = useQueryClient();

	const { mutate: deleteBed, isPending: isDeletingBed } = useMutation({
		mutationFn: async () => {
			await apiFetch(`/beds/${bedId}`, {
				method: "DELETE",
			});
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["beds"] });
		},

		onError: () => {
			window.alert("Your bed delete has failed, try again later.");
		},
	});

	return { deleteBed, isDeletingBed };
};
