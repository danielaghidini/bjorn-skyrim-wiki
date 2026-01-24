import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, Typography } from "@mui/material";
import skyrimTheme from "./styles/Theme";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import ForumPage from "./pages/ForumPage";
import TechnicalPage from "./pages/TechnicalPage";
import FollowersPage from "./pages/FollowersPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Placeholder components for other pages
const DialoguesPage = () => (
	<Box sx={{ pb: 8 }}>
		<Box sx={{ mb: 6, textAlign: "center" }}>
			<Typography
				variant="h2"
				gutterBottom
				sx={{
					color: "#ffffff",
					fontFamily: "Bungee",
					fontSize: { xs: "2.5rem", md: "3.5rem" },
				}}
			>
				Dialogues
			</Typography>
			<Typography
				variant="h6"
				sx={{ color: "primary.main", opacity: 0.8 }}
			>
				Explore over 4500 lines of fully voiced dialogue.
			</Typography>
		</Box>
		<Typography variant="body1" sx={{ textAlign: "center", opacity: 0.7 }}>
			Complete dialogue database coming soon...
		</Typography>
	</Box>
);
const BjornQuestsPage = () => (
	<Box sx={{ pb: 8 }}>
		<Box sx={{ mb: 6, textAlign: "center" }}>
			<Typography
				variant="h2"
				gutterBottom
				sx={{
					color: "#ffffff",
					fontFamily: "Bungee",
					fontSize: { xs: "2.5rem", md: "3.5rem" },
				}}
			>
				Bjorn Quests
			</Typography>
			<Typography
				variant="h6"
				sx={{ color: "primary.main", opacity: 0.8 }}
			>
				Discover the specific journey of the Nordic Follower.
			</Typography>
		</Box>
		<Typography variant="body1" sx={{ textAlign: "center", opacity: 0.7 }}>
			Detailed quest information coming soon...
		</Typography>
	</Box>
);
const GameQuestsPage = () => (
	<Box sx={{ pb: 8 }}>
		<Box sx={{ mb: 6, textAlign: "center" }}>
			<Typography
				variant="h2"
				gutterBottom
				sx={{
					color: "#ffffff",
					fontFamily: "Bungee",
					fontSize: { xs: "2.5rem", md: "3.5rem" },
				}}
			>
				Game Quests
			</Typography>
			<Typography
				variant="h6"
				sx={{ color: "primary.main", opacity: 0.8 }}
			>
				See how Bjorn interacts with the world's original challenges.
			</Typography>
		</Box>
		<Typography variant="body1" sx={{ textAlign: "center", opacity: 0.7 }}>
			Vanilla game interaction details coming soon...
		</Typography>
	</Box>
);
const MediaPage = () => (
	<Box sx={{ pb: 8 }}>
		<Box sx={{ mb: 6, textAlign: "center" }}>
			<Typography
				variant="h2"
				gutterBottom
				sx={{
					color: "#ffffff",
					fontFamily: "Bungee",
					fontSize: { xs: "2.5rem", md: "3.5rem" },
				}}
			>
				Gallery
			</Typography>
			<Typography
				variant="h6"
				sx={{ color: "primary.main", opacity: 0.8 }}
			>
				A collection of screenshots and videos from Bjorn's journey.
			</Typography>
		</Box>
		<Typography variant="body1" sx={{ textAlign: "center", opacity: 0.7 }}>
			Media gallery coming soon...
		</Typography>
	</Box>
);

function App() {
	return (
		<ThemeProvider theme={skyrimTheme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainLayout />}>
						<Route index element={<HomePage />} />
						<Route path="login" element={<LoginPage />} />
						<Route path="register" element={<RegisterPage />} />
						<Route
							path="admin"
							element={
								<ProtectedRoute>
									<AdminDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="quests/bjorn"
							element={<BjornQuestsPage />}
						/>
						<Route
							path="quests/game"
							element={<GameQuestsPage />}
						/>
						<Route path="forum" element={<ForumPage />} />
						<Route path="followers" element={<FollowersPage />} />
						<Route path="technical" element={<TechnicalPage />} />
						<Route path="dialogues" element={<DialoguesPage />} />
						<Route path="media" element={<MediaPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
