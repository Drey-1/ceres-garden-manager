import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";

export const useUpdateBed = (bedId: string) => {
	const queryClient = useQueryClient();

	const { mutate: updateBed, isPending: isUpdatingBed } = useMutation({
		mutationFn: async (payload: { name?: string; location?: string }) => {
			await apiFetch(`/beds/${bedId}`, {
				method: "PATCH",
				body: JSON.stringify(payload),
			});
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bed", bedId] });
			queryClient.invalidateQueries({ queryKey: ["beds"] });
		},

		onError: () => {
			window.alert("Your bed update has failed, try again later.");
		},
	});

	return { updateBed, isUpdatingBed };
};
