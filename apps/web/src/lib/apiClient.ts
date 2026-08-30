const BASE_URL = process.env.API_URL || "http://localhost:3333";

let currentAccessToken: string | null = null;

export function getAccessToken() {
	return currentAccessToken;
}

export function setAccessToken(token: string | null) {
	currentAccessToken = token;
}

let refreshTokenPromise: Promise<string> | null = null;

async function performRefresh() {
	const refreshResponse = await fetch(BASE_URL + "/auth/refresh", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
	});

	if (!refreshResponse.ok) {
		setAccessToken(null);
		throw new Error("The user is logged out");
	}

	const data = await refreshResponse.json();
	const newToken = data.accessToken;

	if (!newToken) {
		setAccessToken(null);
		throw new Error("The user is logged out");
	}

	setAccessToken(newToken);
	return newToken;
}

export function refreshSession() {
	if (refreshTokenPromise) {
		return refreshTokenPromise;
	}

	refreshTokenPromise = performRefresh().finally(() => {
		refreshTokenPromise = null;
	});

	return refreshTokenPromise;
}

export async function apiFetch(path: string, options?: RequestInit) {
	const url = BASE_URL + path;

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...(currentAccessToken && {
			Authorization: `Bearer ${currentAccessToken}`,
		}),
		...options?.headers,
	};

	let response = await fetch(url, {
		...options,
		headers,
		credentials: "include",
	});

	if (response.status === 401) {
		try {
			const newToken = await refreshSession();

			const retryHeaders: HeadersInit = {
				...headers,
				Authorization: `Bearer ${newToken}`,
			};

			response = await fetch(url, {
				...options,
				headers: retryHeaders,
				credentials: "include",
			});
		} catch (err: any) {
			throw err
		}
	}

	if (!response.ok) {
		const errorData = await response.json().catch(() => {});
		throw new Error(errorData.error || "HTTP Error: " + response.status);
	}

	if (response.status === 204) return null;

	return response.json();
}
