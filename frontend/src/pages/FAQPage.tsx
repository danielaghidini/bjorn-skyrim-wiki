import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CircularProgress,
	Container,
	TextField,
	InputAdornment,
	Button,
	Paper,
} from "@mui/material";
import { ChevronDown, Search, HelpCircle, Send } from "lucide-react";
import api from "../api/api";
import { useAuthStore } from "../store/authStore";

interface FAQ {
	id: string;
	question: string;
	answer: string;
	category: string;
}

const FAQPage: React.FC = () => {
	const [faqs, setFaqs] = useState<FAQ[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [newQuestion, setNewQuestion] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const { user } = useAuthStore();

	const fetchFAQs = async () => {
		try {
			const response = await api.get("/api/faq");
			setFaqs(response.data);
		} catch (error) {
			console.error("Error fetching FAQs:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFAQs();
	}, []);

	const handleSubmitQuestion = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newQuestion.trim()) return;

		setSubmitting(true);
		setFeedback(null);
		try {
			await api.post("/api/faq/submit", { question: newQuestion });
			setFeedback({
				type: "success",
				message:
					"Thank you! Your question has been submitted for review.",
			});
			setNewQuestion("");
		} catch (error) {
			console.error("Error submitting question:", error);
			setFeedback({
				type: "error",
				message: "Failed to submit your question. Please try again.",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const filteredFaqs = faqs.filter(
		(faq) =>
			faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(faq.answer &&
				faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(faq.category &&
				faq.category.toLowerCase().includes(searchTerm.toLowerCase())),
	);

	const categories = [...new Set(faqs.map((faq) => faq.category))].sort();

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Container maxWidth="md" sx={{ py: 8 }}>
			<Box sx={{ textAlign: "center", mb: 8 }}>
				<HelpCircle
					size={48}
					color="#4fc3f7"
					style={{ marginBottom: 16 }}
				/>
				<Typography
					variant="h2"
					sx={{ fontFamily: "Bungee", color: "#fff", mb: 2 }}
				>
					FAQ
				</Typography>
				<Typography
					variant="h6"
					sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}
				>
					Frequently Asked Questions about Bjorn and the Mod
				</Typography>

				<TextField
					fullWidth
					variant="outlined"
					placeholder="Search questions..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					sx={{
						maxWidth: 600,
						backgroundColor: "rgba(255, 255, 255, 0.05)",
						borderRadius: "12px",
						"& .MuiOutlinedInput-root": {
							color: "#fff",
							"& fieldset": {
								borderColor: "rgba(255, 255, 255, 0.1)",
							},
							"&:hover fieldset": { borderColor: "primary.main" },
							"&.Mui-focused fieldset": {
								borderColor: "primary.main",
							},
						},
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Search
									size={20}
									color="rgba(255, 255, 255, 0.5)"
								/>
							</InputAdornment>
						),
					}}
				/>
			</Box>

			{/* Question Submission Form */}
			{user ? (
				<Paper
					sx={{
						p: 4,
						mb: 8,
						backgroundColor: "rgba(79, 195, 247, 0.05)",
						border: "1px solid rgba(79, 195, 247, 0.2)",
						borderRadius: "16px",
					}}
				>
					<Typography
						variant="h5"
						sx={{ color: "#fff", mb: 2, fontFamily: "Bungee" }}
					>
						Can't find what you're looking for?
					</Typography>
					<Typography
						variant="body1"
						sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}
					>
						Ask us directly! Your question will be reviewed and
						answered by our team.
					</Typography>
					<form onSubmit={handleSubmitQuestion}>
						<Box sx={{ display: "flex", gap: 2 }}>
							<TextField
								fullWidth
								variant="outlined"
								placeholder="Type your question here..."
								value={newQuestion}
								onChange={(e) => setNewQuestion(e.target.value)}
								sx={{
									"& .MuiOutlinedInput-root": {
										color: "#fff",
										backgroundColor: "rgba(0,0,0,0.2)",
										"& fieldset": {
											borderColor:
												"rgba(255, 255, 255, 0.1)",
										},
									},
								}}
							/>
							<Button
								type="submit"
								variant="contained"
								disabled={submitting || !newQuestion.trim()}
								startIcon={
									submitting ? (
										<CircularProgress size={20} />
									) : (
										<Send size={18} />
									)
								}
								sx={{ px: 4 }}
							>
								Ask
							</Button>
						</Box>
					</form>
					{feedback && (
						<Typography
							sx={{
								mt: 2,
								color:
									feedback.type === "success"
										? "success.main"
										: "error.main",
								fontSize: "0.9rem",
							}}
						>
							{feedback.message}
						</Typography>
					)}
				</Paper>
			) : (
				<Box
					sx={{
						p: 4,
						mb: 8,
						textAlign: "center",
						backgroundColor: "rgba(255,255,255,0.02)",
						borderRadius: "16px",
						border: "1px dashed rgba(255,255,255,0.1)",
					}}
				>
					<Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
						Want to ask a question? Please login to submit your
						inquiry.
					</Typography>
				</Box>
			)}

			<Box sx={{ mb: 2 }}>
				{categories.map((category) => {
					const catFaqs = filteredFaqs.filter(
						(f) => f.category === category,
					);
					if (catFaqs.length === 0) return null;

					return (
						<Box key={category} sx={{ mb: 6 }}>
							<Typography
								variant="h5"
								sx={{
									color: "primary.main",
									fontFamily: "Bungee",
									mb: 3,
									borderLeft: "4px solid",
									borderColor: "primary.main",
									pl: 2,
								}}
							>
								{category}
							</Typography>

							{catFaqs.map((faq) => (
								<Accordion
									key={faq.id}
									sx={{
										backgroundColor:
											"rgba(21, 25, 33, 0.5)",
										color: "#fff",
										mb: 2,
										borderRadius: "12px !important",
										border: "1px solid rgba(255, 255, 255, 0.05)",
										boxShadow: "none",
										"&:before": { display: "none" },
										"&.Mui-expanded": {
											backgroundColor:
												"rgba(21, 25, 33, 0.8)",
											borderColor:
												"rgba(79, 195, 247, 0.3)",
											margin: "0 0 16px 0",
										},
									}}
								>
									<AccordionSummary
										expandIcon={
											<ChevronDown color="#4fc3f7" />
										}
										sx={{ py: 1 }}
									>
										<Typography
											sx={{
												fontWeight: "bold",
												fontSize: "1.1rem",
											}}
										>
											{faq.question}
										</Typography>
									</AccordionSummary>
									<AccordionDetails
										sx={{ pt: 0, pb: 3, opacity: 0.9 }}
									>
										<Typography
											sx={{
												lineHeight: 1.7,
												whiteSpace: "pre-line",
											}}
										>
											{faq.answer}
										</Typography>
									</AccordionDetails>
								</Accordion>
							))}
						</Box>
					);
				})}
			</Box>

			{filteredFaqs.length === 0 && (
				<Typography
					sx={{
						textAlign: "center",
						color: "rgba(255,255,255,0.5)",
						mt: 4,
					}}
				>
					No results found for your search.
				</Typography>
			)}
		</Container>
	);
};

export default FAQPage;
