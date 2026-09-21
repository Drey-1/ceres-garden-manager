import { useUpdatePlanting } from "@/hooks/useUpdatePlanting";
import Dialog from "../Dialog";

export default function PlantingFinishConfirmation({
	plantingId,
	closeFunction,
	isOpen,
}: {
	plantingId: string;
	closeFunction: () => void;
	isOpen: boolean;
}) {
	const { updatePlanting, isUpdatingPlanting } = useUpdatePlanting(plantingId);
	const handlePlantingFinish = () => {
		updatePlanting(
			{
				status: "FINISHED",
			},
			{
				onSuccess: () => {
					closeFunction();
				},
			},
		);
	};
	return (
		<Dialog isOpen={isOpen} onClose={closeFunction} title="Finish Planting">
			<p className="max-w-72">
				Are you sure you want to finish this planting? All data will be kept
				read-only, and it will no longer appear in today's pending actions.
			</p>
			<fieldset
				disabled={isUpdatingPlanting}
				className="flex w-full gap-2 border-t-2 pt-2 border-gray-300"
			>
				<button
					type="button"
					onClick={closeFunction}
					className="p-2 text-gray-800 w-full  hover:text-white text-lg font-bold border-2 border-gray-400 hover:bg-gray-500 active:brightness-110 rounded transition-colors"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={handlePlantingFinish}
					className="p-2 text-white w-full text-lg font-bold  bg-gray-600 hover:brightness-80 active:brightness-110 rounded transition-colors"
				>
					Finish
				</button>
			</fieldset>
		</Dialog>
	);
}
