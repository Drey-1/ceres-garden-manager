"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import BarButton from "@/components/BarButton";
import BedCard from "@/components/beds/BedCard";
import BedCreationForm from "@/components/beds/BedCreationForm";
import { useBeds } from "@/hooks/useBeds";

export default function Beds() {
	const { bedsList, isPending, isError } = useBeds();
	const [isFormOpen, setIsFormOpen] = useState(false);

	const toggleForm = () => {
		setIsFormOpen(!isFormOpen);
	};

	if (isPending) {
		return (
			<main className="flex flex-col gap-4 p-4 w-full h-full">
				<div className="flex flex-col gap-1 rounded-2xl bg-white p-4 w-full drop-shadow-lg text-lg text-zinc-800 overflow-hidden hover:scale-101 transition-transform animate-pulse"></div>
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
				Your list of planting beds:
			</h2>
			{bedsList.map((bed) => (
				<BedCard bed={bed} key={bed.id} />
			))}
			<BarButton
				Icon={PlusIcon}
				text="Add a new bed to your list"
				clickFunction={toggleForm}
				className="hover:bg-green-600/70"
			/>
			<BedCreationForm isOpen={isFormOpen} closeFunction={toggleForm} />
		</main>
	);
}
