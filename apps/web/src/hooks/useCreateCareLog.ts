import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type {
	PendingCareType,
	TodayOverviewType,
} from "@/types/TodayOverviewType";

export const useCreateCareLog = () => {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: async ({
			type,
			plantingId,
		}: {
			type: PendingCareType;
			plantingId: string;
		}) => {
			const careLog = await apiFetch(`/plantings/${plantingId}/care-logs`, {
				method: "POST",
				body: JSON.stringify({
					type,
					quantity: 1,
				}),
			});
			return careLog;
		},

		onSuccess: ({
			careLog,
		}: {
			careLog: {
				id: string;
				type: PendingCareType;
				quantity: number | null;
				createdAt: Date;
				plantingId: string;
			};
		}) => {
			queryClient.setQueryData(
				["today"],
				(oldData: { todayOverview: TodayOverviewType }) => {
					if (!oldData) return oldData;

					return {todayOverview: oldData.todayOverview.map((planting) => {
						if (planting.id === careLog.plantingId) {
							return {
								...planting,
								pendingActions: planting.pendingActions.filter(
									(action) => action !== careLog.type,
								),
							};
						}
						return planting;
					})};
				},
			);
		},

		onError: () => {
			window.alert("Your care log has failed, try again later.");
		},
	});

	return { mutate };
};
