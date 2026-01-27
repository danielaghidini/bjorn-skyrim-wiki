import { create } from "zustand";

interface User {
	id: string;
	email: string;
	role: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	setAuth: (user: User, token: string) => void;
	logout: () => void;
	checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: JSON.parse(localStorage.getItem("user") || "null"),
	token: localStorage.getItem("token"),
	setAuth: (user, token) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		set({ user, token });
	},
	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		set({ user: null, token: null });
	},
	checkAuth: async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			set({ user: null, token: null });
			return;
		}
		try {
			// Dynamic import to avoid circular dependency if using axios instance which uses store,
			// but here we use direct axios or fetch.
			// Wait, we need the API_URL. I will fetch it or hardcode relative path if proxy used?
			// LocalStorage has token.
			const API_URL =
				import.meta.env.VITE_API_URL || "http://localhost:3000";
			const response = await fetch(`${API_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const user = await response.json();
				localStorage.setItem("user", JSON.stringify(user));
				set({ user, token });
			} else {
				// Token invalid
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				set({ user: null, token: null });
			}
		} catch (error) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			set({ user: null, token: null });
		}
	},
}));
