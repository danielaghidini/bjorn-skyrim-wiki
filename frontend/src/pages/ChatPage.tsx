import React, { useState, useRef, useEffect } from "react";
import {
	Send,
	ArrowLeft,
	Terminal,
	User,
	Trash2,
	RefreshCw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
	Box,
	Container,
	Typography,
	Paper,
	Avatar,
	IconButton,
	Stack,
	InputBase,
	Button,
} from "@mui/material";
import { useAuthStore } from "../store/authStore";

// Import local image
import bjornPortrait from "../assets/bjorn_portrait.png";

interface Message {
	role: "user" | "assistant";
	content: string;
}

const ChatPage: React.FC = () => {
	// Initialize with the Greeting
	/* eslint-disable react-hooks/exhaustive-deps */
	const INITIAL_MESSAGE: Message = {
		role: "assistant",
		content:
			"*The air inside Whitewatch Tower is thick with smoke and the stench of blood. You cut down one of the last bandits just as a tall Nord buries his sword into another’s chest. The final scream dies out, leaving only the crackle of burning wood and the labored breath of the surviving guards.*\n\n*The Nord wipes his blade clean, gives you a quick once-over, then smiles — a crooked, mead-warmed grin that doesn’t match the carnage around you.*",
	};

	// User
	const { user } = useAuthStore();
	const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Load history on mount/user change
	useEffect(() => {
		setIsHistoryLoaded(false); // Reset on user change
		if (user?.id) {
			const saved = localStorage.getItem(`bjorn_chat_${user.id}`);
			if (saved) {
				try {
					const parsed = JSON.parse(saved);
					if (Array.isArray(parsed) && parsed.length > 0) {
						setMessages(parsed);
					}
				} catch (e) {
					console.error("Failed to load chat history", e);
				}
			}
			// Mark as loaded whether we found save or not (if not, we keep initial/current)
			setIsHistoryLoaded(true);
		} else {
			// No user, reset to initial
			setMessages([INITIAL_MESSAGE]);
		}
	}, [user?.id]);

	// Save history on change
	useEffect(() => {
		if (isHistoryLoaded && user?.id && messages.length > 0) {
			localStorage.setItem(
				`bjorn_chat_${user.id}`,
				JSON.stringify(messages),
			);
		}
	}, [messages, user?.id, isHistoryLoaded]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	const handleReset = () => {
		if (window.confirm("Restart the conversation?")) {
			setMessages([INITIAL_MESSAGE]);
			if (user?.id) {
				localStorage.removeItem(`bjorn_chat_${user.id}`);
			}
		}
	};

	const fetchBjornResponse = async (currentHistory: Message[]) => {
		setIsLoading(true);
		try {
			const baseUrl = import.meta.env.VITE_API_ORIGIN || "";
			const apiUrl = `${baseUrl}/api/chat`;

			// History for backend: exclude the very last user message if we are sending it separately?
			// Actually backend takes "message" (latest) and "history" (context).
			// So we need to split.
			const lastMsg = currentHistory[currentHistory.length - 1];
			const context = currentHistory.slice(0, -1);

			const response = await fetch(apiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: lastMsg.content,
					history: context.map((m) => ({
						role: m.role,
						content: m.content,
					})),
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data.error || data.details || "Failed to fetch response",
				);
			}

			if (data.reply) {
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: data.reply },
				]);
			} else {
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content: "(Bjorn seems lost in thought... try again.)",
					},
				]);
			}
		} catch (error: unknown) {
			console.error("Chat error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: `(Connection error: ${errorMessage}. Ensure backend is running.)`,
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage: Message = { role: "user", content: input };
		const newHistory = [...messages, userMessage];
		setMessages(newHistory);
		setInput("");

		await fetchBjornResponse(newHistory);
	};

	const handleRegenerate = async () => {
		if (isLoading || messages.length === 0) return;
		const lastMsg = messages[messages.length - 1];
		if (lastMsg.role !== "assistant") return;

		// Backtrack to remove the AI response
		const historyWithoutAi = messages.slice(0, -1);
		setMessages(historyWithoutAi);

		// Trigger fetch with the remaining history (which ends in user message)
		await fetchBjornResponse(historyWithoutAi);
	};

	const AVATAR_URL = bjornPortrait;

	// BG Image constants
	const BG_IMAGE_URL =
		"https://images.unsplash.com/photo-1518182170546-0766ce6fec93?q=80&w=2606&auto=format&fit=crop";

	return (
		<Box
			sx={{
				height: "100dvh", // Mobile viewport fix
				width: "100vw",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				position: "relative",
				bgcolor: "#000",
			}}
		>
			{/* Background Layer */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage: `url('${BG_IMAGE_URL}')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					filter: "brightness(0.3) blur(2px) saturate(0.8)",
					zIndex: 0,
				}}
			/>

			{/* Header */}
			<Box
				sx={{
					p: { xs: 1.5, md: 2 },
					zIndex: 10,
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					alignItems: { xs: "flex-start", md: "center" },
					justifyContent: "space-between",
					gap: { xs: 1, md: 0 },
				}}
			>
				<Box sx={{ width: { xs: "100%", md: "auto" } }}>
					<Link to="/" style={{ textDecoration: "none" }}>
						<Stack
							direction="row"
							alignItems="center"
							spacing={1}
							sx={{
								color: "rgba(255,255,255,0.7)",
								"&:hover": { color: "white" },
							}}
						>
							<Box
								sx={{
									p: 0.5,
									borderRadius: "50%",
									border: "1px solid rgba(255,255,255,0.2)",
									display: "flex",
								}}
							>
								<ArrowLeft size={20} />
							</Box>
							<Typography
								variant="body2"
								sx={{ fontFamily: "Bungee", letterSpacing: 1 }}
							>
								Back to Wiki
							</Typography>
						</Stack>
					</Link>
				</Box>

				<Stack alignItems="center" sx={{ width: "100%" }}>
					<Typography
						variant="h5"
						sx={{
							fontFamily: "Bungee",
							color: "#e2e8f0",
							textShadow: "0 2px 10px rgba(0,0,0,0.5)",
						}}
					>
						Talk to Bjorn
					</Typography>
					<Typography
						variant="caption"
						sx={{
							fontFamily: "Alan Sans",
							color: "#22d3ee",
							textTransform: "none",
							letterSpacing: 0.5,
							fontSize: "0.95rem",
							maxWidth: { xs: "100%", md: "100%" },
							textAlign: "center",
							mb: 1,
							lineHeight: 1.4,
						}}
					>
						This chatbot responds based on content created by the
						author. <br />
						Conversations are auto-saved to your device. We do not
						have access to your chat history.
					</Typography>
					<Stack direction="row" alignItems="center" spacing={1}>
						<Box
							sx={{
								width: 8,
								height: 8,
								borderRadius: "50%",
								bgcolor: "#22d3ee",
								boxShadow: "0 0 8px #22d3ee",
							}}
						/>
						<Typography
							variant="caption"
							sx={{
								color: "#bae6fd",
								letterSpacing: 2,
								fontWeight: "bold",
							}}
						>
							Connected
						</Typography>
					</Stack>
				</Stack>

				<Box sx={{ width: 40, display: { xs: "none", md: "block" } }}>
					<IconButton
						onClick={handleReset}
						sx={{
							color: "rgba(255,255,255,0.4)",
							"&:hover": { color: "#ef4444" },
						}}
						title="Reset Chat"
					>
						<Trash2 size={20} />
					</IconButton>
				</Box>
			</Box>

			{/* Chat Area Container */}
			<Container
				maxWidth="md"
				disableGutters
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					zIndex: 10,
					position: "relative",
					overflow: "hidden",
					pb: 2,
					px: { xs: 1, md: 0 },
				}}
			>
				<Paper
					elevation={4}
					sx={{
						flex: 1,
						bgcolor: {
							xs: "transparent",
							md: "rgba(10, 13, 20, 0.6)",
						},
						backdropFilter: { xs: "none", md: "blur(12px)" },
						border: {
							xs: "none",
							md: "1px solid rgba(255, 255, 255, 0.08)",
						},
						borderRadius: { xs: 0, md: 4 },
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						mb: 2,
						boxShadow: { xs: "none", md: 4 }, // Explicitly remove shadow on mobile
					}}
				>
					{/* Scrollable Messages */}
					<Box
						sx={{
							flex: 1,
							overflowY: "auto",
							p: { xs: 2, md: 4 },
							display: "flex",
							flexDirection: "column",
							gap: { xs: 2, md: 3 },
						}}
					>
						<AnimatePresence mode="popLayout">
							{messages.map((msg, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0, y: 10, scale: 0.98 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									transition={{ duration: 0.4 }}
								>
									<Stack
										direction={
											msg.role === "user"
												? "row-reverse"
												: "row"
										}
										spacing={2}
										alignItems="flex-start"
									>
										{/* Avatar */}
										{msg.role === "assistant" ? (
											<Avatar
												src={AVATAR_URL}
												alt="Bjorn"
												sx={{
													width: 48,
													height: 48,
													border: "1px solid rgba(255,255,255,0.2)",
												}}
											/>
										) : (
											<Avatar
												sx={{
													width: 48,
													height: 48,
													bgcolor: "primary.main",
												}}
											>
												<User size={24} />
											</Avatar>
										)}

										{/* Bubble */}
										<Box sx={{ maxWidth: "80%" }}>
											<Stack
												direction={
													msg.role === "user"
														? "row-reverse"
														: "row"
												}
												alignItems="center"
												spacing={1}
												sx={{ mb: 0.5 }}
											>
												<Typography
													variant="caption"
													sx={{
														fontFamily: "Bungee",
														color: "rgba(255,255,255,0.4)",
														letterSpacing: 1,
													}}
												>
													{msg.role === "assistant"
														? "BJORN"
														: "YOU"}
												</Typography>
											</Stack>

											<Paper
												elevation={0}
												sx={{
													p: { xs: 1.5, md: 2.5 },
													borderRadius: 3,
													borderTopLeftRadius:
														msg.role === "assistant"
															? 0
															: 3,
													borderTopRightRadius:
														msg.role === "user"
															? 0
															: 3,
													bgcolor:
														msg.role === "assistant"
															? "rgba(20, 25, 35, 0.8)"
															: "primary.main",
													color:
														msg.role === "assistant"
															? "#22d3ee"
															: "black",
													border:
														msg.role === "assistant"
															? "1px solid rgba(255,255,255,0.1)"
															: "none",
													lineHeight: 1.6,
												}}
											>
												<MessageContent
													role={msg.role}
													content={msg.content}
													isLatest={
														idx ===
														messages.length - 1
													}
												/>
											</Paper>
											{/* Regenerate Button for latest AI message */}
											{msg.role === "assistant" &&
												idx === messages.length - 1 &&
												idx > 0 &&
												!isLoading && (
													<Button
														onClick={
															handleRegenerate
														}
														startIcon={
															<RefreshCw
																size={16}
															/>
														}
														sx={{
															mt: 1,
															color: "rgba(255,255,255,0.6)",
															textTransform:
																"none",
															fontSize: "0.85rem",
															alignSelf:
																"flex-start",
															"&:hover": {
																color: "#22d3ee",
																bgcolor:
																	"rgba(34, 211, 238, 0.1)",
															},
														}}
													>
														Try again
													</Button>
												)}
										</Box>
									</Stack>
								</motion.div>
							))}
						</AnimatePresence>

						{/* Loading Indicator */}
						{isLoading && (
							<Stack direction="row" spacing={2}>
								<Avatar
									src={AVATAR_URL}
									sx={{
										width: 48,
										height: 48,
										opacity: 0.5,
										filter: "grayscale(100%)",
									}}
								/>
								<Paper
									sx={{
										p: 2,
										borderRadius: 3,
										borderTopLeftRadius: 0,
										bgcolor: "rgba(20, 25, 35, 0.8)",
										border: "1px solid rgba(255,255,255,0.1)",
									}}
								>
									<Stack direction="row" spacing={0.5}>
										{[0, 1, 2].map((dot) => (
											<motion.div
												key={dot}
												style={{
													width: 8,
													height: 8,
													backgroundColor: "#94a3b8", // grey.400
													borderRadius: "50%",
												}}
												animate={{
													opacity: [0.4, 1, 0.4],
												}}
												transition={{
													duration: 1.4,
													repeat: Infinity,
													delay: dot * 0.2,
												}}
											/>
										))}
									</Stack>
								</Paper>
							</Stack>
						)}
						<div ref={messagesEndRef} />
					</Box>

					{/* Input Area */}
					<Box
						sx={{
							p: { xs: 1.5, md: 2 },
							borderTop: "1px solid rgba(255,255,255,0.1)",
							bgcolor: "rgba(0,0,0,0.2)",
						}}
					>
						<Paper
							component="form"
							onSubmit={(e) => {
								e.preventDefault();
								handleSendMessage();
							}}
							elevation={0}
							sx={{
								p: "2px 4px",
								display: "flex",
								alignItems: "center",
								bgcolor: "rgba(255,255,255,0.05)",
								border: "1px solid rgba(255,255,255,0.1)",
								borderRadius: 3,
								transition: "0.2s",
								"&:focus-within": {
									bgcolor: "rgba(255,255,255,0.08)",
									borderColor: "primary.main",
									boxShadow:
										"0 0 10px rgba(79, 195, 247, 0.2)",
								},
							}}
						>
							<Box
								sx={{
									p: 1.5,
									color: "grey.500",
									display: "flex",
								}}
							>
								<Terminal size={20} />
							</Box>
							<InputBase
								sx={{
									ml: 1,
									flex: 1,
									color: "white",
									fontFamily: "Alan Sans",
									fontSize: "1.1rem",
								}}
								placeholder="Type your response..."
								value={input}
								onChange={(e) => setInput(e.target.value)}
								autoFocus
							/>
							<IconButton
								color="primary"
								sx={{ p: 1.5 }}
								onClick={handleSendMessage}
								disabled={!input.trim() || isLoading}
							>
								<Send size={20} />
							</IconButton>
						</Paper>

						<Typography
							variant="caption"
							sx={{
								display: "block",
								textAlign: "center",
								mt: 1.5,
								mb: 1,
								color: "grey.600",
								letterSpacing: 1,
								fontSize: "0.7rem",
								textTransform: "uppercase",
							}}
						>
							NVIDIA NIM Powered • Llama 3.1 70B • Roleplay Mode
						</Typography>
					</Box>
				</Paper>
			</Container>
		</Box>
	);
};

// Helper component for message content
const MessageContent = ({
	role,
	content,
	isLatest,
}: {
	role: "user" | "assistant";
	content: string;
	isLatest: boolean;
}) => {
	const [displayedText, setDisplayedText] = useState("");
	const [mood, setMood] = useState<string | null>(null);

	useEffect(() => {
		// Clean content (extract mood)
		let cleanContent = content;
		const moodMatch = content.match(/^\[(.*?)\]\s*/);
		if (moodMatch) {
			setMood(moodMatch[1]);
			cleanContent = content.replace(/^\[(.*?)\]\s*/, "");
		} else {
			setMood(null);
		}

		if (role === "assistant" && isLatest) {
			// Typewriter effect
			setDisplayedText("");
			let i = 0;
			const speed = 20; // ms per char
			const interval = setInterval(() => {
				setDisplayedText(cleanContent.slice(0, i + 1));
				i++;
				if (i >= cleanContent.length) clearInterval(interval);
			}, speed);
			return () => clearInterval(interval);
		} else {
			setDisplayedText(cleanContent);
		}
	}, [content, role, isLatest]);

	return (
		<Box>
			{mood && (
				<Typography
					variant="caption"
					sx={{
						display: "inline-block",
						bgcolor: "rgba(255,255,255,0.1)",
						color: "#22d3ee",
						px: 1,
						py: 0.5,
						borderRadius: 1,
						mb: 1,
						fontSize: "0.7rem",
						textTransform: "uppercase",
						letterSpacing: 1,
						fontWeight: "bold",
					}}
				>
					{mood}
				</Typography>
			)}
			<Typography
				component="div"
				variant="body1"
				sx={{
					fontFamily: "Alan Sans",
					fontSize: "1.05rem",
					"& em": {
						color: role === "assistant" ? "#e2e8f0" : "inherit",
					},
					"& strong": {
						color: role === "assistant" ? "#e2e8f0" : "inherit",
					},
					"& p": { m: 0, mb: 1, "&:last-child": { mb: 0 } },
				}}
			>
				<ReactMarkdown>{displayedText}</ReactMarkdown>
			</Typography>
		</Box>
	);
};

export default ChatPage;
