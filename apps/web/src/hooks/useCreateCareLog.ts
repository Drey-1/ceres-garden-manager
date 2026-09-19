import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { CareLogType } from "@/types/CareLogType";
import type {
	PendingCareType,
	TodayOverviewType,
} from "@/types/TodayOverviewType";

export const useCreateCareLog = () => {
	const queryClient = useQueryClient();

	const { mutate, isPending: isCreatingCareLog } = useMutation({
		mutationFn: async ({
			type,
			quantity,
			plantingId,
		}: {
			type: PendingCareType;
			quantity?: number;
			plantingId: string;
		}) => {
			const careLog = await apiFetch(`/plantings/${plantingId}/care-logs`, {
				method: "POST",
				body: JSON.stringify({
					type,
					quantity,
				}),
			});
			return careLog;
		},

		onSuccess: ({ careLog }: { careLog: CareLogType }) => {
			queryClient.setQueryData(
				["today"],
				(oldData: { todayOverview: TodayOverviewType }) => {
					if (!oldData) return oldData;

					return {
						todayOverview: oldData.todayOverview.map((planting) => {
							if (planting.id === careLog.plantingId) {
								return {
									...planting,
									pendingActions: planting.pendingActions.filter(
										(action) => action !== careLog.type,
									),
								};
							}
							return planting;
						}),
					};
				},
			);
		},

		onError: () => {
			window.alert("Your care log has failed, try again later.");
		},
	});

	return { mutate, isCreatingCareLog };
};
