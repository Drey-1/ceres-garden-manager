import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";

export const useCreateBed = () => {
	const queryClient = useQueryClient();

	const { mutate: createBed, isPending: isBedCreationPending } = useMutation({
		mutationFn: async ({
			name,
			location,
		}: {
			name: string;
			location: string;
		}) => {
			await apiFetch("/beds", {
				method: "POST",
				body: JSON.stringify({ name, location }),
			});
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["beds"] });
		},
        
		onError: () => {
			window.alert("Bed creation failed, try again later.");
		},
	});

	return { createBed, isBedCreationPending };
};
