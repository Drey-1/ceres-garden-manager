"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { apiFetch, setAccessToken } from "@/lib/apiClient";

export default function Login() {
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const data = await apiFetch("/auth/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			});

			setAccessToken(data.accessToken);

			router.push("/today");
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<form action="" onSubmit={handleSubmit} className="min-w-84 flex flex-col gap-6 bg-white/60 border-white border-2 backdrop-blur-md p-4 rounded-xl">
			<h2 className="text-2xl text-center text-white font-bold text-border text-shadow-lg">Login</h2>
			<input
				type="email"
				placeholder="Email:"
				value={email}
				required
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					setEmail(e.target.value);
				}}
				className="bg-gray-100 text-lg text-gray-700 p-3 rounded placeholder:text-gray-500 focus:bg-white focus:outline-2 focus:outline-[#3F6E4A] focus:border-0  hover:outline-[#A4CBA9] hover:outline-2"
			/>
			<input
				type="password"
				placeholder="Password:"
				value={password}
				required
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					setPassword(e.target.value);
				}}
				className="bg-gray-100 text-lg text-gray-700 p-3 rounded placeholder:text-gray-500 focus:bg-white focus:outline-2 focus:outline-[#3F6E4A] focus:border-0  hover:outline-[#A4CBA9] hover:outline-2"
			/>
			<button type="submit" className="p-2 text-gray-800 hover:text-white text-lg font-bold border-2 border-[#6BA37E] hover:bg-[#6BA37E] rounded transition-colors">Submit</button>
			<p className="text-lg text-gray-600">
				Don't have an account? <Link href={"/register"} className="text-[#56A2E8] font-semibold">Register</Link>
			</p>

			{error && (
				<div className="bg-slate-600 p-2 rounded">
					<p className="text-red-500 text-lg">{error}</p>
				</div>
			)}
		</form>
	);
}
