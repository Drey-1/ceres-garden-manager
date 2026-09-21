import { useRouter } from "next/navigation";
import { useDeletePlanting } from "@/hooks/useDeletePlanting";
import type { PlantingType } from "@/types/PlantingType";
import Dialog from "../Dialog";

export default function PlantingDeleteConfirmation({
	closeFunction,
	planting,
	isOpen,
}: {
	closeFunction: () => void;
	planting: PlantingType;
	isOpen: boolean;
}) {
	const router = useRouter();
	const { deletePlanting, isDeletingPlanting } = useDeletePlanting(planting.id);
	const handlePlantingDelete = () => {
		deletePlanting(undefined, {
			onSuccess: () => {
				router.push(`/beds/${planting.bedId}`);
			},
		});
	};

	return (
		<Dialog isOpen={isOpen} onClose={closeFunction} title="Delete Planting">
			<p className="max-w-72">
				Are you sure that you want to delete your planting? All data will be
				irreversibly lost.
			</p>
			<fieldset
				disabled={isDeletingPlanting}
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
					onClick={handlePlantingDelete}
					className="p-2 text-white w-full text-lg font-bold bg-red-500 hover:brightness-80 active:brightness-110 rounded transition-colors"
				>
					Delete
				</button>
			</fieldset>
		</Dialog>
	);
}
