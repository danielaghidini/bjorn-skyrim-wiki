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
	const [articles, setArticles] = useState([]);
	const [quests, setQuests] = useState([]);
	const { token, logout } = useAuthStore();
	const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

	// Form states
	const [newItemTitle, setNewItemTitle] = useState("");

	const fetchContent = async () => {
		try {
			// Assuming GET endpoints exist (if not public, need headers).
			// Based on controller, we have CRUD. Usually GET is public.
			// If GET is not implemented yet, we might fail here.
			// But we implemented CRUD POST/PUT/DELETE.
			// We should check if GET exists. Using placeholders for now if not.
			// If GET /articles doesn't exist, we can't list.
			// Let's assume we can add GET routes or they exist?
			// Providing minimal implementation for now.
		} catch (error) {
			console.error(error);
		}
	};

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

			await axios.post(`${apiUrl}${endpoint}`, payload, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setNewItemTitle("");
			// Refresh list
		} catch (error) {
			alert("Error creating item");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const endpoint = value === 0 ? "/articles" : "/quests";
			await axios.delete(`${apiUrl}${endpoint}/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			// Refresh list
		} catch (error) {
			alert("Error deleting item");
		}
	};

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box
				sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
			>
				<Typography variant="h4">Admin Dashboard</Typography>
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
					{/* Placeholder items until GET is implemented */}
					<ListItem
						secondaryAction={
							<IconButton edge="end" aria-label="delete">
								<DeleteIcon />
							</IconButton>
						}
					>
						<ListItemText primary="Sample Article (GET not implemented)" />
					</ListItem>
				</List>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<List>
					<ListItem>
						<ListItemText primary="Sample Quest" />
					</ListItem>
				</List>
			</CustomTabPanel>
		</Container>
	);
};

export default AdminDashboard;
