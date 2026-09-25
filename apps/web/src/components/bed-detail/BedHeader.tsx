import type { BedType } from "@/types/BedType";
import Header from "../Header";

export default function BedHeader({
	bed,
	totalPlantingActives,
	totalPlantingFinished,
	updateFunction,
	deleteFunction,
}: {
	bed: BedType;
	totalPlantingActives: number;
	totalPlantingFinished: number;
	updateFunction: () => void;
	deleteFunction: () => void;
}) {
	return (
		<Header updateFunction={updateFunction} deleteFunction={deleteFunction}>
			<section className="p-4">
				<h1 className="text-3xl text-[#A85245] font-semibold">{bed?.name}</h1>
				<p>
					created at{" "}
					<span className="text-lg text-blue-900">
						{bed?.createdAt ? new Date(bed.createdAt).toLocaleDateString() : ""}
					</span>
				</p>
				<p className="text-green-700">
					<span className="text-2xl">{totalPlantingActives}</span> Plantings
					Active
				</p>
				<p className="text-gray-500">
					<span className="text-2xl">{totalPlantingFinished}</span> Plantings
					Finished
				</p>
			</section>
		</Header>
	);
}
