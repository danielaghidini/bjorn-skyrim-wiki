import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// Hardcoded fallback if file read fails, but we try to read the file first
const DEFAULT_SYSTEM_PROMPT = `You are Bjorn, a Nord warrior from Skyrim. You are brave, loyal, and slightly sarcastic. You speak with a Nordic accent, using terms like 'lad', 'lass', and 'aye'.`;

const getSystemPrompt = (): string => {
	try {
		// Attempt to read the Markdown file from the frontend assets
		// Adjust path based on where this controller is located: src/controllers -> ../../../frontend
		const promptPath = path.resolve(
			process.cwd(),
			"../frontend/src/assets/author-docs/chatbot-bjorn.md",
		);

		if (fs.existsSync(promptPath)) {
			const fileContent = fs.readFileSync(promptPath, "utf-8");
			// Add a specific instruction to the model to strictly follow the character definition
			return `You are a roleplay AI. Here is your character definition:\n\n${fileContent}\n\nAct exclusively as this character. Stay in character at all times.`;
		}
	} catch (error) {
		console.warn(
			"Failed to read chatbot-bjorn.md, using default prompt:",
			error,
		);
	}
	return DEFAULT_SYSTEM_PROMPT;
};

export const chatWithBjorn = async (req: Request, res: Response) => {
	const { message, history } = req.body;

	if (!message) {
		res.status(400).json({ error: "Message is required" });
		return;
	}

	const apiKey = process.env.NVIDIA_API_KEY;
	if (!apiKey) {
		res.status(500).json({
			error: "Server misconfigured: API Key missing",
		});
		return;
	}

	// Debug log for API Key (do not log the actual key in production!)
	console.log("API Key present:", !!apiKey);

	// Construct message history for the AI
	// history is expected to be an array of { role: 'user' | 'assistant', content: string }
	const messages = [
		{ role: "system", content: getSystemPrompt() },
		...(Array.isArray(history) ? history : []),
		{ role: "user", content: message },
	];

	try {
		console.log("Sending request to NVIDIA API...");
		const response = await fetch(
			"https://integrate.api.nvidia.com/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model: "meta/llama-3.1-70b-instruct", // High quality open model
					messages: messages,
					temperature: 0.7,
					top_p: 1,
					max_tokens: 1024,
				}),
			},
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("NVIDIA API Error Status:", response.status);
			console.error("NVIDIA API Error Text:", errorText);
			res.status(response.status).json({
				error: "AI Service Error",
				details: errorText,
			});
			return;
		}

		const data: any = await response.json();
		console.log("NVIDIA API Raw Response:", JSON.stringify(data, null, 2));

		const reply = data.choices?.[0]?.message?.content;

		if (!reply) {
			console.error("NVIDIA API returned no reply. Full data:", data);
			res.status(500).json({
				error: "Empty response from AI",
				data: data,
			});
			return;
		}

		res.json({ reply });
	} catch (error) {
		console.error("Chat Controller Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
