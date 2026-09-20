import type { PlantingType } from "@/types/PlantingType";
import Header from "../Header";

export default function PlantingHeader({
	planting,
	updateFunction,
	deleteFunction,
}: {
	planting: PlantingType;
	updateFunction: () => void;
	deleteFunction: () => void;
}) {
	const estimatedHarvestDate = planting
		? new Date(
				new Date(planting.plantedAt).getTime() +
					planting.estimatedDaysToHarvest * 24 * 60 * 60 * 1000,
			).toLocaleDateString()
		: "";

	return (
		<Header
			updateFunction={updateFunction}
			deleteFunction={deleteFunction}
		>
			<section className="p-4">
				<div className="flex gap-2 items-end">
					<h1 className="text-3xl text-[#6BA37E] font-semibold">
						{planting.species}
					</h1>
					{planting.status === "FINISHED" && (
						<span className="text-2xl text-gray-500 font-bold">FINISHED</span>
					)}
				</div>
				<p className="text-sm">
					planted at{" "}
					<span className="text-base text-blue-900">
						{planting.plantedAt
							? new Date(planting.plantedAt).toLocaleDateString()
							: ""}
					</span>
				</p>
				<p>
					Water every{" "}
					<span className="text-2xl text-blue-400">
						{planting.wateringFrequencyDays}
					</span>{" "}
					days
				</p>
				<p>
					Fertilize every{" "}
					<span className="text-2xl text-amber-500">
						{planting.fertilizingFrequencyDays}
					</span>{" "}
					days
				</p>
				<p>
					Estimated Harvest Date:{" "}
					<span className="text-2xl text-green-600">
						{estimatedHarvestDate}
					</span>{" "}
				</p>
			</section>
		</Header>
	);
}
