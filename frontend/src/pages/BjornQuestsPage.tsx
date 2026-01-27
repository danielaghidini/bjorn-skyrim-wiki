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
		<Container maxWidth="lg" sx={{ py: 8 }}>
			<Box sx={{ mb: 6, textAlign: "center" }}>
				<Typography
					variant="h2"
					component="h1"
					gutterBottom
					sx={{
						color: "#ffffff",
						fontFamily: "Bungee",
						mb: 1,
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
						<Typography color="primary.main">
							{selectedQuest.title}
						</Typography>
					</Breadcrumbs>

					<Paper
						sx={{
							p: 4,
							mb: 4,
							backgroundColor: "rgba(0, 0, 0, 0.7)",
						}}
					>
						<Typography
							variant="h3"
							gutterBottom
							color="primary.main"
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
							}}
						>
							<ReactMarkdown>
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
										sx={{ fontFamily: "Bungee" }}
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
													p: 3,
													backgroundColor:
														"rgba(0, 0, 0, 0.4)",
													border: "1px solid rgba(255, 255, 255, 0.05)",
												}}
											>
												<Typography
													variant="h6"
													color="secondary.main"
													gutterBottom
												>
													{step.order}. {step.title}
												</Typography>
												<Typography
													variant="body1"
													color="text.secondary"
													paragraph
												>
													{step.description}
												</Typography>
												{step.videoUrl && (
													<Box
														sx={{
															mt: 2,
															position:
																"relative",
															paddingTop:
																"56.25%", // 16:9 aspect ratio
															width: "100%",
															overflow: "hidden",
															borderRadius: 1,
														}}
													>
														<iframe
															src={step.videoUrl.replace(
																"watch?v=",
																"embed/",
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
									}}
								>
									{section.title}
								</Typography>
								<Box sx={{ display: "grid", gap: 3 }}>
									{sectionQuests.map((quest) => (
										<Paper
											key={quest.id}
											sx={{
												p: 3,
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
												<Box>
													<Typography
														variant="h5"
														color="primary.main"
														gutterBottom
													>
														{quest.title}
													</Typography>
													<Typography
														variant="body1"
														color="text.secondary"
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
