import { CalendarCheckIcon, LandPlotIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch, setAccessToken } from "@/lib/apiClient";
import NavLink from "./NavLink";

export default function SideBar() {
	const router = useRouter();
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
	return (
		<aside className="sticky bottom-0 z-50 bg-[#6AA27D] px-6 py-4 w-screen md:w-auto md:min-h-screen rounded-t-2xl md:rounded-r-2xl md:rounded-t-none">
			<div className="sticky md:top-0">
				<p className="hidden md:block items-center text-3xl font-bold text-center border-b py-4 border-white">
					CERES
				</p>
				<nav className="flex justify-center md:flex-col gap-4 md:py-2">
					<NavLink href="/today" Icon={CalendarCheckIcon} label="Today" />
					<NavLink href="/beds" Icon={LandPlotIcon} label="Beds" />
					<NavLink onClick={logout} Icon={LogOutIcon} label="Logout" />
				</nav>
			</div>
		</aside>
	);
}
