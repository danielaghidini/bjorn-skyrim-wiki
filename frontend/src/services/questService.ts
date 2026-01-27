import axios from "axios";
import type { Quest } from "../types/Quest";
import { API_URL } from "../config/apiConfig";

const getAuthHeader = () => {
	const token = localStorage.getItem("token");
	return { headers: { Authorization: `Bearer ${token}` } };
};

export const getQuests = async (): Promise<Quest[]> => {
	const response = await axios.get(`${API_URL}/api/quests`);
	return response.data;
};

export const getQuestBySlug = async (slug: string): Promise<Quest> => {
	const response = await axios.get(`${API_URL}/api/quests/${slug}`);
	return response.data;
};

export const createQuest = async (
	questData: Partial<Quest>,
): Promise<Quest> => {
	const response = await axios.post(
		`${API_URL}/api/quests`,
		questData,
		getAuthHeader(),
	);
	return response.data;
};

export const updateQuest = async (
	id: string,
	questData: Partial<Quest>,
): Promise<Quest> => {
	const response = await axios.put(
		`${API_URL}/api/quests/${id}`,
		questData,
		getAuthHeader(),
	);
	return response.data;
};

export const deleteQuest = async (id: string): Promise<void> => {
	await axios.delete(`${API_URL}/api/quests/${id}`, getAuthHeader());
};
