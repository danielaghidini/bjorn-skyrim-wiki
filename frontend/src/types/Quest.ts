export interface QuestStep {
	id: string;
	title: string;
	description: string;
	videoUrl?: string;
	order: number;
}

export interface Quest {
	id: string;
	title: string;
	slug: string;
	description: string;
	summary?: string;
	order: number;
	category: string;
	difficulty?: string;
	rewards?: string;
	createdAt: string;
	updatedAt: string;
	steps?: QuestStep[];
}
