import { PlusIcon } from "lucide-react";
import { useCallback, useRef } from "react";
import { useCareLogs } from "@/hooks/useCareLogs";
import Card from "../Card";

const pageSize = 10;

export default function CareLogsList({
	plantingId,
	isPlantingActive,
    creationFunction
}: {
	plantingId: string;
	isPlantingActive: boolean;
    creationFunction: () => void
}) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending: isCareLogsPending,
		isError: isCareLogsError,
	} = useCareLogs(plantingId, pageSize);
	const careLogs = data?.pages.flatMap((page) => page.careLogs) ?? [];

	const observer = useRef<IntersectionObserver | null>(null);

	const lastCareLogRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isFetchingNextPage) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && hasNextPage) {
						fetchNextPage();
					}
				},
				{ threshold: 0.1, rootMargin: "200px" },
			);

			if (node) observer.current.observe(node);
		},
		[isFetchingNextPage, hasNextPage, fetchNextPage],
	);

	if (isCareLogsPending) {
		return <Card className="animate-pulse">Loading...</Card>;
	}

	if (isCareLogsError) {
		return <Card className="text-red-600">Error loading data!</Card>;
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<h2 className="text-2xl text-white font-semibold text-shadow-md">
				All logs of care:
			</h2>
			{isPlantingActive ? (
				<button
					type="button"
					onClick={creationFunction}
					className="flex border-2 border-white rounded-2xl p-4 gap-4 items-center  text-white cursor-pointer hover:scale-101 hover:bg-green-600/70 transition-all active:brightness-50"
				>
					<div className="bg-card rounded-xl">
						<PlusIcon className="size-8" />
					</div>
					<p className="text-lg sm:text-3xl">
						Add a new care log of this planting
					</p>
				</button>
			) : (
				""
			)}
			{careLogs.map((careLog, index) => {
				const isLast = careLogs.length === index + 1;

				return (
					<Card
						key={careLog.id}
						ref={isLast ? lastCareLogRef : null}
						className="grid grid-cols-3 hover:scale-101 transition-transform"
					>
						<p>{careLog.type}</p>
						<p>{careLog.quantity ?? 1} Time(s)</p>
						<p className="text-end">
							Logged at {new Date(careLog.createdAt).toLocaleDateString()}
						</p>
					</Card>
				);
			})}
			{isFetchingNextPage && <Card className="animate-pulse">Loading...</Card>}
		</div>
	);
}
