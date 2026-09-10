"use client";

import { EllipsisIcon, PlusIcon, SquarePenIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dialog from "@/components/Dialog";
import FormInput from "@/components/FormInput";
import { useBed } from "@/hooks/useBed";
import { useCreatePlanting } from "@/hooks/useCreatePlanting";
import { useDeleteBed } from "@/hooks/useDeleteBed";
import { usePlantings } from "@/hooks/usePlantings";
import { useUpdateBed } from "@/hooks/useUpdateBed";
import type { PlantingType } from "@/types/PlantingType";

const PlantingCard = ({
	planting,
	isFinished,
}: {
	planting: PlantingType;
	isFinished: boolean;
}) => {
	return (
		<div className="flex items-center gap-4 rounded-2xl bg-white p-4 w-full drop-shadow-lg text-lg text-zinc-800 overflow-hidden hover:scale-101 transition-transform group">
			<div>
				<p>
					<span className="text-2xl font-semibold text-[#6BA37E]">
						{planting.species}
					</span>{" "}
					planted at{" "}
					<span className="text-lg text-blue-900">
						{planting?.createdAt
							? new Date(planting.createdAt).toLocaleDateString()
							: ""}
					</span>
				</p>
			</div>
			<Link
				href={`/plantings/${planting.id}`}
				className="border-2 h-max border-dashed rounded-2xl p-1 opacity-40 group-hover:opacity-100 cursor-pointer"
			>
				<EllipsisIcon />
			</Link>
			{isFinished && (
				<span className="text-2xl text-gray-500 font-bold">FINISHED</span>
			)}
		</div>
	);
};

export default function Bed() {
	const router = useRouter();
	const params: { id: string } = useParams();
	const { bed, isBedPending, isBedError } = useBed(params.id);
	const { plantings, isPlantingsPending, isPlantingsError } = usePlantings(
		params.id,
	);
	const { updateBed, isUpdatingBed } = useUpdateBed(params.id);
	const { deleteBed, isDeletingBed } = useDeleteBed(params.id);
	const { createPlanting, isCreatingPlanting } = useCreatePlanting(params.id);

	const [isBedEditOpen, setIsBedEditOpen] = useState(false);
	const [isBedDeleteOpen, setIsBedDeleteOpen] = useState(false);
	const [isPlantCreatOpen, setIsPlantCreatOpen] = useState(false);

	const [bedName, setBedName] = useState(bed?.name);
	const [bedLocation, setBedLocation] = useState(bed?.location);

	const [species, setSpecies] = useState("");
	const [plantedAt, setPlantedAt] = useState("");
	const [estimatedDaysToHarvest, setEstimatedDaysToHarvest] = useState(0);
	const [fertilizingFrequencyDays, setFertilizingFrequencyDays] = useState(0);
	const [wateringFrequencyDays, setWateringFrequencyDays] = useState(0);

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

	const togglePlantCreat = () => {
		setIsPlantCreatOpen(!isPlantCreatOpen);
	};

	const handleBedUpdate = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		updateBed(
			{ name: bedName, location: bedLocation as string | undefined },
			{
				onSuccess: () => {
					toggleBedEdit();
				},
			},
		);
	};

	const handleBedDelete = () => {
		deleteBed(undefined, {
			onSuccess: () => {
				router.push("/beds");
			},
		});
	};

	const handlePlantingCreation = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		createPlanting(
			{
				species,
				plantedAt,
				estimatedDaysToHarvest,
				fertilizingFrequencyDays,
				wateringFrequencyDays,
			},
			{
				onSuccess: () => {
					togglePlantCreat();
					setSpecies("");
					setPlantedAt("");
					setEstimatedDaysToHarvest(0);
					setFertilizingFrequencyDays(0);
					setWateringFrequencyDays(0);
				},
			},
		);
	};

	useEffect(() => {
		setBedName(bed?.name);
		setBedLocation(bed?.location);
	},[bed]);

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
			<header className="flex flex-col justify-between md:flex-row gap-1 rounded-2xl bg-white w-full min-h-max drop-shadow-lg text-lg text-zinc-800 overflow-hidden">
				<section className="p-4">
					<h1 className="text-3xl text-[#A85245] font-semibold">{bed?.name}</h1>
					<p>
						created at{" "}
						<span className="text-lg text-blue-900">
							{bed?.createdAt
								? new Date(bed.createdAt).toLocaleDateString()
								: ""}
						</span>
					</p>
					<p className="text-green-700">
						<span className="text-2xl">{activePlantings.length}</span> Plantings
						Active
					</p>
					<p className="text-gray-500">
						<span className="text-2xl">{finishedPlantings.length}</span>{" "}
						Plantings Finished
					</p>
				</section>
				<div className="flex flex-row md:flex-col text-white bg-gray-300 gap-1 pt-1 md:pt-0 md:pl-1">
					<button
						type="button"
						onClick={toggleBedEdit}
						className="flex justify-center bg-blue-600 w-full md:h-full p-4 cursor-pointer hover:brightness-90 active:brightness-120 "
					>
						<SquarePenIcon className="size-8" />
					</button>
					<button
						type="button"
						onClick={toggleBedDelete}
						className="flex justify-center bg-red-500 w-full md:h-full p-4 cursor-pointer hover:brightness-90 active:brightness-120 "
					>
						<TrashIcon className="size-8" />
					</button>
				</div>
			</header>

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
				<button
					type="button"
					onClick={togglePlantCreat}
					className="flex border-2 border-white rounded-2xl p-4 gap-4 items-center  text-white cursor-pointer hover:scale-101 hover:bg-green-600/70 transition-all active:brightness-50"
				>
					<div className="bg-card rounded-xl">
						<PlusIcon className="size-8" />
					</div>
					<p className="text-lg sm:text-3xl">Add a new planting to your bed</p>
				</button>
			</div>
			<Dialog isOpen={isBedEditOpen} onClose={toggleBedEdit} title="Edit Bed">
				<form action="" onSubmit={handleBedUpdate}>
					<fieldset
						disabled={isUpdatingBed}
						className="disabled:opacity-50 flex flex-col gap-6  p-4"
					>
						<FormInput
							type="text"
							placeholder="Bed Name:"
							required
							value={bedName}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setBedName(e.target.value);
							}}
						/>
						<FormInput
							type="text"
							placeholder="Bed Location:"
							value={bedLocation}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setBedLocation(e.target.value);
							}}
						/>
						<button
							type="submit"
							className="p-2 text-gray-800 hover:text-white text-lg font-bold border-2 border-[#6BA37E] hover:bg-[#6BA37E] rounded transition-colors"
						>
							Update
						</button>
					</fieldset>
				</form>
			</Dialog>
			<Dialog
				isOpen={isPlantCreatOpen}
				onClose={togglePlantCreat}
				title="New Planting"
			>
				<form action="" onSubmit={handlePlantingCreation}>
					<fieldset
						disabled={isCreatingPlanting}
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
							value={plantedAt}
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
						<button
							type="submit"
							className="p-2 text-gray-800 hover:text-white text-lg font-bold border-2 border-[#6BA37E] hover:bg-[#6BA37E] rounded transition-colors"
						>
							Create
						</button>
					</fieldset>
				</form>
			</Dialog>
			<Dialog
				isOpen={isBedDeleteOpen}
				onClose={toggleBedDelete}
				title="Delete Bed"
			>
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
						onClick={toggleBedDelete}
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
		</main>
	);
}
