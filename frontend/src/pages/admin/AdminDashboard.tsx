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
	const [quests, setQuests] = useState<any[]>([]);
	const { token, user, logout } = useAuthStore();

	// Form states
	const [newItemTitle, setNewItemTitle] = useState("");

	const fetchContent = async () => {
		try {
			const resArticles = await axios.get(`${API_URL}/api/articles`);
			const resQuests = await axios.get(`${API_URL}/api/quests`);
			setArticles(resArticles.data);
			setQuests(resQuests.data);
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
			const endpoint = value === 0 ? "/articles" : "/quests";
			const payload =
				value === 0
					? {
							title: newItemTitle,
							slug: newItemTitle.toLowerCase().replace(/ /g, "-"),
							content: "Draft content",
							categoryId: "default",
						} // Simplified
					: {
							title: newItemTitle,
							slug: newItemTitle.toLowerCase().replace(/ /g, "-"),
							description: "Draft description",
						};

			await axios.post(`${API_URL}${endpoint}`, payload, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setNewItemTitle("");
			fetchContent();
		} catch (error) {
			alert("Error creating item");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const endpoint = value === 0 ? "/articles" : "/quests";
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
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box
				sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
			>
				<Typography variant="h4">
					{user?.role === "ADMIN"
						? "Admin Dashboard"
						: "My Dashboard"}
				</Typography>
				<Button variant="outlined" onClick={logout}>
					Logout
				</Button>
			</Box>

			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab label="Articles" />
					<Tab label="Quests" />
				</Tabs>
			</Box>

			{/* Simple Create Form */}
			<Paper sx={{ p: 2, mt: 2, display: "flex", gap: 2 }}>
				<TextField
					label="New Title"
					variant="outlined"
					size="small"
					fullWidth
					value={newItemTitle}
					onChange={(e) => setNewItemTitle(e.target.value)}
				/>
				<Button variant="contained" onClick={handleCreate}>
					Create
				</Button>
			</Paper>

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
			<CustomTabPanel value={value} index={1}>
				<List>
					{quests.length === 0 && (
						<Typography sx={{ p: 2, opacity: 0.5 }}>
							No quests found.
						</Typography>
					)}
					{quests.map((quest: any) => (
						<ListItem
							key={quest.id}
							secondaryAction={
								canManage(quest) && (
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() => handleDelete(quest.id)}
									>
										<DeleteIcon />
									</IconButton>
								)
							}
						>
							<ListItemText
								primary={quest.title}
								secondary={quest.slug}
							/>
						</ListItem>
					))}
				</List>
			</CustomTabPanel>
		</Container>
	);
};

export default AdminDashboard;
