import { useEffect, useState } from "react";
import { useUpdateBed } from "@/hooks/useUpdateBed";
import type { BedType } from "@/types/BedType";
import Dialog from "../Dialog";
import FormInput from "../FormInput";
import SubmitButton from "../SubmitButton";

export default function BedUpdateForm({
	bed,
	isOpen,
	closeFunction,
}: {
	bed: BedType;
	isOpen: boolean;
	closeFunction: () => void;
}) {
	const { updateBed, isUpdatingBed } = useUpdateBed(bed.id);
	const [bedName, setBedName] = useState(bed.name);
	const [bedLocation, setBedLocation] = useState(bed.location);
	const handleBedUpdate = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		updateBed(
			{ name: bedName, location: bedLocation as string | undefined },
			{
				onSuccess: () => {
					closeFunction();
				},
			},
		);
	};

	useEffect(() => {
		setBedName(bed.name);
		setBedLocation(bed.location);
	}, [isOpen]);

	return (
		<Dialog isOpen={isOpen} onClose={closeFunction} title="Edit Bed">
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
						value={bedLocation ?? undefined}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setBedLocation(e.target.value);
						}}
					/>
					<SubmitButton>Update</SubmitButton>
				</fieldset>
			</form>
		</Dialog>
	);
}
