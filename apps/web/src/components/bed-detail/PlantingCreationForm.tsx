import { useState } from "react";
import { useCreatePlanting } from "@/hooks/useCreatePlanting";
import Dialog from "../Dialog";
import FormInput from "../FormInput";
import SubmitButton from "../SubmitButton";

export default function PlantingCreationForm({
	bedId,
	isOpen,
	closeFunction,
}: {
	bedId: string;
	isOpen: boolean;
	closeFunction: () => void;
}) {
	const { createPlanting, isCreatingPlanting } = useCreatePlanting(bedId);
	const [species, setSpecies] = useState("");
	const [plantedAt, setPlantedAt] = useState("");
	const [estimatedDaysToHarvest, setEstimatedDaysToHarvest] = useState(0);
	const [fertilizingFrequencyDays, setFertilizingFrequencyDays] = useState(0);
	const [wateringFrequencyDays, setWateringFrequencyDays] = useState(0);

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
					closeFunction();
					setSpecies("");
					setPlantedAt("");
					setEstimatedDaysToHarvest(0);
					setFertilizingFrequencyDays(0);
					setWateringFrequencyDays(0);
				},
			},
		);
	};

	return (
		<Dialog isOpen={isOpen} onClose={closeFunction} title="New Planting">
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
					<SubmitButton>Create</SubmitButton>
				</fieldset>
			</form>
		</Dialog>
	);
}
