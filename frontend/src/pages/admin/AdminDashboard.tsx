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
import { useLocation } from "react-router-dom";
import api from "../../api/api";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../config/apiConfig";
import AdminQuestsPage from "./AdminQuestsPage";
import AdminMetrics from "./AdminMetrics";
import AdminUsers from "./AdminUsers";
import AdminSongs from "./AdminSongs";
import AdminForum from "./AdminForum";
import AdminProfile from "./AdminProfile";

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
	const location = useLocation();
	const { user } = useAuthStore();
	const isAdmin = user?.role === "ADMIN";

	// Calculate profile tab index based on role
	const getProfileTabIndex = () => (isAdmin ? 6 : 2);

	// Initialize tab based on navigation state
	const [value, setValue] = useState(() => {
		if (location.state?.tab === "profile") {
			return getProfileTabIndex();
		}
		return 0;
	});

	const [fanArts, setFanArts] = useState<any[]>([]);

	// Form states
	const [newItemTitle, setNewItemTitle] = useState("");
	const [newImageUrl, setNewImageUrl] = useState("");
	const [newArtistName, setNewArtistName] = useState("");

	// Handle navigation state changes
	useEffect(() => {
		if (location.state?.tab === "profile") {
			setValue(getProfileTabIndex());
			// Clear the state to prevent re-triggering
			window.history.replaceState({}, document.title);
		}
	}, [location.state]);

	const fetchContent = async () => {
		try {
			const resFanArt = await api.get(`/api/fan-art`);
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

			// Calculate indices for create logic
			// Admin Order: 0:Metrics, 1:Users, 2:Quests, 3:Songs, 4:Fan Art, 5:Forum
			// User Order: 0:Fan Art

			if (isAdmin) {
				if (value === 2) {
					// Quests
					endpoint = "/quests";
					payload = {
						title: newItemTitle,
						slug: newItemTitle.toLowerCase().replace(/ /g, "-"),
						description: "Draft description",
					};
				} else if (value === 4) {
					// Fan Art
					endpoint = "/fan-art";
					payload = {
						title: newItemTitle,
						imageUrl: newImageUrl,
						artistName: newArtistName,
						description: "Community Art",
					};
				}
			} else {
				if (value === 0) {
					// Fan Art
					endpoint = "/fan-art";
					payload = {
						title: newItemTitle,
						imageUrl: newImageUrl,
						artistName: newArtistName,
						description: "Community Art",
					};
				}
			}

			if (endpoint) {
				await api.post(`${endpoint}`, payload);
				setNewItemTitle("");
				setNewImageUrl("");
				setNewArtistName("");
				fetchContent();
			}
		} catch (error) {
			alert("Error creating item");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			let endpoint = "";
			// Handle delete based on tabs
			if (isAdmin) {
				if (value === 2) endpoint = "/quests";
				if (value === 4) endpoint = "/fan-art";
			} else {
				if (value === 0) endpoint = "/fan-art";
			}

			if (endpoint) {
				await api.delete(`${endpoint}/${id}`);
				fetchContent();
			}
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

	// Define Tabs
	// Admin: Metrics (0), Users (1), Quests (2), Songs (3), Fan Art (4), Forum (5)
	// User: Fan Art (0)

	const showFanArtForm = isAdmin ? value === 5 : value === 1;

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

			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="admin tabs"
					variant="scrollable"
					scrollButtons="auto"
				>
					{isAdmin && <Tab label="Metrics" />} {/* 0 */}
					{isAdmin && <Tab label="Users" />} {/* 1 */}
					{isAdmin && <Tab label="Quests" />} {/* 2 */}
					{isAdmin && <Tab label="Songs" />} {/* 3 */}
					<Tab label="My Posts" /> {/* 4 (Admin) / 0 (User) */}
					<Tab label="Fan Art" /> {/* 5 (Admin) / 1 (User) */}
					<Tab label="Profile" /> {/* 6 (Admin) / 2 (User) */}
					{isAdmin && <Tab label="All Forum Posts" />} {/* 7 */}
				</Tabs>
			</Box>

			{/* Simple Create Form - Only for Fan Art in this refactored view, 
			    Complex types like Quests/Songs/Forum/Users have their own components */}
			{showFanArtForm && (
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
							onChange={(e) => setNewItemTitle(e.target.value)}
						/>
						<TextField
							label="Image URL"
							variant="outlined"
							size="small"
							fullWidth
							value={newImageUrl}
							onChange={(e) => setNewImageUrl(e.target.value)}
						/>
						<TextField
							label="Artist Name"
							variant="outlined"
							size="small"
							fullWidth
							value={newArtistName}
							onChange={(e) => setNewArtistName(e.target.value)}
						/>
						<Button
							variant="contained"
							onClick={handleCreate}
							sx={{ minWidth: 100 }}
						>
							Create
						</Button>
					</Box>
				</Paper>
			)}

			{/* Admin Panels */}
			{isAdmin && (
				<>
					<CustomTabPanel value={value} index={0}>
						<AdminMetrics />
					</CustomTabPanel>
					<CustomTabPanel value={value} index={1}>
						<AdminUsers />
					</CustomTabPanel>
					<CustomTabPanel value={value} index={2}>
						<AdminQuestsPage />
					</CustomTabPanel>
					<CustomTabPanel value={value} index={3}>
						<AdminSongs />
					</CustomTabPanel>
				</>
			)}

			{/* Fan Art Panel - Index 5 for Admin, 1 for User */}
			<CustomTabPanel value={value} index={isAdmin ? 5 : 1}>
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

			{/* Forum Panel - Admin only sees all */}
			{isAdmin && (
				<CustomTabPanel value={value} index={7}>
					<AdminForum />
				</CustomTabPanel>
			)}

			{/* My Posts Panel - User's own posts */}
			<CustomTabPanel value={value} index={isAdmin ? 4 : 0}>
				<AdminForum showOnlyMine />
			</CustomTabPanel>

			{/* Profile Panel */}
			<CustomTabPanel value={value} index={isAdmin ? 6 : 2}>
				<AdminProfile />
			</CustomTabPanel>
		</Container>
	);
};

export default AdminDashboard;
