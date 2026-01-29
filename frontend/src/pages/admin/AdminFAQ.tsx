import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	CircularProgress,
	Chip,
	MenuItem,
	Tooltip,
} from "@mui/material";
import { Plus, Edit2, Trash2, HelpCircle, User } from "lucide-react";
import api from "../../api/api";

interface FAQ {
	id: string;
	question: string;
	answer: string | null;
	category: string;
	order: number;
	status: "PUBLISHED" | "PENDING";
	author?: {
		name: string | null;
		email: string;
	};
}

const FAQ_CATEGORIES = [
	"General",
	"Quests",
	"Installation",
	"Compatibility",
	"Lore",
	"Romance",
	"Technical",
];

const AdminFAQ: React.FC = () => {
	const [faqs, setFaqs] = useState<FAQ[]>([]);
	const [loading, setLoading] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [currentFaq, setCurrentFaq] = useState<Partial<FAQ>>({
		question: "",
		answer: "",
		category: FAQ_CATEGORIES[0],
		order: 0,
		status: "PUBLISHED",
	});
	const [isEditing, setIsEditing] = useState(false);

	const fetchFAQs = async () => {
		try {
			const response = await api.get("/api/admin/faq");
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

	const handleOpenDialog = (faq?: FAQ) => {
		if (faq) {
			setCurrentFaq(faq);
			setIsEditing(true);
		} else {
			setCurrentFaq({
				question: "",
				answer: "",
				category: "Geral",
				order: faqs.length,
				status: "PUBLISHED",
			});
			setIsEditing(false);
		}
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleSave = async () => {
		try {
			// Ensure answer is empty string if null for the form, but if saving we can send null
			const dataToSave = {
				...currentFaq,
				answer: currentFaq.answer || "",
			};

			if (isEditing && currentFaq.id) {
				await api.put(`/api/admin/faq/${currentFaq.id}`, dataToSave);
			} else {
				await api.post("/api/admin/faq", dataToSave);
			}
			fetchFAQs();
			handleCloseDialog();
		} catch (error) {
			console.error("Error saving FAQ:", error);
			alert("Error saving FAQ");
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this FAQ?"))
			return;
		try {
			await api.delete(`/api/admin/faq/${id}`);
			fetchFAQs();
		} catch (error) {
			console.error("Error deleting FAQ:", error);
			alert("Error deleting FAQ");
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<HelpCircle size={32} color="#4fc3f7" />
					<Box>
						<Typography
							variant="h4"
							sx={{ color: "#fff", fontFamily: "Bungee" }}
						>
							Manage FAQ
						</Typography>
						<Typography variant="body2" sx={{ opacity: 0.6 }}>
							Total: {faqs.length} questions (
							{faqs.filter((f) => f.status === "PENDING").length}{" "}
							pending)
						</Typography>
					</Box>
				</Box>
				<Button
					variant="contained"
					startIcon={<Plus size={18} />}
					onClick={() => handleOpenDialog()}
					sx={{ borderRadius: "8px" }}
				>
					New FAQ
				</Button>
			</Box>

			<TableContainer
				component={Paper}
				sx={{
					bgcolor: "rgba(21, 25, 33, 0.5)",
					borderRadius: "16px",
					border: "1px solid rgba(255, 255, 255, 0.05)",
					boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
				}}
			>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: "rgba(79, 195, 247, 0.05)" }}>
							<TableCell
								sx={{
									color: "primary.main",
									fontWeight: "bold",
									width: 80,
								}}
							>
								Order
							</TableCell>
							<TableCell
								sx={{
									color: "primary.main",
									fontWeight: "bold",
									width: 120,
								}}
							>
								Status
							</TableCell>
							<TableCell
								sx={{
									color: "primary.main",
									fontWeight: "bold",
									width: 150,
								}}
							>
								Category
							</TableCell>
							<TableCell
								sx={{
									color: "primary.main",
									fontWeight: "bold",
								}}
							>
								Question
							</TableCell>
							<TableCell
								sx={{
									color: "primary.main",
									fontWeight: "bold",
									width: 150,
								}}
							>
								Submitted By
							</TableCell>
							<TableCell
								align="right"
								sx={{
									color: "primary.main",
									fontWeight: "bold",
									width: 120,
								}}
							>
								Actions
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{faqs.map((faq) => (
							<TableRow
								key={faq.id}
								sx={{
									"&:hover": {
										bgcolor: "rgba(255,255,255,0.02)",
									},
									opacity: faq.status === "PENDING" ? 0.8 : 1,
									bgcolor:
										faq.status === "PENDING"
											? "rgba(255, 152, 0, 0.05)"
											: "inherit",
								}}
							>
								<TableCell sx={{ color: "#fff" }}>
									{faq.order}
								</TableCell>
								<TableCell>
									<Chip
										label={faq.status}
										size="small"
										color={
											faq.status === "PUBLISHED"
												? "success"
												: "warning"
										}
										variant="outlined"
										sx={{ fontWeight: "bold" }}
									/>
								</TableCell>
								<TableCell sx={{ color: "#fff" }}>
									{faq.category || "—"}
								</TableCell>
								<TableCell sx={{ color: "#fff" }}>
									{faq.question}
								</TableCell>
								<TableCell sx={{ color: "#fff" }}>
									{faq.author ? (
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}
										>
											<User size={14} color="#4fc3f7" />
											<Typography variant="body2">
												{faq.author.name ||
													faq.author.email.split(
														"@",
													)[0]}
											</Typography>
										</Box>
									) : (
										<Typography
											variant="body2"
											sx={{ opacity: 0.4 }}
										>
											Admin
										</Typography>
									)}
								</TableCell>
								<TableCell align="right">
									<Tooltip title="Edit / Answer">
										<IconButton
											onClick={() =>
												handleOpenDialog(faq)
											}
											sx={{ color: "primary.main" }}
										>
											<Edit2 size={18} />
										</IconButton>
									</Tooltip>
									<IconButton
										onClick={() => handleDelete(faq.id)}
										sx={{
											color: "error.main",
											"&:hover": {
												bgcolor:
													"rgba(211, 47, 47, 0.1)",
											},
										}}
									>
										<Trash2 size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				fullWidth
				maxWidth="sm"
				PaperProps={{
					sx: {
						bgcolor: "#1a1f26",
						backgroundImage: "none",
						borderRadius: "16px",
						border: "1px solid rgba(255,255,255,0.1)",
					},
				}}
			>
				<DialogTitle sx={{ color: "#fff", fontFamily: "Bungee" }}>
					{isEditing ? "Edit / Answer FAQ" : "New FAQ"}
				</DialogTitle>
				<DialogContent>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 3,
							pt: 2,
						}}
					>
						<TextField
							label="Status"
							select
							fullWidth
							value={currentFaq.status}
							onChange={(e) =>
								setCurrentFaq({
									...currentFaq,
									status: e.target.value as FAQ["status"],
								})
							}
							variant="outlined"
							sx={{
								"& .MuiOutlinedInput-root": { color: "#fff" },
								"& .MuiInputLabel-root": {
									color: "rgba(255,255,255,0.7)",
								},
							}}
						>
							<MenuItem value="PUBLISHED">Published</MenuItem>
							<MenuItem value="PENDING">Pending (Draft)</MenuItem>
						</TextField>

						<TextField
							label="Question"
							fullWidth
							multiline
							value={currentFaq.question}
							onChange={(e) =>
								setCurrentFaq({
									...currentFaq,
									question: e.target.value,
								})
							}
							variant="outlined"
							sx={{
								"& .MuiOutlinedInput-root": { color: "#fff" },
								"& .MuiInputLabel-root": {
									color: "rgba(255,255,255,0.7)",
								},
							}}
						/>
						<TextField
							label="Answer"
							fullWidth
							multiline
							rows={4}
							value={currentFaq.answer || ""}
							onChange={(e) =>
								setCurrentFaq({
									...currentFaq,
									answer: e.target.value,
								})
							}
							variant="outlined"
							placeholder="Write the answer here..."
							sx={{
								"& .MuiOutlinedInput-root": { color: "#fff" },
								"& .MuiInputLabel-root": {
									color: "rgba(255,255,255,0.7)",
								},
							}}
						/>
						<Box sx={{ display: "flex", gap: 2 }}>
							<TextField
								label="Category"
								select
								fullWidth
								value={currentFaq.category}
								onChange={(e) =>
									setCurrentFaq({
										...currentFaq,
										category: e.target.value,
									})
								}
								variant="outlined"
								sx={{
									"& .MuiOutlinedInput-root": {
										color: "#fff",
									},
									"& .MuiInputLabel-root": {
										color: "rgba(255,255,255,0.7)",
									},
								}}
							>
								{FAQ_CATEGORIES.map((cat) => (
									<MenuItem key={cat} value={cat}>
										{cat}
									</MenuItem>
								))}
							</TextField>
							<TextField
								label="Order"
								type="number"
								value={currentFaq.order}
								onChange={(e) =>
									setCurrentFaq({
										...currentFaq,
										order: parseInt(e.target.value) || 0,
									})
								}
								variant="outlined"
								sx={{
									width: 100,
									"& .MuiOutlinedInput-root": {
										color: "#fff",
									},
									"& .MuiInputLabel-root": {
										color: "rgba(255,255,255,0.7)",
									},
								}}
							/>
						</Box>
					</Box>
				</DialogContent>
				<DialogActions sx={{ p: 3 }}>
					<Button
						onClick={handleCloseDialog}
						sx={{ color: "rgba(255,255,255,0.7)" }}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} variant="contained">
						Save & Publish
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default AdminFAQ;
