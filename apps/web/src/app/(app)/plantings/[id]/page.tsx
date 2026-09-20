"use client";

import { BellOffIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import CareLogCreationForm from "@/components/plantings/CareLogCreationForm";
import CareLogsList from "@/components/plantings/CareLogsList";
import PlantingDeleteConfirmation from "@/components/plantings/PlantingDeleteConfirmation";
import PlantingHeader from "@/components/plantings/PlantingHeader";
import PlantingSummary from "@/components/plantings/PlantingSummary";
import PlantingUpdateForm from "@/components/plantings/PlantingUpdateForm";
import { usePlanting } from "@/hooks/usePlanting";
import { useUpdatePlanting } from "@/hooks/useUpdatePlanting";

export default function Planting() {
	const params: { id: string } = useParams();
	const { planting, isPlantingPending, isPlantingError } = usePlanting(
		params.id,
	);
	const isPlantingActive = planting?.status === "ACTIVE";
	const plantingLifeInDays = planting
		? (
				(Date.now() - new Date(planting?.plantedAt).getTime()) /
				1000 /
				60 /
				60 /
				24
			).toFixed(0)
		: null;
	const { updatePlanting, isUpdatingPlanting } = useUpdatePlanting(params.id);

	const [isPlantingEditOpen, setPlantingEditOpen] = useState(false);
	const [isPlantingDeleteOpen, setPlantingDeleteOpen] = useState(false);
	const [isCareLogCreateOpen, setCareLogCreateOpen] = useState(false);
	const [isPlantingFinishOpen, setPlantingFinishOpen] = useState(false);

	const togglePlantingEdit = () => {
		setPlantingEditOpen(!isPlantingEditOpen);
	};
	const togglePlantingDelete = () => {
		setPlantingDeleteOpen(!isPlantingDeleteOpen);
	};
	const toggleCareLogCreate = () => {
		setCareLogCreateOpen(!isCareLogCreateOpen);
	};
	const togglePlantingFinish = () => {
		setPlantingFinishOpen(!isPlantingFinishOpen);
	};

	const handlePlantingFinish = () => {
		updatePlanting(
			{
				status: "FINISHED",
			},
			{
				onSuccess: () => {
					togglePlantingFinish();
				},
			},
		);
	};

	if (isPlantingPending) {
		return (
			<main className="flex flex-col gap-4 p-4 w-full h-full">
				<div className="flex flex-col gap-1 rounded-2xl bg-white p-4 w-full drop-shadow-lg text-lg text-zinc-800 overflow-hidden hover:scale-101 transition-transform animate-pulse"></div>
				<div className="flex flex-col gap-1 rounded-2xl bg-white p-4 w-full drop-shadow-lg text-lg text-zinc-800 overflow-hidden hover:scale-101 transition-transform animate-pulse"></div>
				<div className="flex flex-col gap-1 rounded-2xl bg-white p-4 w-full drop-shadow-lg text-lg text-zinc-800 overflow-hidden hover:scale-101 transition-transform animate-pulse"></div>
			</main>
		);
	}

	if (isPlantingError) {
		return (
			<main className="flex flex-col gap-4 p-4 w-full h-full">
				<p className="bg-slate-500 p-4 rounded-2xl w-max text-white font-semibold text-2xl m-auto wrap-break-word max-w-11/12 border-dashed border-4 border-red-600">
					Error loading data, Try again later.
				</p>
			</main>
		);
	}

	return (
		<main className="flex flex-col gap-4 p-4 w-full min-h-full">
			{planting && (
				<PlantingHeader
					planting={planting}
					updateFunction={togglePlantingEdit}
					deleteFunction={togglePlantingDelete}
				/>
			)}
			{isPlantingActive && (
				<button
					type="button"
					onClick={togglePlantingFinish}
					className="flex border-2 border-white rounded-2xl p-4 gap-4 items-center  text-white cursor-pointer hover:scale-101 hover:bg-gray-400/70 transition-all active:brightness-50"
				>
					<div className="bg-card rounded-xl">
						<BellOffIcon className="size-8" />
					</div>
					<p className="text-lg sm:text-3xl">Finish this planting</p>
				</button>
			)}
			{plantingLifeInDays && (
				<PlantingSummary
					plantingId={params.id}
					plantingTimeLifeDays={plantingLifeInDays}
				/>
			)}

			<CareLogsList
				plantingId={params.id}
				isPlantingActive={isPlantingActive}
				creationFunction={toggleCareLogCreate}
			/>

			{planting && (
				<PlantingUpdateForm
					planting={planting}
					closeFunction={togglePlantingEdit}
					isOpen={isPlantingEditOpen}
				/>
			)}

			{planting && (
				<CareLogCreationForm
					plantingId={params.id}
					closeFunction={toggleCareLogCreate}
					isOpen={isCareLogCreateOpen}
				/>
			)}

			{planting && (
				<PlantingDeleteConfirmation
					planting={planting}
					closeFunction={togglePlantingDelete}
					isOpen={isPlantingDeleteOpen}
				/>
			)}

			<Dialog
				isOpen={isPlantingFinishOpen}
				onClose={togglePlantingFinish}
				title="Finish Planting"
			>
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
						onClick={togglePlantingFinish}
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
		</main>
	);
}
