"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SideBar from "@/components/authenticated-layout/SideBar";
import {
	getAccessToken,
	refreshSession,
	setAccessToken,
} from "@/lib/apiClient";

export default function AuthenticatedLayout({ children }: LayoutProps<"/">) {
	const router = useRouter();
	const [accessToken, setAccessTokenState] = useState(getAccessToken());
	const [isLoading, setIsLoading] = useState(false);
	const alreadyValidate = useRef(false);

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
			<SideBar />
			{isLoading ? <div>Loading...</div> : children}
		</div>
	);
}
