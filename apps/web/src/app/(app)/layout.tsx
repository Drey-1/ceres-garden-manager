"use client";

import { CalendarCheckIcon, LandPlotIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
	apiFetch,
	getAccessToken,
	refreshSession,
	setAccessToken,
} from "@/lib/apiClient";

export default function AuthenticatedLayout({ children }: LayoutProps<"/">) {
	const router = useRouter();
	const [accessToken, setAccessTokenState] = useState(getAccessToken());
	const [isLoading, setIsLoading] = useState(false);
	const alreadyValidate = useRef(false);

	const logout = async () => {
		try {
			await apiFetch("/auth/logout", { method: "POST" });
			setAccessToken(null);
			router.push("/login");
		} catch (err: any) {
			window.alert(
				"Logout has failed, try again later. Error message: " + err.message,
			);
		}
	};

	useEffect(() => {
		if (alreadyValidate.current) return;
		alreadyValidate.current = true;

		const validation = async () => {
			if (!accessToken) {
				setIsLoading(true);
				try {
					const newAccessToken = await refreshSession();
					setAccessToken(newAccessToken);
					setAccessTokenState(newAccessToken);
				} catch (err: any) {
					if (err) router.push("/login");
				} finally {
					setIsLoading(false);
				}
			}
		};

		validation();
	}, [accessToken, router]);

	return (
		<div className="flex flex-col-reverse md:flex-row justify-between min-h-screen bg-olive-300">
			<aside className="sticky bottom-0 z-50 bg-[#6AA27D] px-6 py-4 w-screen md:w-auto md:min-h-screen rounded-t-2xl md:rounded-r-2xl md:rounded-t-none">
				<div className="sticky md:top-0">
					<p className="hidden md:block items-center text-3xl font-bold text-center border-b py-4 border-white">
						CERES
					</p>
					<nav className="flex justify-center md:flex-col gap-4 md:py-2">
						<Link
							href={"/today"}
							className="flex gap-2 items-center hover:backdrop-brightness-50 hover:scale-105 p-1 rounded-xl transition-all "
						>
							<CalendarCheckIcon className="size-10" />
							<span className="text-2xl hidden md:inline">Today</span>
						</Link>
						<Link
							href={"/beds"}
							className="flex gap-2 items-center hover:backdrop-brightness-50 hover:scale-105 p-1  rounded-xl transition-all "
						>
							<LandPlotIcon className="size-10" />
							<span className="text-2xl hidden md:inline">Beds</span>
						</Link>
						<button
							type="button"
							onClick={logout}
							className="flex gap-2 items-center hover:backdrop-brightness-50 hover:scale-105 p-1  rounded-xl transition-all cursor-pointer "
						>
							<LogOutIcon className="size-10" />
							<span className="text-2xl hidden md:inline">Logout</span>
						</button>
					</nav>
				</div>
			</aside>
			{isLoading ? <div>Loading...</div> : children}
		</div>
	);
}
