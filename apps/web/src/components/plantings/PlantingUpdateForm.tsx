import { useState } from "react";
import { useUpdatePlanting } from "@/hooks/useUpdatePlanting";
import type { PlantingType } from "@/types/PlantingType";
import Dialog from "../Dialog";
import FormInput from "../FormInput";
import SubmitButton from "../SubmitButton";

export default function PlantingUpdateForm({
	planting,
	closeFunction,
	isOpen,
}: {
	planting: PlantingType;
	closeFunction: () => void;
	isOpen: boolean;
}) {
	const { updatePlanting, isUpdatingPlanting } = useUpdatePlanting(planting.id);

	const [species, setSpecies] = useState(planting.species);
	const [plantedAt, setPlantedAt] = useState(planting.plantedAt);
	const [estimatedDaysToHarvest, setEstimatedDaysToHarvest] = useState(
		planting.estimatedDaysToHarvest,
	);
	const [fertilizingFrequencyDays, setFertilizingFrequencyDays] = useState(
		planting.fertilizingFrequencyDays,
	);
	const [wateringFrequencyDays, setWateringFrequencyDays] = useState(
		planting.wateringFrequencyDays,
	);

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
					closeFunction();
				},
			},
		);
	};

	return (
		<Dialog isOpen={isOpen} onClose={closeFunction} title="Edit Planting">
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
	);
}
