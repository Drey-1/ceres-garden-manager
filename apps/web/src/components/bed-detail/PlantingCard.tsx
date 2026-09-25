import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import type { PlantingType } from "@/types/PlantingType";
import Card from "../Card";

export default function PlantingCard({
	planting,
	isFinished,
}: {
	planting: PlantingType;
	isFinished: boolean;
}) {
	return (
		<Card className="hover:scale-101 transition-transform group">
			<div>
				<p>
					<span className="text-2xl font-semibold text-[#6BA37E]">
						{planting.species}
					</span>{" "}
					planted at{" "}
					<span className="text-lg text-blue-900">
						{new Date(planting.plantedAt).toLocaleDateString()}
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
		</Card>
	);
}
