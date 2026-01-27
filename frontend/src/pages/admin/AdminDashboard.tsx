import { useState, useEffect } from "react";
import {
	Box,
	Container,
	Typography,
	Tab,
	Tabs,
	Button,
	List,
	ListItem,
	ListItemText,
	IconButton,
	TextField,
	Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../config/apiConfig";
import AdminQuestsPage from "./AdminQuestsPage";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

const AdminDashboard = () => {
	const [value, setValue] = useState(0);
	const [articles, setArticles] = useState<any[]>([]);
	const [fanArts, setFanArts] = useState<any[]>([]);
	const { token, user, logout } = useAuthStore();
	const isAdmin = user?.role === "ADMIN";

	// Form states
	const [newItemTitle, setNewItemTitle] = useState("");
	const [newImageUrl, setNewImageUrl] = useState("");
	const [newArtistName, setNewArtistName] = useState("");

	const fetchContent = async () => {
		try {
			const resArticles = await axios.get(`${API_URL}/api/articles`);
			const resFanArt = await axios.get(`${API_URL}/api/fan-art`);
			setArticles(resArticles.data);
			setFanArts(resFanArt.data);
		} catch (error) {
			console.error("Fetch error:", error);
		}
	};

	useEffect(() => {
		fetchContent();
	}, [API_URL]);

	const handleCreate = async () => {
		if (!newItemTitle) return;
		try {
			let endpoint = "";
			let payload = {};

			switch (value) {
				case 0:
					endpoint = "/articles";
					payload = {
						title: newItemTitle,
						slug: newItemTitle.toLowerCase().replace(/ /g, "-"),
						content: "Draft content",
						categoryId: "default",
					};
					break;
				case 1:
					endpoint = "/quests";
					payload = {
						title: newItemTitle,
						slug: newItemTitle.toLowerCase().replace(/ /g, "-"),
						description: "Draft description",
					};
					break;
				case 2:
					endpoint = "/fan-art";
					payload = {
						title: newItemTitle,
						imageUrl: newImageUrl,
						artistName: newArtistName,
						description: "Community Art",
					};
					break;
			}

			await axios.post(`${API_URL}${endpoint}`, payload, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setNewItemTitle("");
			setNewImageUrl("");
			setNewArtistName("");
			fetchContent();
		} catch (error) {
			alert("Error creating item");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			let endpoint = "";
			switch (value) {
				case 0:
					endpoint = "/articles";
					break;
				case 1:
					endpoint = "/quests";
					break;
				case 2:
					endpoint = "/fan-art";
					break;
			}
			await axios.delete(`${API_URL}${endpoint}/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			fetchContent();
		} catch (error) {
			alert("Error deleting item");
		}
	};

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const canManage = (item: any) => {
		return user?.role === "ADMIN" || item.authorId === user?.id;
	};

	return (
		<Container maxWidth="lg" sx={{ py: 8 }}>
			<Typography
				variant="h2"
				component="h1"
				gutterBottom
				sx={{
					fontFamily: "Bungee",
					color: "#ffffff",
					mb: 1,
					textAlign: "center",
				}}
			>
				{user?.role === "ADMIN" ? "Admin Dashboard" : "My Dashboard"}
			</Typography>
			<Typography
				variant="h6"
				gutterBottom
				sx={{
					fontFamily: "Alan Sans",
					color: "primary.main",
					mb: 4,
					textAlign: "center",
				}}
			>
				Manage the Wiki's content and destiny
			</Typography>

			<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
				<Button variant="outlined" onClick={logout}>
					Logout
				</Button>
			</Box>

			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="admin tabs"
				>
					<Tab label="Articles" />
					{isAdmin && <Tab label="Quests" />}
					<Tab label="Fan Art" />
				</Tabs>
			</Box>

			{
				/* Simple Create Form - Hidden for Quests as it has its own manager */
				!(isAdmin && value === 1) && (
					<Paper
						sx={{
							p: 2,
							mt: 2,
							display: "flex",
							flexDirection: "column",
							gap: 2,
						}}
					>
						<Box sx={{ display: "flex", gap: 2 }}>
							<TextField
								label="New Title"
								variant="outlined"
								size="small"
								fullWidth
								value={newItemTitle}
								onChange={(e) =>
									setNewItemTitle(e.target.value)
								}
							/>
							{(isAdmin ? value === 2 : value === 1) && (
								<>
									<TextField
										label="Image URL"
										variant="outlined"
										size="small"
										fullWidth
										value={newImageUrl}
										onChange={(e) =>
											setNewImageUrl(e.target.value)
										}
									/>
									<TextField
										label="Artist Name"
										variant="outlined"
										size="small"
										fullWidth
										value={newArtistName}
										onChange={(e) =>
											setNewArtistName(e.target.value)
										}
									/>
								</>
							)}
							<Button
								variant="contained"
								onClick={handleCreate}
								sx={{ minWidth: 100 }}
							>
								Create
							</Button>
						</Box>
					</Paper>
				)
			}

			<CustomTabPanel value={value} index={0}>
				<List>
					{articles.length === 0 && (
						<Typography sx={{ p: 2, opacity: 0.5 }}>
							No articles found.
						</Typography>
					)}
					{articles.map((article: any) => (
						<ListItem
							key={article.id}
							secondaryAction={
								canManage(article) && (
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() => handleDelete(article.id)}
									>
										<DeleteIcon />
									</IconButton>
								)
							}
						>
							<ListItemText
								primary={article.title}
								secondary={article.slug}
							/>
						</ListItem>
					))}
				</List>
			</CustomTabPanel>
			{isAdmin && (
				<CustomTabPanel value={value} index={1}>
					<AdminQuestsPage />
				</CustomTabPanel>
			)}
			<CustomTabPanel value={value} index={isAdmin ? 2 : 1}>
				<List>
					{fanArts.length === 0 && (
						<Typography sx={{ p: 2, opacity: 0.5 }}>
							No Fan Art found.
						</Typography>
					)}
					{fanArts.map((art: any) => (
						<ListItem
							key={art.id}
							secondaryAction={
								canManage(art) && (
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() => handleDelete(art.id)}
									>
										<DeleteIcon />
									</IconButton>
								)
							}
						>
							<ListItemText
								primary={art.title}
								secondary={`By: ${art.artistName}`}
							/>
						</ListItem>
					))}
				</List>
			</CustomTabPanel>
		</Container>
	);
};

export default AdminDashboard;
