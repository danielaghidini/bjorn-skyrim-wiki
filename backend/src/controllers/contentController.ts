import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.js";

const prisma = new PrismaClient();

// Articles
export const createArticle = async (req: AuthRequest, res: Response) => {
	try {
		const { title, slug, content, excerpt, categoryId, published } =
			req.body;
		const article = await prisma.article.create({
			data: {
				title,
				slug,
				content,
				excerpt,
				categoryId,
				published,
				author: req.user?.id,
			},
		});
		res.status(201).json(article);
	} catch (error) {
		res.status(500).json({ error: "Error creating article" });
	}
};

export const updateArticle = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params as { id: string };
		const article = await prisma.article.update({
			where: { id },
			data: req.body,
		});
		res.json(article);
	} catch (error) {
		res.status(500).json({ error: "Error updating article" });
	}
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params as { id: string };
		await prisma.article.delete({ where: { id } });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Error deleting article" });
	}
};

// Quests
export const createQuest = async (req: AuthRequest, res: Response) => {
	try {
		const { title, slug, description, difficulty, rewards } = req.body;
		const quest = await prisma.quest.create({
			data: { title, slug, description, difficulty, rewards },
		});
		res.status(201).json(quest);
	} catch (error) {
		res.status(500).json({ error: "Error creating quest" });
	}
};

export const updateQuest = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params as { id: string };
		const quest = await prisma.quest.update({
			where: { id },
			data: req.body,
		});
		res.json(quest);
	} catch (error) {
		res.status(500).json({ error: "Error updating quest" });
	}
};

export const deleteQuest = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params as { id: string };
		await prisma.quest.delete({ where: { id } });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Error deleting quest" });
	}
};
