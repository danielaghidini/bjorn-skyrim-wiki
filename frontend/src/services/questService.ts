import api from "../api/api";
import type { Quest } from "../types/Quest";

export const getQuests = async (): Promise<Quest[]> => {
	const response = await api.get(`/api/quests`);
	return response.data;
};

export const getQuestBySlug = async (slug: string): Promise<Quest> => {
	const response = await api.get(`/api/quests/${slug}`);
	return response.data;
};

export const createQuest = async (
	questData: Partial<Quest>,
): Promise<Quest> => {
	const response = await api.post(`/api/quests`, questData);
	return response.data;
};

export const updateQuest = async (
	id: string,
	questData: Partial<Quest>,
): Promise<Quest> => {
	const response = await api.put(`/api/quests/${id}`, questData);
	return response.data;
};

export const deleteQuest = async (id: string): Promise<void> => {
	await api.delete(`/api/quests/${id}`);
};
