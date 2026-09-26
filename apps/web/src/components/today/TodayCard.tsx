import type { TodayOverviewType } from "@/types/TodayOverviewType";
import Card from "../Card";
import CareButton from "./CareButton";

export default function TodayCard({
	planting,
}: {
	planting: TodayOverviewType[number];
}) {
	return (
		<Card className="flex-col items-start gap-2">
			<p className="flex flex-row gap-2">
				Species:{" "}
				<span className="text-[#6BA17D] text-xl font-bold">
					{planting.species}
				</span>{" "}
				From:{" "}
				<span className="text-amber-900 text-xl font-bold">
					{planting.bed.name}
				</span>
			</p>
			<div className="flex gap-4 items-center flex-wrap">
				<span>Needs: </span>
				{planting.pendingActions.includes("WATER") && (
					<CareButton
						careType="WATER"
						plantingId={planting.id}
						className="bg-blue-400"
					/>
				)}
				{planting.pendingActions.includes("FERTILIZE") && (
					<CareButton
						careType="FERTILIZE"
						plantingId={planting.id}
						className="bg-amber-600"
					/>
				)}
				{planting.pendingActions.includes("HARVEST") && (
					<CareButton
						careType="HARVEST"
						plantingId={planting.id}
						className="bg-green-500"
					/>
				)}
			</div>
		</Card>
	);
}
