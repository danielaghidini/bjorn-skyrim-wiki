import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	Paper,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Alert,
	CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../api/api";

interface Dialogue {
	id: string;
	topicText: string;
	responseText: string;
	fileName: string;
	audioFileName?: string;
	voiceType?: string;
}

const AdminDialoguesManager: React.FC = () => {
	// Add State
	const [topic, setTopic] = useState("");
	const [response, setResponse] = useState("");
	const [audioFileName, setAudioFileName] = useState("");
	const [addLoading, setAddLoading] = useState(false);
	const [addSuccess, setAddSuccess] = useState<string | null>(null);
	const [addError, setAddError] = useState<string | null>(null);

	// Search State
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState<Dialogue[]>([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);

	// Delete State
	const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // ID being deleted

	const handleAdd = async () => {
		if (!topic || !response || !audioFileName) {
			setAddError(
				"Please fill in all fields (Topic, Response, Audio Name)",
			);
			return;
		}
		setAddLoading(true);
		setAddError(null);
		setAddSuccess(null);

		try {
			await api.post("/api/dialogues", {
				topicText: topic,
				responseText: response,
				audioFileName,
			});
			setAddSuccess("Dialogue added successfully!");
			setTopic("");
			setResponse("");
			setAudioFileName("");
		} catch (err: any) {
			console.error(err);
			setAddError(
				"Failed to add dialogue. " + (err.response?.data?.error || ""),
			);
		} finally {
			setAddLoading(false);
		}
	};

	const handleSearch = async () => {
		if (!searchQuery) return;
		setSearchLoading(true);
		setSearchError(null);
		try {
			const res = await api.get("/api/dialogues", {
				params: { search: searchQuery, limit: 20 },
			});
			setResults(res.data.data);
		} catch (err: any) {
			console.error(err);
			setSearchError("Failed to search dialogues.");
		} finally {
			setSearchLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this dialogue?"))
			return;
		setDeleteLoading(id);
		try {
			await api.delete(`/api/dialogues/${id}`);
			setResults((prev) => prev.filter((d) => d.id !== id));
		} catch (err: any) {
			console.error(err);
			alert("Failed to delete dialogue.");
		} finally {
			setDeleteLoading(null);
		}
	};

	return (
		<Box sx={{ mt: 4 }}>
			<Paper
				sx={{
					p: 3,
					bgcolor: "rgba(21, 25, 33, 0.6)",
					border: "1px solid rgba(79, 195, 247, 0.1)",
					mb: 3,
				}}
			>
				<Typography variant="h6" gutterBottom color="primary">
					Add New Dialogue
				</Typography>
				{addSuccess && (
					<Alert
						severity="success"
						sx={{ mb: 2 }}
						onClose={() => setAddSuccess(null)}
					>
						{addSuccess}
					</Alert>
				)}
				{addError && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
						onClose={() => setAddError(null)}
					>
						{addError}
					</Alert>
				)}
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<TextField
						label="Topic (Player says...)"
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
						fullWidth
						size="small"
					/>
					<TextField
						label="Response (Bjorn says...)"
						value={response}
						onChange={(e) => setResponse(e.target.value)}
						fullWidth
						multiline
						rows={2}
						size="small"
					/>
					<TextField
						label="Audio File Name (e.g. bjorn_hello_01.wav)"
						value={audioFileName}
						onChange={(e) => setAudioFileName(e.target.value)}
						fullWidth
						size="small"
					/>
					<Button
						variant="contained"
						startIcon={
							addLoading ? (
								<CircularProgress size={20} />
							) : (
								<AddIcon />
							)
						}
						onClick={handleAdd}
						disabled={addLoading}
						sx={{ alignSelf: "flex-end" }}
					>
						Add Dialogue
					</Button>
				</Box>
			</Paper>

			<Paper
				sx={{
					p: 3,
					bgcolor: "rgba(21, 25, 33, 0.6)",
					border: "1px solid rgba(79, 195, 247, 0.1)",
				}}
			>
				<Typography variant="h6" gutterBottom color="primary">
					Manage Dialogues
				</Typography>
				<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
					<TextField
						label="Search by topic or response..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						fullWidth
						size="small"
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					/>
					<Button
						variant="outlined"
						onClick={handleSearch}
						disabled={searchLoading}
						startIcon={<SearchIcon />}
					>
						Search
					</Button>
				</Box>

				{searchError && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{searchError}
					</Alert>
				)}

				{results.length > 0 ? (
					<List>
						{results.map((dialogue) => (
							<ListItem
								key={dialogue.id}
								sx={{
									borderBottom:
										"1px solid rgba(255,255,255,0.1)",
									"&:last-child": { borderBottom: "none" },
									flexWrap: "wrap",
								}}
								secondaryAction={
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() =>
											handleDelete(dialogue.id)
										}
										disabled={deleteLoading === dialogue.id}
										color="error"
									>
										{deleteLoading === dialogue.id ? (
											<CircularProgress size={20} />
										) : (
											<DeleteIcon />
										)}
									</IconButton>
								}
							>
								<ListItemText
									primary={
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mb: 0.5 }}
										>
											{dialogue.topicText}
										</Typography>
									}
									secondary={
										<>
											<Typography
												component="span"
												variant="h6"
												color="text.primary"
												display="block"
												sx={{
													mb: 0.5,
													fontWeight: "normal",
												}}
											>
												{dialogue.responseText}
											</Typography>
											<Typography
												component="span"
												variant="caption"
												color="primary.light"
											>
												File:{" "}
												{dialogue.audioFileName ||
													dialogue.fileName}
											</Typography>
										</>
									}
								/>
							</ListItem>
						))}
					</List>
				) : (
					<Typography
						variant="body2"
						color="text.secondary"
						align="center"
					>
						{searchLoading ? "Searching..." : "No results found."}
					</Typography>
				)}
			</Paper>
		</Box>
	);
};

export default AdminDialoguesManager;
