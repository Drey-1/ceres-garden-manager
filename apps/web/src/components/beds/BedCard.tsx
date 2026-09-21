import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import type { BedType } from "@/types/BedType";
import Card from "../Card";

export default function BedCard({ bed }: { bed: BedType }) {
	const formatedDate = new Date(bed.createdAt).toLocaleDateString();
	return (
		<Card className="hover:scale-101 transition-transform group">
			<p className="text-lg">
				<span className="text-red-500 text-xl font-bold">{bed.name}</span>{" "}
				created at{" "}
				<span className="text-blue-900 text-xl font-bold">{formatedDate}</span>
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
		</Card>
	);
}
