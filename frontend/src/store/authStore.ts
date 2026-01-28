import { create } from "zustand";

interface User {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
	role: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	setAuth: (user: User, token: string) => void;
	setUser: (user: User) => void;
	logout: () => void;
	checkAuth: () => Promise<void>;
}

import { API_URL } from "../config/apiConfig";

export const useAuthStore = create<AuthState>((set) => ({
	user: JSON.parse(localStorage.getItem("user") || "null"),
	token: localStorage.getItem("token"),
	setAuth: (user, token) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		set({ user, token });
	},
	setUser: (user) => {
		localStorage.setItem("user", JSON.stringify(user));
		set({ user });
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
