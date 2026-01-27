import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Terminal, User } from "lucide-react";
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
} from "@mui/material";

// Import local image
import bjornPortrait from "../assets/bjorn_portrait.png";

interface Message {
	role: "user" | "assistant";
	content: string;
}

const ChatPage: React.FC = () => {
	// Initialize with the Greeting
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "assistant",
			content:
				"*The air inside Whitewatch Tower is thick with smoke and the stench of blood. You cut down one of the last bandits just as a tall Nord buries his sword into another’s chest. The final scream dies out, leaving only the crackle of burning wood and the labored breath of the surviving guards.*\n\n*The Nord wipes his blade clean, gives you a quick once-over, then smiles — a crooked, mead-warmed grin that doesn’t match the carnage around you.*",
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	const handleSendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage: Message = { role: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			// Determine API URL: Use env var in prod, or relative path in dev (to use proxy)
			const baseUrl = import.meta.env.VITE_API_ORIGIN || "";
			const apiUrl = `${baseUrl}/api/chat`;

			const response = await fetch(apiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: userMessage.content,
					history: messages.map((m) => ({
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
		} catch (error: any) {
			console.error("Chat error:", error);
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: `(Connection error: ${error.message || "Unknown error"}. Ensure backend is running.)`,
				},
			]);
		} finally {
			setIsLoading(false);
		}
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
					p: 2,
					zIndex: 10,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
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

				<Stack alignItems="center">
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
							color: "grey.500",
							textTransform: "uppercase",
							letterSpacing: 1,
							fontSize: "0.65rem",
							maxWidth: "300px",
							textAlign: "center",
							mb: 1,
						}}
					>
						This chatbot responds based on content created by the
						author, but may not be fully accurate.
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

				<Box sx={{ width: 40 }} />
			</Box>

			{/* Chat Area Container */}
			<Container
				maxWidth="md"
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					zIndex: 10,
					position: "relative",
					overflow: "hidden",
					pb: 2,
				}}
			>
				<Paper
					elevation={4}
					sx={{
						flex: 1,
						bgcolor: "rgba(10, 13, 20, 0.6)",
						backdropFilter: "blur(12px)",
						border: "1px solid rgba(255, 255, 255, 0.08)",
						borderRadius: 4,
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						mb: 2,
					}}
				>
					{/* Scrollable Messages */}
					<Box
						sx={{
							flex: 1,
							overflowY: "auto",
							p: 4,
							display: "flex",
							flexDirection: "column",
							gap: 3,
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
													p: 2.5,
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
															? "grey.200"
															: "black",
													border:
														msg.role === "assistant"
															? "1px solid rgba(255,255,255,0.1)"
															: "none",
													lineHeight: 1.6,
												}}
											>
												<Typography
													variant="body1"
													sx={{
														fontFamily: "Alan Sans",
														fontSize: "1.05rem",
														whiteSpace: "pre-wrap",
													}}
												>
													{msg.role ===
													"assistant" ? (
														<span
															style={{
																fontStyle:
																	"italic",
																opacity: 0.9,
															}}
														>
															{msg.content}
														</span>
													) : (
														msg.content
													)}
												</Typography>
											</Paper>
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
									<Typography
										variant="caption"
										sx={{ color: "grey.500" }}
									>
										Bjorn is writing...
									</Typography>
								</Paper>
							</Stack>
						)}
						<div ref={messagesEndRef} />
					</Box>

					{/* Input Area */}
					<Box
						sx={{
							p: 2,
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
								color: "grey.600",
								letterSpacing: 1,
								fontSize: "0.7rem",
								textTransform: "uppercase",
							}}
						>
							NVIDIA NIM Powered • Llama 3.1 70B • Roleplay Mode
						</Typography>
						<Typography
							variant="caption"
							sx={{
								display: "block",
								textAlign: "center",
								mt: 0.5,
								color: "grey.700",
								fontSize: "0.65rem",
								opacity: 0.7,
								maxWidth: "400px",
								mx: "auto",
							}}
						>
							This chatbot responds based on content created by
							the author, but may not be fully accurate.
						</Typography>
					</Box>
				</Paper>
			</Container>
		</Box>
	);
};

export default ChatPage;
