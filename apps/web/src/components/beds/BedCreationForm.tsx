import { useEffect, useState } from "react";
import { useCreateBed } from "@/hooks/useCreateBed";
import Dialog from "../Dialog";
import FormInput from "../FormInput";
import SubmitButton from "../SubmitButton";

export default function BedCreationForm({
	isOpen,
	closeFunction,
}: {
	isOpen: boolean;
	closeFunction: () => void;
}) {
	const [isLocationOn, setIsLocationOn] = useState(false);
	const [bedName, setBedName] = useState("");
	const [bedLocation, setBedLocation] = useState("");
	const { createBed, isBedCreationPending } = useCreateBed();

	const handleBedCreation = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		createBed(
			{ name: bedName, location: bedLocation },
			{
				onSuccess: () => {
					closeFunction();
					setBedName("");
					setBedLocation("");
					setIsLocationOn(false);
				},
			},
		);
	};

	useEffect(() => {
		if (!isLocationOn) setBedLocation("");
	}, [isLocationOn]);

	return (
		<Dialog isOpen={isOpen} onClose={closeFunction} title="New Bed">
			<form action="" onSubmit={handleBedCreation}>
				<fieldset
					disabled={isBedCreationPending}
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
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							onChange={(e) => setIsLocationOn(e.target.checked)}
							className=" accent-[#3F6E4A] size-4"
						/>{" "}
						Include Location
					</label>
					<FormInput
						type="text"
						disabled={!isLocationOn}
						placeholder="Bed Location:"
						value={bedLocation}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setBedLocation(e.target.value);
						}}
					/>
					<SubmitButton>Create</SubmitButton>
				</fieldset>
			</form>
		</Dialog>
	);
}
