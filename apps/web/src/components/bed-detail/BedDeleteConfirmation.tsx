import { useRouter } from "next/navigation";
import { useDeleteBed } from "@/hooks/useDeleteBed";
import Dialog from "../Dialog";

export default function BedDeleteConfirmation({
	bedId,
	isOpen,
	closeFunction,
}: {
	bedId: string;
	isOpen: boolean;
	closeFunction: () => void;
}) {
	const router = useRouter();
	const { deleteBed, isDeletingBed } = useDeleteBed(bedId);
	const handleBedDelete = () => {
		deleteBed(undefined, {
			onSuccess: () => {
				router.push("/beds");
			},
		});
	};

	return (
		<Dialog isOpen={isOpen} onClose={closeFunction} title="Delete Bed">
			<p className="max-w-72">
				Are you sure that you want to delete your bed? All data will be
				irreversibly lost.
			</p>
			<fieldset
				disabled={isDeletingBed}
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
					onClick={handleBedDelete}
					className="p-2 text-white w-full text-lg font-bold  bg-red-500 hover:brightness-80 active:brightness-110 rounded transition-colors"
				>
					Delete
				</button>
			</fieldset>
		</Dialog>
	);
}
