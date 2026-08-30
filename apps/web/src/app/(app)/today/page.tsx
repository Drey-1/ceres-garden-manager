"use client";

import { useCreateCareLog } from "@/hooks/useCreateCareLog";
import { useToday } from "@/hooks/useToday";

export default function Today() {
	const { pendingPlantings, isPending, isError } = useToday();
	const { mutate } = useCreateCareLog();

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
			{pendingPlantings.map((planting) => {
				return (
					<div
						key={planting.id}
						className="flex flex-col gap-1 rounded-2xl bg-white p-4 w-full drop-shadow-lg text-lg text-zinc-800 overflow-hidden"
					>
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
								<button
									type="button"
									onClick={() =>
										mutate({ type: "WATER", plantingId: planting.id })
									}
									className="bg-blue-400 hover:brightness-95 outline-gray-200 outline-2 py-1 px-3 rounded-2xl text-white hover:scale-110 transition-all cursor-pointer"
								>
									Water
								</button>
							)}
							{planting.pendingActions.includes("FERTILIZE") && (
								<button
									type="button"
									onClick={() =>
										mutate({ type: "FERTILIZE", plantingId: planting.id })
									}
									className="bg-amber-600 hover:brightness-95 outline-gray-200 outline-2 py-1 px-3 rounded-2xl text-white hover:scale-110 transition-all cursor-pointer"
								>
									Fertilize
								</button>
							)}
							{planting.pendingActions.includes("HARVEST") && (
								<button
									type="button"
									onClick={() =>
										mutate({ type: "HARVEST", plantingId: planting.id })
									}
									className="bg-green-500 hover:brightness-95 outline-gray-200 outline-2 py-1 px-3 rounded-2xl text-white hover:scale-110 transition-all cursor-pointer"
								>
									Harvest
								</button>
							)}
						</div>
					</div>
				);
			})}

			{pendingPlantings.length === 0 && (
				<p className="bg-white p-4 rounded-2xl w-max text-[#3F6E4A] font-semibold text-2xl m-auto wrap-break-word max-w-11/12 border-dashed border-4 border-[#3F6E4A]">
					Good Job! There's no pendencies today. Come back Tommorow.
				</p>
			)}
		</main>
	);
}
