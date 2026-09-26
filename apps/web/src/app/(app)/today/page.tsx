"use client";

import TodayCard from "@/components/today/TodayCard";
import { useToday } from "@/hooks/useToday";

export default function Today() {
	const { pendingPlantings, isPending, isError } = useToday();

	if (isPending) {
		return (
			<main className="flex flex-col gap-4 p-4 w-full h-full">
				<h2 className="text-2xl text-white font-semibold text-shadow-md">
					Your plantings with pendencies:
				</h2>
				<div className="h-32 rounded-2xl bg-white w-full drop-shadow-lg text-lg animate-pulse"></div>
			</main>
		);
	}

	if (isError) {
		return (
			<main className="flex flex-col gap-4 p-4 w-full h-full">
				<p className="bg-slate-500 p-4 rounded-2xl w-max text-white font-semibold text-2xl m-auto wrap-break-word max-w-11/12 border-dashed border-4 border-red-600">
					Error loading data, Try again later.
				</p>
			</main>
		);
	}

	return (
		<main className="flex flex-col gap-4 p-4 w-full h-full">
			<h2 className="text-2xl text-white font-semibold text-shadow-md">
				Your plantings with pendencies:
			</h2>
			{pendingPlantings.map((planting) => (
				<TodayCard key={planting.id} planting={planting} />
			))}

			{pendingPlantings.length === 0 && (
				<p className="bg-white p-4 rounded-2xl w-max text-[#3F6E4A] font-semibold text-2xl m-auto wrap-break-word max-w-11/12 border-dashed border-4 border-[#3F6E4A]">
					Good Job! There's no pendencies today. Come back Tommorow.
				</p>
			)}
		</main>
	);
}
