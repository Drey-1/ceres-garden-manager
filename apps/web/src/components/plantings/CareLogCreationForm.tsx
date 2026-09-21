import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCreateCareLog } from "@/hooks/useCreateCareLog";
import type { PendingCareType } from "@/types/TodayOverviewType";
import Dialog from "../Dialog";
import FormInput from "../FormInput";
import SubmitButton from "../SubmitButton";

export default function CareLogCreationForm({
	plantingId,
	closeFunction,
	isOpen,
}: {
	plantingId: string;
	closeFunction: () => void;
	isOpen: boolean;
}) {
	const queryClient = useQueryClient();
	const { mutate: createCareLog, isCreatingCareLog } = useCreateCareLog();
	const [type, setType] = useState<PendingCareType>("WATER");
	const [isQuantityOn, setQuantityOn] = useState(false);
	const [quantity, setQuantity] = useState<number | undefined>(undefined);

	const handleCareLogCreate = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		createCareLog(
			{ type, quantity, plantingId: plantingId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["careLogs", plantingId],
					});
					queryClient.invalidateQueries({
						queryKey: ["careSummary", plantingId],
					});
					closeFunction();
					setType("WATER");
					setQuantityOn(false);
					setQuantity(undefined);
				},
			},
		);
	};

	useEffect(() => {
		if (!isQuantityOn) setQuantity(undefined);
	}, [isQuantityOn]);

	return (
		<Dialog isOpen={isOpen} onClose={closeFunction} title="New Care Log">
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
	);
}
