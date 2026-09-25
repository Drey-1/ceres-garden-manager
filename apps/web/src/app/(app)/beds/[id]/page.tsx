"use client";

import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import BarButton from "@/components/BarButton";
import BedDeleteConfirmation from "@/components/bed-detail/BedDeleteConfirmation";
import BedHeader from "@/components/bed-detail/BedHeader";
import BedUpdateForm from "@/components/bed-detail/BedUpdateForm";
import PlantingCard from "@/components/bed-detail/PlantingCard";
import PlantingCreationForm from "@/components/bed-detail/PlantingCreationForm";
import { useBed } from "@/hooks/useBed";
import { usePlantings } from "@/hooks/usePlantings";

export default function Bed() {
	const params: { id: string } = useParams();
	const { bed, isBedPending, isBedError } = useBed(params.id);
	const { plantings, isPlantingsPending, isPlantingsError } = usePlantings(
		params.id,
	);

	const [isBedEditOpen, setIsBedEditOpen] = useState(false);
	const [isBedDeleteOpen, setIsBedDeleteOpen] = useState(false);
	const [isPlantingCreateOpen, setIsPlantingCreateOpen] = useState(false);

	const activePlantings = plantings.filter(
		(planting) => planting.status === "ACTIVE",
	);
	const finishedPlantings = plantings.filter(
		(planting) => planting.status === "FINISHED",
	);

	const toggleBedEdit = () => {
		setIsBedEditOpen(!isBedEditOpen);
	};

	const toggleBedDelete = () => {
		setIsBedDeleteOpen(!isBedDeleteOpen);
	};

	const togglePlantingCreate = () => {
		setIsPlantingCreateOpen(!isPlantingCreateOpen);
	};

	if (isBedPending || isPlantingsPending) {
		return (
			<main className="flex flex-col gap-4 p-4 w-full h-full">
				<div className="bg-white w-full drop-shadow-lg text-lg  overflow-hidden animate-pulse"></div>
				<h2 className="text-2xl text-white font-semibold text-shadow-md">
					All plantings:
				</h2>
				<div className="bg-white w-full drop-shadow-lg text-lg  overflow-hidden animate-pulse"></div>
				<div className="bg-white w-full drop-shadow-lg text-lg  overflow-hidden animate-pulse"></div>
			</main>
		);
	}

	if (isBedError || isPlantingsError) {
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
			{bed && (
				<BedHeader
					bed={bed}
					totalPlantingActives={activePlantings.length}
					totalPlantingFinished={finishedPlantings.length}
					updateFunction={toggleBedEdit}
					deleteFunction={toggleBedDelete}
				/>
			)}

			<div className="flex flex-col gap-4 w-full">
				<h2 className="text-2xl text-white font-semibold text-shadow-md">
					All plantings:
				</h2>
				{activePlantings.map((planting) => {
					return (
						<PlantingCard
							key={planting.id}
							planting={planting}
							isFinished={false}
						/>
					);
				})}
				{finishedPlantings.map((planting) => {
					return (
						<PlantingCard
							key={planting.id}
							planting={planting}
							isFinished={true}
						/>
					);
				})}
				<BarButton
					clickFunction={togglePlantingCreate}
					Icon={PlusIcon}
					text="Add a new planting to your bed"
					className="hover:bg-green-600/70"
				/>
			</div>
			{bed && (
				<BedUpdateForm
					bed={bed}
					isOpen={isBedEditOpen}
					closeFunction={toggleBedEdit}
				/>
			)}

			{bed && (
				<PlantingCreationForm
					bedId={bed.id}
					isOpen={isPlantingCreateOpen}
					closeFunction={togglePlantingCreate}
				/>
			)}

			{bed && (
				<BedDeleteConfirmation
					bedId={bed.id}
					isOpen={isBedDeleteOpen}
					closeFunction={toggleBedDelete}
				/>
			)}
		</main>
	);
}
