import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
	Alert,
	Divider,
} from "@mui/material";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Quest, QuestStep } from "../../types/Quest";
import {
	getQuests,
	getQuestBySlug,
	createQuest,
	updateQuest,
	deleteQuest,
} from "../../services/questService";

const AdminQuestsPage: React.FC = () => {
	const [quests, setQuests] = useState<Quest[]>([]);
	const [open, setOpen] = useState(false);
	const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
	const [formData, setFormData] = useState<Partial<Quest>>({
		title: "",
		slug: "",
		description: "",
		summary: "",
		order: 0,
		category: "Side",
		steps: [],
	});
	const [error, setError] = useState<string | null>(null);

	const fetchQuests = async () => {
		try {
			const data = await getQuests();
			setQuests(data);
		} catch (err) {
			console.error("Failed to fetch quests", err);
			setError("Failed to load quests.");
		}
	};

	useEffect(() => {
		fetchQuests();
	}, []);

	const handleOpen = async (quest?: Quest) => {
		setError(null);
		if (quest) {
			try {
				// Fetch full quest details including steps
				const fullQuest = await getQuestBySlug(quest.slug);
				setEditingQuest(fullQuest);
				setFormData({
					title: fullQuest.title,
					slug: fullQuest.slug,
					description: fullQuest.description,
					summary: fullQuest.summary || "",
					order: fullQuest.order,
					category: fullQuest.category,
					steps: fullQuest.steps || [],
				});
				setOpen(true);
			} catch (err) {
				console.error("Failed to fetch full details", err);
				setError("Failed to load quest details.");
			}
		} else {
			setEditingQuest(null);
			setFormData({
				title: "",
				slug: "",
				description: "",
				summary: "",
				order: quests.length + 1,
				category: "Side",
				steps: [],
			});
			setOpen(true);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setEditingQuest(null);
		setError(null);
	};

	const handleSubmit = async () => {
		try {
			if (editingQuest) {
				await updateQuest(editingQuest.id, formData);
			} else {
				await createQuest(formData);
			}
			fetchQuests();
			handleClose();
		} catch (err) {
			console.error("Failed to save quest", err);
			setError(
				"Failed to save quest. Please check if the slug is unique.",
			);
		}
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this quest?")) {
			try {
				await deleteQuest(id);
				fetchQuests();
			} catch (err) {
				console.error("Failed to delete quest", err);
				setError("Failed to delete quest.");
			}
		}
	};

	const handleAddStep = () => {
		const newStep: QuestStep = {
			id: `temp-${Date.now()}`, // Temp ID
			title: "",
			description: "",
			videoUrl: "",
			order: (formData.steps?.length || 0) + 1,
		};
		setFormData({
			...formData,
			steps: [...(formData.steps || []), newStep],
		});
	};

	const handleRemoveStep = (index: number) => {
		const newSteps = [...(formData.steps || [])];
		newSteps.splice(index, 1);
		setFormData({ ...formData, steps: newSteps });
	};

	const handleStepChange = (
		index: number,
		field: keyof QuestStep,
		value: any,
	) => {
		const newSteps = [...(formData.steps || [])];
		newSteps[index] = { ...newSteps[index], [field]: value };
		setFormData({ ...formData, steps: newSteps });
	};

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box display="flex" justifyContent="space-between" mb={4}>
				<Typography variant="h4" component="h1">
					Manage Quests
				</Typography>
				<Button
					variant="contained"
					startIcon={<Plus size={20} />}
					onClick={() => handleOpen()}
				>
					Add New Quest
				</Button>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Order</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Slug</TableCell>
							<TableCell>Summary</TableCell>
							<TableCell>Type</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{quests.map((quest) => (
							<TableRow key={quest.id}>
								<TableCell>{quest.order}</TableCell>
								<TableCell>{quest.title}</TableCell>
								<TableCell>{quest.slug}</TableCell>
								<TableCell>
									{quest.summary
										? quest.summary.substring(0, 50) + "..."
										: "-"}
								</TableCell>
								<TableCell>{quest.category}</TableCell>
								<TableCell align="right">
									<IconButton
										color="primary"
										onClick={() => handleOpen(quest)}
									>
										<Pencil size={20} />
									</IconButton>
									<IconButton
										color="error"
										onClick={() => handleDelete(quest.id)}
									>
										<Trash2 size={20} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
				<DialogTitle>
					{editingQuest ? "Edit Quest" : "Add New Quest"}
				</DialogTitle>
				<DialogContent>
					<Box display="flex" flexDirection="column" gap={2} mt={1}>
						<Box display="flex" gap={2}>
							<TextField
								label="Order"
								type="number"
								value={formData.order}
								onChange={(e) =>
									setFormData({
										...formData,
										order: parseInt(e.target.value),
									})
								}
								sx={{ width: 100 }}
							/>
							<TextField
								select
								label="Category"
								fullWidth
								value={formData.category || "Side"}
								onChange={(e) =>
									setFormData({
										...formData,
										category: e.target.value,
									})
								}
								SelectProps={{
									native: true,
								}}
							>
								<option value="Main">Main Quest</option>
								<option value="Side">Side Quest</option>
								<option value="Other">Other</option>
							</TextField>
						</Box>
						<TextField
							label="Title"
							fullWidth
							value={formData.title}
							onChange={(e) =>
								setFormData({
									...formData,
									title: e.target.value,
								})
							}
						/>
						<TextField
							label="Slug"
							fullWidth
							value={formData.slug}
							onChange={(e) =>
								setFormData({
									...formData,
									slug: e.target.value,
								})
							}
							helperText="Unique identifier for URL (e.g., past-shadows)"
						/>
						<TextField
							label="Short Summary (Index)"
							fullWidth
							multiline
							rows={2}
							value={formData.summary}
							onChange={(e) =>
								setFormData({
									...formData,
									summary: e.target.value,
								})
							}
							helperText="Appears on the main quests page index (2-3 lines)."
						/>
						<TextField
							label="Introduction (Lore)"
							fullWidth
							multiline
							rows={4}
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
							helperText="Explain the quest lore and background (Markdown supported)"
						/>

						<Divider sx={{ my: 2 }} />
						<Typography variant="h6">
							Quest Steps (Videos)
						</Typography>
						{formData.steps?.map((step, index) => (
							<Paper
								key={step.id || index}
								variant="outlined"
								sx={{
									p: 2,
									display: "flex",
									flexDirection: "column",
									gap: 2,
								}}
							>
								<Box
									display="flex"
									justifyContent="space-between"
									alignItems="center"
								>
									<Typography variant="subtitle2">
										Step {index + 1}
									</Typography>
									<IconButton
										color="error"
										size="small"
										onClick={() => handleRemoveStep(index)}
									>
										<X size={16} />
									</IconButton>
								</Box>
								<TextField
									label="Step Title"
									size="small"
									fullWidth
									value={step.title}
									onChange={(e) =>
										handleStepChange(
											index,
											"title",
											e.target.value,
										)
									}
								/>
								<TextField
									label="Step Description"
									size="small"
									fullWidth
									multiline
									rows={2}
									value={step.description}
									onChange={(e) =>
										handleStepChange(
											index,
											"description",
											e.target.value,
										)
									}
								/>
								<TextField
									label="Video URL (YouTube)"
									size="small"
									fullWidth
									value={step.videoUrl || ""}
									onChange={(e) =>
										handleStepChange(
											index,
											"videoUrl",
											e.target.value,
										)
									}
									helperText="e.g., https://www.youtube.com/watch?v=..."
								/>
							</Paper>
						))}
						<Button
							variant="outlined"
							startIcon={<Plus size={16} />}
							onClick={handleAddStep}
						>
							Add Quest Step
						</Button>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} startIcon={<X size={18} />}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						variant="contained"
						startIcon={<Plus size={18} />}
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default AdminQuestsPage;
