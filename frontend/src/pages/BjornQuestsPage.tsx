import React, { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Box,
	Paper,
	Divider,
	Button,
	Breadcrumbs,
	Link,
} from "@mui/material";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Quest } from "../types/Quest";
import { getQuests, getQuestBySlug } from "../services/questService";
import SEO from "../components/common/SEO";

// Convert various YouTube URL formats to embed URL
const getYouTubeEmbedUrl = (url: string): string => {
	let videoId = "";
	if (url.includes("youtu.be/")) {
		videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0] || "";
	} else if (url.includes("watch?v=")) {
		videoId = url.split("watch?v=")[1]?.split(/[?&]/)[0] || "";
	} else if (url.includes("embed/")) {
		videoId = url.split("embed/")[1]?.split(/[?&]/)[0] || "";
	}
	return videoId
		? `https://www.youtube.com/embed/${videoId}?vq=hd1080&modestbranding=1&rel=0&showinfo=0&controls=1`
		: url;
};

const BjornQuestsPage: React.FC = () => {
	const [quests, setQuests] = useState<Quest[]>([]);
	const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

	useEffect(() => {
		const fetchQuests = async () => {
			try {
				const data = await getQuests();
				setQuests(data);
			} catch (error) {
				console.error("Failed to fetch quests", error);
			}
		};
		fetchQuests();
	}, []);

	return (
		<Container
			maxWidth="lg"
			sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 1, sm: 2, md: 3 } }}
		>
			<SEO
				title={selectedQuest ? selectedQuest.title : "Quests"}
				description={
					selectedQuest
						? selectedQuest.summary ||
							selectedQuest.description.substring(0, 160)
						: "Complete guide for all Bjorn's quests, including his personal arc and redemption story."
				}
			/>
			<Box sx={{ mb: 6, textAlign: "center" }}>
				<Typography
					variant="h2"
					component="h1"
					gutterBottom
					sx={{
						color: "#ffffff",
						fontFamily: "Bungee",
						mb: 1,
						wordBreak: "break-word",
						fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
					}}
				>
					Bjorn's Quests
				</Typography>
				<Typography
					variant="h5"
					gutterBottom
					sx={{
						fontFamily: "Alan Sans",
						color: "primary.main",
						mb: 6,
						maxWidth: "80%",
						mx: "auto",
						fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
					}}
				>
					"Let's move. Before the day gets old and our blades get
					bored."
				</Typography>
			</Box>

			{selectedQuest ? (
				<Box>
					<Breadcrumbs
						aria-label="breadcrumb"
						sx={{ mb: 4, color: "white" }}
					>
						<Link
							underline="hover"
							color="inherit"
							component="button"
							onClick={() => setSelectedQuest(null)}
						>
							Quests Index
						</Link>
						<Typography
							color="primary.main"
							sx={{ wordBreak: "break-word" }}
						>
							{selectedQuest.title}
						</Typography>
					</Breadcrumbs>

					<Paper
						sx={{
							p: { xs: 0, sm: 3, md: 4 },
							mb: 4,
							backgroundColor: {
								xs: "transparent",
								sm: "rgba(0, 0, 0, 0.7)",
							},
							boxShadow: { xs: "none", sm: 1 },
							border: { xs: "none", sm: undefined },
						}}
					>
						<Typography
							variant="h3"
							gutterBottom
							color="primary.main"
							sx={{
								wordBreak: "break-word",
								fontSize: {
									xs: "1.5rem",
									sm: "2rem",
									md: "2.5rem",
								},
							}}
						>
							{selectedQuest.title}
						</Typography>
						{selectedQuest.difficulty && (
							<Typography
								variant="subtitle1"
								color="text.secondary"
								gutterBottom
							>
								<strong>Difficulty:</strong>{" "}
								{selectedQuest.difficulty}
							</Typography>
						)}
						{selectedQuest.rewards && (
							<Typography
								variant="subtitle1"
								color="text.secondary"
								gutterBottom
							>
								<strong>Rewards:</strong>{" "}
								{selectedQuest.rewards}
							</Typography>
						)}
						<Divider
							sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }}
						/>
						<Box
							sx={{
								"& p": { mb: 2, lineHeight: 1.6 },
								"& h1, & h2, & h3": {
									color: "primary.main",
									mt: 3,
									mb: 2,
								},
								"& ul, & ol": { pl: 4, mb: 2 },
								"& li": { mb: 1 },
								"& blockquote": {
									borderLeft: "4px solid #ccc",
									pl: 2,
									fontStyle: "italic",
									opacity: 0.8,
								},
								"& a": {
									color: "primary.main",
									textDecoration: "underline",
								},
							}}
						>
							<ReactMarkdown
								components={{
									a: ({ ...props }) => (
										<a
											{...props}
											target="_blank"
											rel="noopener noreferrer"
										/>
									),
								}}
							>
								{selectedQuest.description}
							</ReactMarkdown>
						</Box>

						{selectedQuest.steps &&
							selectedQuest.steps.length > 0 && (
								<Box sx={{ mt: 6 }}>
									<Typography
										variant="h4"
										color="primary.main"
										gutterBottom
										sx={{
											fontFamily: "Bungee",
											fontSize: {
												xs: "1.25rem",
												sm: "1.5rem",
												md: "2rem",
											},
											wordBreak: "break-word",
										}}
									>
										Quest Steps
									</Typography>
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											gap: 4,
										}}
									>
										{selectedQuest.steps.map((step) => (
											<Paper
												key={step.id}
												sx={{
													p: { xs: 2, sm: 3 },
													backgroundColor:
														"rgba(0, 0, 0, 0.4)",
													border: "1px solid rgba(255, 255, 255, 0.05)",
												}}
											>
												<Typography
													variant="h6"
													color="secondary.main"
													gutterBottom
													sx={{
														wordBreak: "break-word",
													}}
												>
													{step.order}. {step.title}
												</Typography>
												<Box
													sx={{
														color: "text.secondary",
														"& p": {
															mb: 1,
															lineHeight: 1.6,
														},
														"& a": {
															color: "primary.main",
															textDecoration:
																"underline",
														},
														"& ul, & ol": {
															pl: 3,
															mb: 1,
														},
														"& li": { mb: 0.5 },
													}}
												>
													<ReactMarkdown
														components={{
															a: ({
																...props
															}) => (
																<a
																	{...props}
																	target="_blank"
																	rel="noopener noreferrer"
																/>
															),
														}}
													>
														{step.description}
													</ReactMarkdown>
												</Box>
												{step.videoUrl && (
													<Box
														sx={{
															maxWidth: "720px",
															mx: "auto",
															my: 5,
															width: "100%",
														}}
													>
														<Box
															sx={{
																position:
																	"relative",
																paddingTop:
																	"56.25%",
																width: "100%",
																overflow:
																	"hidden",
																borderRadius: 1,
															}}
														>
															<iframe
																src={getYouTubeEmbedUrl(
																	step.videoUrl,
																)}
																title={`Video for ${step.title}`}
																allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
																allowFullScreen
																style={{
																	position:
																		"absolute",
																	top: 0,
																	left: 0,
																	width: "100%",
																	height: "100%",
																	border: 0,
																}}
															/>
														</Box>
													</Box>
												)}
											</Paper>
										))}
									</Box>
								</Box>
							)}
						<Button
							variant="outlined"
							onClick={() => setSelectedQuest(null)}
							sx={{ mt: 4 }}
						>
							Back to Index
						</Button>
					</Paper>
				</Box>
			) : (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
					{[
						{ title: "Main Quests", type: "Main" },
						{ title: "Other Quests", type: "Other" },
						{ title: "Side Quests", type: "Side" },
					].map((section) => {
						const sectionQuests = quests.filter(
							(q) =>
								(q.category || "Side") === section.type ||
								(section.type === "Other" &&
									!["Main", "Side"].includes(
										q.category || "Side",
									)),
						);

						if (sectionQuests.length === 0) return null;

						return (
							<Box key={section.type}>
								<Typography
									variant="h4"
									sx={{
										color: "primary.main",
										fontFamily: "Bungee",
										mb: 3,
										borderBottom:
											"2px solid rgba(255,255,255,0.1)",
										pb: 1,
										fontSize: {
											xs: "1.25rem",
											sm: "1.5rem",
											md: "2rem",
										},
										wordBreak: "break-word",
									}}
								>
									{section.title}
								</Typography>
								<Box sx={{ display: "grid", gap: 3 }}>
									{sectionQuests.map((quest) => (
										<Paper
											key={quest.id}
											sx={{
												p: { xs: 2, sm: 3 },
												backgroundColor:
													"rgba(0, 0, 0, 0.6)",
												border: "1px solid rgba(255, 255, 255, 0.1)",
												cursor: "pointer",
												transition:
													"transform 0.2s, background-color 0.2s",
												"&:hover": {
													transform:
														"translateY(-2px)",
													backgroundColor:
														"rgba(0, 0, 0, 0.7)",
													borderColor: "primary.main",
												},
											}}
											onClick={async () => {
												try {
													const fullQuest =
														await getQuestBySlug(
															quest.slug,
														);
													setSelectedQuest(fullQuest);
												} catch (error) {
													console.error(
														"Failed to fetch quest details",
														error,
													);
													setSelectedQuest(quest);
												}
											}}
										>
											<Box
												display="flex"
												justifyContent="space-between"
												alignItems="center"
											>
												<Box
													sx={{
														minWidth: 0,
														flex: 1,
													}}
												>
													<Typography
														variant="h5"
														color="primary.main"
														gutterBottom
														sx={{
															wordBreak:
																"break-word",
															fontSize: {
																xs: "1rem",
																sm: "1.25rem",
																md: "1.5rem",
															},
														}}
													>
														{quest.title}
													</Typography>
													<Typography
														variant="body1"
														color="text.secondary"
														sx={{
															wordBreak:
																"break-word",
														}}
													>
														{quest.summary ||
															quest.description.substring(
																0,
																150,
															) + "..."}
													</Typography>
												</Box>
												<ChevronRight color="#aaa" />
											</Box>
										</Paper>
									))}
								</Box>
							</Box>
						);
					})}
				</Box>
			)}
		</Container>
	);
};

export default BjornQuestsPage;
