import { AppleIcon, ClockIcon, DropletIcon, SparklesIcon } from "lucide-react";
import { useCareLogsSummary } from "@/hooks/useCareLogsSummary";
import Card from "../Card";

export default function PlantingSummary({
	plantingId,
	plantingTimeLifeDays,
}: {
	plantingId: string;
	plantingTimeLifeDays: string;
}) {
	const { careLogsSummary, isCareLogsSummaryPending, isCareLogsSummaryError } =
		useCareLogsSummary(plantingId);

	if (isCareLogsSummaryPending) {
		return <Card className="animate-pulse">Loading...</Card>;
	}
	if (isCareLogsSummaryError) {
		return (
			<Card className="animate-pulse text-red-600">Error loading data!</Card>
		);
	}

	return (
		<Card className="flex-col gap-2">
			<h2 className="text-3xl text-gray-600 font-semibold text-center">
				Statistics
			</h2>
			<div className="grid grid-cols-1 gap-2  md:grid-cols-2 w-full">
				<div className="flex items-center gap-2 p-2 border-2 border-gray-500 rounded-xl">
					<DropletIcon className="text-blue-400 fill-blue-400 size-12" />
					<div>
						<span className="text-xl">{careLogsSummary?.water.quantity}</span>
						<p>Times Watered</p>
					</div>
				</div>
				<div className="flex items-center gap-2 p-2 border-2 border-gray-500 rounded-xl">
					<SparklesIcon className="text-amber-400 fill-amber-400 size-12" />
					<div>
						<span className="text-xl">
							{careLogsSummary?.fertilize.quantity}
						</span>
						<p>Times Fertilized</p>
					</div>
				</div>
				<div className="flex items-center gap-2 p-2 border-2 border-gray-500 rounded-xl">
					<AppleIcon className="text-green-400 fill-green-400 size-12" />
					<div>
						<span className="text-xl">{careLogsSummary?.harvest.quantity}</span>
						<p>Times Harvested</p>
					</div>
				</div>
				<div className="flex items-center gap-2 p-2 border-2 border-gray-500 rounded-xl">
					<ClockIcon className="text-gray-600 size-12" />
					<div>
						<span className="text-xl">{plantingTimeLifeDays}</span> days
						<p>Since it was planted</p>
					</div>
				</div>
			</div>
		</Card>
	);
}
