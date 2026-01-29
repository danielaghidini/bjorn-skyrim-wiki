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
	Select,
	MenuItem,
	FormControl,
	InputLabel,
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
import AdminDialoguesManager from "./AdminDialoguesManager";

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
	// Admin: 0:Metrics, 1:Users, 2:Quests, 3:Dialogues, 4:All Forum Posts, 5:Gallery, 6:Songs, 7:My Posts, 8:Profile
	// User: 0:Gallery, 1:My Posts, 2:Profile
	const getProfileTabIndex = () => (isAdmin ? 8 : 2);

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
	const [newItemType, setNewItemType] = useState("Fan Art");

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

			// Admin: 0:Metrics, 1:Users, 2:Quests, 3:Dialogues, 4:All Forum Posts, 5:Gallery, 6:Songs, 7:My Posts, 8:Profile
			// User: 0:Gallery, 1:My Posts, 2:Profile

			if (isAdmin) {
				if (value === 2) {
					// Quests
					endpoint = "/quests";
					payload = {
						title: newItemTitle,
						slug: newItemTitle.toLowerCase().replace(/ /g, "-"),
						description: "Draft description",
					};
				} else if (value === 5) {
					// Gallery / Fan Art
					endpoint = "/fan-art";
					payload = {
						title: newItemTitle,
						imageUrl: newImageUrl,
						artistName: newArtistName,
						description: "Gallery Item",
						type: newItemType,
					};
				}
			} else {
				if (value === 0) {
					// Gallery / Fan Art (User)
					endpoint = "/fan-art";
					payload = {
						title: newItemTitle,
						imageUrl: newImageUrl,
						artistName: newArtistName,
						description: "Gallery Item",
						type: newItemType,
					};
				}
			}

			if (endpoint) {
				await api.post(`${endpoint}`, payload);
				setNewItemTitle("");
				setNewImageUrl("");
				setNewArtistName("");
				setNewItemType("Fan Art");
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
				if (value === 5) endpoint = "/fan-art";
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

	const showFanArtForm = isAdmin ? value === 5 : value === 0;

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
					{isAdmin && <Tab label="Dialogues" />} {/* 3 */}
					{isAdmin && <Tab label="All Forum Posts" />} {/* 4 */}
					<Tab label="Gallery" /> {/* 5 (Admin) / 0 (User) */}
					{isAdmin && <Tab label="Songs" />} {/* 6 */}
					<Tab label="My Posts" /> {/* 7 (Admin) / 1 (User) */}
					<Tab label="Profile" /> {/* 8 (Admin) / 2 (User) */}
				</Tabs>
			</Box>

			{/* Simple Create Form - Only for Gallery */}
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
					<Box
						sx={{
							display: "flex",
							gap: 2,
							flexWrap: "wrap",
							alignItems: "center",
						}}
					>
						<TextField
							label="New Title"
							variant="outlined"
							size="small"
							value={newItemTitle}
							onChange={(e) => setNewItemTitle(e.target.value)}
							sx={{ flex: 1, minWidth: 150 }}
						/>
						<TextField
							label="Image URL"
							variant="outlined"
							size="small"
							value={newImageUrl}
							onChange={(e) => setNewImageUrl(e.target.value)}
							sx={{ flex: 1, minWidth: 150 }}
						/>
						<TextField
							label="Artist Name"
							variant="outlined"
							size="small"
							value={newArtistName}
							onChange={(e) => setNewArtistName(e.target.value)}
							sx={{ flex: 1, minWidth: 150 }}
						/>
						<FormControl size="small" sx={{ minWidth: 120 }}>
							<InputLabel>Type</InputLabel>
							<Select
								value={newItemType}
								label="Type"
								onChange={(e) => setNewItemType(e.target.value)}
							>
								<MenuItem value="Fan Art">Fan Art</MenuItem>
								<MenuItem value="Screenshot">
									Screenshot
								</MenuItem>
							</Select>
						</FormControl>

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
						<AdminDialoguesManager />
					</CustomTabPanel>
					<CustomTabPanel value={value} index={4}>
						<AdminForum />
					</CustomTabPanel>
				</>
			)}

			{/* Fan Art Panel - Index 5 for Admin, 0 for User */}
			<CustomTabPanel value={value} index={isAdmin ? 5 : 0}>
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

			{/* Songs */}
			{isAdmin && (
				<CustomTabPanel value={value} index={6}>
					<AdminSongs />
				</CustomTabPanel>
			)}

			{/* My Posts Panel - User's own posts */}
			<CustomTabPanel value={value} index={isAdmin ? 7 : 1}>
				<AdminForum showOnlyMine />
			</CustomTabPanel>

			{/* Profile Panel */}
			<CustomTabPanel value={value} index={isAdmin ? 8 : 2}>
				<AdminProfile />
			</CustomTabPanel>
		</Container>
	);
};

export default AdminDashboard;
