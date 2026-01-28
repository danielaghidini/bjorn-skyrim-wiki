import axios from "axios";
import { useAuthStore } from "../store/authStore";
import type { Post } from "../types/forum";
import { API_URL as BASE_URL } from "../config/apiConfig";

const API_URL = `${BASE_URL}/api/forum`;

const getAuthHeaders = () => {
	const token = useAuthStore.getState().token;
	return token ? { Authorization: `Bearer ${token}` } : {};
};

export const initialPosts: Post[] = []; // Deprecated, kept for compat check if any

export const forumService = {
	getAllPosts: async (): Promise<Post[]> => {
		try {
			const response = await axios.get(API_URL, {
				headers: getAuthHeaders(),
			});
			return response.data;
		} catch (error) {
			console.error("Error fetching posts:", error);
			return [];
		}
	},

	getPostById: async (id: string): Promise<Post | undefined> => {
		try {
			const response = await axios.get(`${API_URL}/${id}`, {
				headers: getAuthHeaders(),
			});
			return response.data;
		} catch (error) {
			console.error("Error fetching post:", error);
			return undefined;
		}
	},

	createPost: async (postData: {
		title: string;
		content: string;
		category: string;
	}): Promise<Post> => {
		const response = await axios.post(API_URL, postData, {
			headers: getAuthHeaders(),
		});
		return response.data;
	},

	addComment: async (postId: string, commentText: string): Promise<void> => {
		await axios.post(
			`${API_URL}/${postId}/comments`,
			{ content: commentText },
			{ headers: getAuthHeaders() },
		);
	},

	toggleLike: async (postId: string): Promise<void> => {
		await axios.post(
			`${API_URL}/${postId}/like`,
			{},
			{ headers: getAuthHeaders() },
		);
	},
};
