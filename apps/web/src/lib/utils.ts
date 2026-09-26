import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
	if (!str) return str;
	const firstLetter = str[0].toUpperCase();
	const rest = str.slice(1).toLowerCase();
	return firstLetter + rest;
}
