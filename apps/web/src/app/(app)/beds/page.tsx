"use client";
import { EllipsisIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import Dialog from "@/components/Dialog";
import { useBeds } from "@/hooks/useBeds";
import { useCreateBed } from "@/hooks/useCreateBed";

export default function Beds() {
	const { bedsList, isPending, isError } = useBeds();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isLocationOn, setIsLocationOn] = useState(false);
	const [bedName, setBedName] = useState("");
	const [bedLocation, setBedLocation] = useState("");
	const { createBed, isBedCreationPending } = useCreateBed();

	const toggleForm = () => {
		setIsFormOpen(!isFormOpen);
	};

	const handleBedCreation = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		createBed(
			{ name: bedName, location: bedLocation },
			{
				onSuccess: () => {
					toggleForm();
					setBedName("");
					setBedLocation("");
					setIsLocationOn(false);
				},
			},
		);
	};

	useEffect(() => {
		if (!isLocationOn) setBedLocation("");
	}, [isLocationOn]);

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
			{bedsList.map((bed) => {
				const formatedDate = new Date(bed.createdAt).toLocaleDateString();
				return (
					<div
						key={bed.id}
						className="flex items-center gap-4 rounded-2xl bg-white p-4 w-full drop-shadow-lg text-lg text-zinc-800 overflow-hidden hover:scale-101 transition-transform group"
					>
						<p className="text-lg">
							<span className="text-red-500 text-xl font-bold">{bed.name}</span>{" "}
							created at{" "}
							<span className="text-blue-900 text-xl font-bold">
								{formatedDate}
							</span>
						</p>
						{bed.location && (
							<p>
								Is at <span>{bed.location}</span>
							</p>
						)}
						<Link
							href={`/beds/${bed.id}`}
							className="border-2 border-dashed rounded-2xl p-1 opacity-40 group-hover:opacity-100 cursor-pointer"
						>
							<EllipsisIcon />
						</Link>
					</div>
				);
			})}
			<button
				type="button"
				onClick={toggleForm}
				className="flex border-2 border-white rounded-2xl p-4 gap-4 items-center  text-white cursor-pointer hover:scale-101 hover:bg-green-600/70 transition-all active:brightness-50"
			>
				<div className="bg-card rounded-xl">
					<PlusIcon className="size-8" />
				</div>
				<p className="text-lg sm:text-3xl">Add a new bed to your list</p>
			</button>
			<Dialog isOpen={isFormOpen} onClose={toggleForm} title="New Bed">
				<form action="" onSubmit={handleBedCreation}>
					<fieldset
						disabled={isBedCreationPending}
						className="disabled:opacity-50 min-w-84 flex flex-col gap-6  p-4"
					>
						<input
							type="text"
							placeholder="Bed Name:"
							required
							value={bedName}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setBedName(e.target.value);
							}}
							className="bg-gray-100 text-lg text-gray-700 p-3 rounded placeholder:text-gray-500 focus:bg-white focus:outline-2 focus:outline-[#3F6E4A] focus:border-0  hover:outline-[#A4CBA9] hover:outline-2"
						/>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								onChange={(e) => setIsLocationOn(e.target.checked)}
								className=" accent-[#3F6E4A] size-4"
							/>{" "}
							Include Location
						</label>
						<input
							type="text"
							disabled={!isLocationOn}
							placeholder="Bed Location:"
							value={bedLocation}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setBedLocation(e.target.value);
							}}
							className="bg-gray-100 text-lg text-gray-700 p-3 rounded placeholder:text-gray-500 focus:bg-white focus:outline-2 focus:outline-[#3F6E4A] focus:border-0  hover:outline-[#A4CBA9] hover:outline-2 disabled:opacity-50 disabled:outline-0"
						/>
						<button
							type="submit"
							className="p-2 text-gray-800 hover:text-white text-lg font-bold border-2 border-[#6BA37E] hover:bg-[#6BA37E] rounded transition-colors"
						>
							Create
						</button>
					</fieldset>
				</form>
			</Dialog>
		</main>
	);
}
