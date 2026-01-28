import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import {
	login,
	register,
	getMe,
	updateProfile,
} from "./controllers/authController.js";
import { authenticateToken } from "./middleware/auth.js";
import {
	createArticle,
	updateArticle,
	deleteArticle,
	createQuest,
	updateQuest,
	deleteQuest,
	createCategory,
} from "./controllers/contentController.js";

import { prisma, connectDB } from "./db.js";
import {
	getAllFanArt,
	createFanArt,
	updateFanArt,
	deleteFanArt,
} from "./controllers/fanArtController.js";
import { getDialogues, getScenes } from "./controllers/dialogueController.js";
import { chatWithBjorn } from "./controllers/chatController.js";
import { metricsMiddleware } from "./middleware/metricsMiddleware.js";
import { getMetrics } from "./controllers/metricsController.js";
import {
	getAllUsers,
	updateUserRole,
} from "./controllers/adminUserController.js";
import {
	getAllSongs,
	createSong,
	updateSong,
	deleteSong,
} from "./controllers/songController.js";
import { authorizeRole } from "./middleware/auth.js";

console.log("Starting server...");
connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

// Chat Route
app.post("/api/chat", chatWithBjorn);

app.get("/api/health", (req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/articles", async (req, res) => {
	try {
		const articles = await prisma.article.findMany({
			include: { category: true },
			orderBy: { createdAt: "desc" },
		});
		res.json(articles);
	} catch (error) {
		console.error("Fetch articles error:", error);
		res.status(500).json({ error: "Failed to fetch articles" });
	}
});

app.post("/api/articles", async (req, res) => {
	const { title, slug, content, excerpt, categoryId } = req.body;
	try {
		const article = await prisma.article.create({
			data: { title, slug, content, excerpt, categoryId },
		});
		res.status(201).json(article);
	} catch (error) {
		console.error("Create article error:", error);
		res.status(500).json({ error: "Failed to create article" });
	}
});

app.get("/api/categories", async (req, res) => {
	try {
		const categories = await prisma.category.findMany({
			include: { _count: { select: { articles: true } } },
		});
		res.json(categories);
	} catch (error) {
		console.error("Fetch categories error:", error);
		res.status(500).json({ error: "Failed to fetch categories" });
	}
});

app.post("/api/categories", async (req, res) => {
	const { name, description } = req.body;
	try {
		const category = await prisma.category.create({
			data: { name, description },
		});
		res.status(201).json(category);
	} catch (error) {
		console.error("Create category error:", error);
		res.status(500).json({ error: "Failed to create category" });
	}
});

// app.get("/api/quests", ...); // Handled by questRoutes

app.get("/api/fan-art", getAllFanArt);
app.get("/api/dialogues", getDialogues);
app.get("/api/scenes", getScenes);
app.get("/api/songs", getAllSongs);
app.get(
	"/api/admin/metrics",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	getMetrics,
);
app.get(
	"/api/admin/users",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	getAllUsers,
);
app.put(
	"/api/admin/users/:userId/role",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	updateUserRole,
);

// Auth Routes
app.post("/auth/register", register);
app.post("/auth/login", login);
app.get("/auth/me", authenticateToken, getMe);
app.put("/auth/profile", authenticateToken, updateProfile);

import questRoutes from "./routes/questRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";

app.use("/api/quests", questRoutes);
app.use("/api/forum", forumRoutes);

// Protected Content Routes
app.post("/articles", authenticateToken, createArticle);
app.put("/articles/:id", authenticateToken, updateArticle);
app.delete("/articles/:id", authenticateToken, deleteArticle);

// app.post("/quests", authenticateToken, createQuest); // Removed in favor of questRoutes
// app.put("/quests/:id", authenticateToken, updateQuest); // Removed in favor of questRoutes
// app.delete("/quests/:id", authenticateToken, deleteQuest); // Removed in favor of questRoutes

app.post("/fan-art", authenticateToken, createFanArt);
app.put("/fan-art/:id", authenticateToken, updateFanArt);
app.delete("/fan-art/:id", authenticateToken, deleteFanArt);

app.post(
	"/api/admin/songs",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	createSong,
);
app.put(
	"/api/admin/songs/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	updateSong,
);
app.delete(
	"/api/admin/songs/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	deleteSong,
);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
