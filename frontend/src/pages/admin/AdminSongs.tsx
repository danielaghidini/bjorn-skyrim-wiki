import { useState, useEffect } from "react";
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
	TextField,
	Button,
	CircularProgress,
	Alert,
} from "@mui/material";
import { Trash2, Plus, Pencil } from "lucide-react";
import api from "../../api/api";

interface Song {
	id: string;
	title: string;
	description: string;
	fileName: string;
}

const AdminSongs = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Form state
	const [editingId, setEditingId] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [fileName, setFileName] = useState("");

	const fetchSongs = async () => {
		try {
			const res = await api.get("/api/songs");
			setSongs(res.data);
		} catch (err) {
			console.error("Fetch songs error:", err);
			setError("Failed to fetch songs");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSongs();
	}, []);

	const handleEdit = (song: Song) => {
		setEditingId(song.id);
		setTitle(song.title);
		setDescription(song.description);
		setFileName(song.fileName);
	};

	const handleCancel = () => {
		setEditingId(null);
		setTitle("");
		setDescription("");
		setFileName("");
	};

	const handleSubmit = async () => {
		if (!title || !description || !fileName) return;

		try {
			if (editingId) {
				await api.put(`/api/admin/songs/${editingId}`, {
					title,
					description,
					fileName,
				});
			} else {
				await api.post("/api/admin/songs", {
					title,
					description,
					fileName,
				});
			}
			fetchSongs();
			handleCancel();
		} catch (err) {
			setError(editingId ? "Error updating song" : "Error creating song");
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this song?"))
			return;
		try {
			await api.delete(`/api/admin/songs/${id}`);
			fetchSongs();
		} catch (err) {
			setError("Error deleting song");
		}
	};

	if (loading) return <CircularProgress />;

	return (
		<Box>
			<Typography variant="h5" sx={{ mb: 3, color: "primary.main" }}>
				Manage Bjorn's Songs
			</Typography>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Paper sx={{ p: 3, mb: 4, bgcolor: "rgba(255,255,255,0.02)" }}>
				<Typography variant="h6" sx={{ mb: 2 }}>
					{editingId ? "Edit Song" : "Add New Song"}
				</Typography>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
					<TextField
						label="Title"
						variant="outlined"
						size="small"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						sx={{ flex: 1, minWidth: "200px" }}
					/>
					<TextField
						label="Description"
						variant="outlined"
						size="small"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						sx={{ flex: 2, minWidth: "300px" }}
					/>
					<TextField
						label="Filename (e.g. song.wav)"
						variant="outlined"
						size="small"
						value={fileName}
						onChange={(e) => setFileName(e.target.value)}
						sx={{ flex: 1, minWidth: "200px" }}
					/>
					<Button
						variant="contained"
						startIcon={!editingId && <Plus size={20} />}
						onClick={handleSubmit}
						disabled={!title || !description || !fileName}
					>
						{editingId ? "Update" : "Add Song"}
					</Button>
					{editingId && (
						<Button variant="outlined" onClick={handleCancel}>
							Cancel
						</Button>
					)}
				</Box>
			</Paper>

			<TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
				<Table>
					<TableHead sx={{ bgcolor: "rgba(255,255,255,0.05)" }}>
						<TableRow>
							<TableCell sx={{ color: "primary.main" }}>
								Title
							</TableCell>
							<TableCell sx={{ color: "primary.main" }}>
								Description
							</TableCell>
							<TableCell sx={{ color: "primary.main" }}>
								Filename
							</TableCell>
							<TableCell
								align="right"
								sx={{ color: "primary.main" }}
							>
								Actions
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{songs.map((song) => (
							<TableRow key={song.id}>
								<TableCell>{song.title}</TableCell>
								<TableCell sx={{ opacity: 0.7 }}>
									{song.description}
								</TableCell>
								<TableCell
									sx={{
										fontFamily: "monospace",
										fontSize: "0.8rem",
									}}
								>
									{song.fileName}
								</TableCell>
								<TableCell align="right">
									<Box
										sx={{
											display: "flex",
											justifyContent: "flex-end",
										}}
									>
										<IconButton
											color="primary"
											onClick={() => handleEdit(song)}
											sx={{ mr: 1 }}
										>
											<Pencil size={18} />
										</IconButton>
										<IconButton
											color="error"
											onClick={() =>
												handleDelete(song.id)
											}
										>
											<Trash2 size={18} />
										</IconButton>
									</Box>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default AdminSongs;
