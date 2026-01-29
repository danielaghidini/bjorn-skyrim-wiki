import { useState, useEffect, useCallback } from "react";
import {
	Box,
	Container,
	Typography,
	Tab,
	Tabs,
	List,
	ListItem,
	ListItemText,
	IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import api from "../../api/api";
import { useAuthStore } from "../../store/authStore";

import AdminQuestsPage from "./AdminQuestsPage";
import AdminMetrics from "./AdminMetrics";
import AdminUsers from "./AdminUsers";
import AdminSongs from "./AdminSongs";
import AdminForum from "./AdminForum";
import AdminProfile from "./AdminProfile";
import AdminDialoguesManager from "./AdminDialoguesManager";
import AdminFAQ from "./AdminFAQ";

interface FanArtItem {
	id: string;
	title: string;
	imageUrl: string;
	artistName: string;
	description?: string;
	authorId?: string;
}

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
	// Admin: 0:Metrics, 1:Users, 2:Quests, 3:Dialogues, 4:All Forum Posts, 5:Gallery, 6:Songs, 7:FAQ, 8:My Posts, 9:Profile
	// User: 0:Gallery, 1:My Posts, 2:Profile
	const getProfileTabIndex = () => (isAdmin ? 9 : 2);

	// Initialize tab based on navigation state
	const [value, setValue] = useState(() => {
		if (location.state?.tab === "profile") {
			return getProfileTabIndex();
		}
		return 0;
	});

	const [fanArts, setFanArts] = useState<FanArtItem[]>([]);

	// Form states removed (moved to FanArtPage)

	// Handle navigation state changes
	useEffect(() => {
		if (location.state?.tab === "profile") {
			// eslint-disable-next-line
			setValue(getProfileTabIndex());
			// Clear the state to prevent re-triggering
			window.history.replaceState({}, document.title);
		}
	}, [location.state]);

	const fetchContent = useCallback(async () => {
		try {
			const resFanArt = await api.get(`/api/fan-art`);
			setFanArts(resFanArt.data);
		} catch (error) {
			console.error("Fetch error:", error);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line
		fetchContent();
	}, [fetchContent]);

	const handleDelete = async (id: string) => {
		try {
			let endpoint = "";
			// Handle delete based on tabs
			if (isAdmin) {
				if (value === 2) endpoint = "/api/quests";
				if (value === 5) endpoint = "/api/fan-art";
			} else {
				if (value === 0) endpoint = "/api/fan-art";
			}

			if (endpoint) {
				await api.delete(`${endpoint}/${id}`);
				fetchContent();
			}
		} catch {
			alert("Error deleting item");
		}
	};

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const canManage = (item: FanArtItem) => {
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
					{isAdmin && <Tab label="FAQ" />} {/* 7 */}
					<Tab label="My Posts" /> {/* 8 (Admin) / 1 (User) */}
					<Tab label="Profile" /> {/* 9 (Admin) / 2 (User) */}
				</Tabs>
			</Box>

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
					{fanArts.map((art: FanArtItem) => (
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

			{/* FAQ */}
			{isAdmin && (
				<CustomTabPanel value={value} index={7}>
					<AdminFAQ />
				</CustomTabPanel>
			)}

			{/* My Posts Panel - User's own posts */}
			<CustomTabPanel value={value} index={isAdmin ? 8 : 1}>
				<AdminForum showOnlyMine />
			</CustomTabPanel>

			{/* Profile Panel */}
			<CustomTabPanel value={value} index={isAdmin ? 9 : 2}>
				<AdminProfile />
			</CustomTabPanel>
		</Container>
	);
};

export default AdminDashboard;
