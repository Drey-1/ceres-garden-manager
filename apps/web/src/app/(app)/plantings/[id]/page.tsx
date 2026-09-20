"use client";

import { useQueryClient } from "@tanstack/react-query";
import { BellOffIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {  useEffect , useState } from "react";
import Dialog from "@/components/Dialog";
import FormInput from "@/components/FormInput";
import CareLogsList from "@/components/plantings/CareLogsList";
import PlantingHeader from "@/components/plantings/PlantingHeader";
import PlantingSummary from "@/components/plantings/PlantingSummary";
import SubmitButton from "@/components/SubmitButton";
import { useCreateCareLog } from "@/hooks/useCreateCareLog";
import { useDeletePlanting } from "@/hooks/useDeletePlanting";
import { usePlanting } from "@/hooks/usePlanting";
import { useUpdatePlanting } from "@/hooks/useUpdatePlanting";
import type { PendingCareType } from "@/types/TodayOverviewType";

export default function Planting() {
	const queryClient = useQueryClient();
	const router = useRouter();
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
	const { mutate: createCareLog, isCreatingCareLog } = useCreateCareLog();
	const { updatePlanting, isUpdatingPlanting } = useUpdatePlanting(params.id);
	const { deletePlanting, isDeletingPlanting } = useDeletePlanting(params.id);

	const [isPlantingEditOpen, setPlantingEditOpen] = useState(false);
	const [isPlantingDeleteOpen, setPlantingDeleteOpen] = useState(false);
	const [isCareLogCreateOpen, setCareLogCreateOpen] = useState(false);
	const [isPlantingFinishOpen, setPlantingFinishOpen] = useState(false);

	const [species, setSpecies] = useState(planting?.species);
	const [plantedAt, setPlantedAt] = useState(planting?.plantedAt);
	const [estimatedDaysToHarvest, setEstimatedDaysToHarvest] = useState(
		planting?.estimatedDaysToHarvest,
	);
	const [fertilizingFrequencyDays, setFertilizingFrequencyDays] = useState(
		planting?.fertilizingFrequencyDays,
	);
	const [wateringFrequencyDays, setWateringFrequencyDays] = useState(
		planting?.wateringFrequencyDays,
	);

	const [type, setType] = useState<PendingCareType>("WATER");
	const [isQuantityOn, setQuantityOn] = useState(false);
	const [quantity, setQuantity] = useState<number | undefined>(undefined);

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

	const handlePlantingUpdate = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		updatePlanting(
			{
				species,
				plantedAt,
				wateringFrequencyDays,
				fertilizingFrequencyDays,
				estimatedDaysToHarvest,
			},
			{
				onSuccess: () => {
					togglePlantingEdit();
				},
			},
		);
	};
	const handlePlantingDelete = () => {
		deletePlanting(undefined, {
			onSuccess: () => {
				router.push(`/beds/${planting?.bedId}`);
			},
		});
	};
	const handleCareLogCreate = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!planting) return;
		createCareLog(
			{ type, quantity, plantingId: planting.id },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["careLogs", planting.id],
					});
					queryClient.invalidateQueries({
						queryKey: ["careSummary", planting.id],
					});
					toggleCareLogCreate();
					setType("WATER");
					setQuantityOn(false);
					setQuantity(undefined);
				},
			},
		);
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

	useEffect(() => {
		if (planting) {
			setSpecies(planting?.species);
			setPlantedAt(planting?.plantedAt);
			setEstimatedDaysToHarvest(planting?.estimatedDaysToHarvest);
			setFertilizingFrequencyDays(planting?.fertilizingFrequencyDays);
			setWateringFrequencyDays(planting?.wateringFrequencyDays);
		}
	}, [planting]);

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
			{planting ? (
				<PlantingHeader
					planting={planting}
					updateFunction={togglePlantingEdit}
					deleteFunction={togglePlantingDelete}
				/>
			) : (
				""
			)}
			{isPlantingActive ? (
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
			) : (
				""
			)}
			{plantingLifeInDays ? (
				<PlantingSummary
					plantingId={params.id}
					plantingTimeLifeDays={plantingLifeInDays}
				/>
			) : (
				""
			)}

			<CareLogsList
				plantingId={params.id}
				isPlantingActive={isPlantingActive}
				creationFunction={toggleCareLogCreate}
			/>
			
			<Dialog
				isOpen={isPlantingEditOpen}
				onClose={togglePlantingEdit}
				title="Edit Planting"
			>
				<form action="" onSubmit={handlePlantingUpdate}>
					<fieldset
						disabled={isUpdatingPlanting}
						className="disabled:opacity-50 flex flex-col gap-6  p-4"
					>
						<FormInput
							type="text"
							placeholder="Species:"
							required
							value={species}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setSpecies(e.target.value);
							}}
						/>
						<FormInput
							label="Planted At:"
							type="date"
							required
							value={
								plantedAt ? new Date(plantedAt).toISOString().split("T")[0] : ""
							}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setPlantedAt(e.target.value);
							}}
						/>
						<FormInput
							label="Watering Frequency in Days:"
							type="number"
							required
							value={wateringFrequencyDays}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setWateringFrequencyDays(e.target.valueAsNumber);
							}}
						/>
						<FormInput
							label="Fertilize Frequency in Days:"
							type="number"
							required
							value={fertilizingFrequencyDays}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setFertilizingFrequencyDays(e.target.valueAsNumber);
							}}
						/>
						<FormInput
							label="Days to Harvest:"
							type="number"
							required
							value={estimatedDaysToHarvest}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setEstimatedDaysToHarvest(e.target.valueAsNumber);
							}}
						/>
						<SubmitButton>Update</SubmitButton>
					</fieldset>
				</form>
			</Dialog>
			<Dialog
				isOpen={isCareLogCreateOpen}
				onClose={toggleCareLogCreate}
				title="New Care Log"
			>
				<form action="" onSubmit={handleCareLogCreate}>
					<fieldset
						disabled={isCreatingCareLog}
						className="disabled:opacity-50 flex flex-col gap-6  p-4"
					>
						<select
							value={type}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
								setType(e.target.value as PendingCareType);
							}}
							className={`bg-gray-100 text-lg text-gray-700 p-3 rounded placeholder:text-gray-500 focus:bg-white focus:outline-2 focus:outline-[#3F6E4A] focus:border-0  hover:outline-[#A4CBA9] hover:outline-2 disabled:opacity-50 disabled:outline-0`}
						>
							<option className="hover:bg-[#6ba37e]" value="WATER">
								Water
							</option>
							<option value="FERTILIZE">Fertilize</option>
							<option value="HARVEST">Harvest</option>
						</select>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={isQuantityOn}
								onChange={(e) => setQuantityOn(e.target.checked)}
								className=" accent-[#3F6E4A] size-4"
							/>{" "}
							Include Quantity
						</label>
						<FormInput
							type="number"
							disabled={!isQuantityOn}
							value={quantity ?? ""}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const value = e.target.valueAsNumber;
								setQuantity(Number.isNaN(value) ? undefined : value);
							}}
							className="bg-gray-100 text-lg text-gray-700 p-3 rounded placeholder:text-gray-500 focus:bg-white focus:outline-2 focus:outline-[#3F6E4A] focus:border-0  hover:outline-[#A4CBA9] hover:outline-2 disabled:opacity-50 disabled:outline-0"
						/>
						<SubmitButton>Create</SubmitButton>
					</fieldset>
				</form>
			</Dialog>
			<Dialog
				isOpen={isPlantingDeleteOpen}
				onClose={togglePlantingDelete}
				title="Delete Planting"
			>
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
						onClick={togglePlantingDelete}
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
