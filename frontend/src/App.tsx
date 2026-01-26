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
import FanArtPage from "./pages/FanArtPage";

import DialoguesPage from "./pages/DialoguesPage";
import SongsPage from "./pages/SongsPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Placeholder components for other pages

const BjornQuestsPage = () => (
	<Box sx={{ py: 8 }}>
		<Box sx={{ mb: 6, textAlign: "center" }}>
			<Typography
				variant="h2"
				component="h1"
				gutterBottom
				sx={{
					color: "#ffffff",
					fontFamily: "Bungee",
					mb: 1,
				}}
			>
				Bjorn Quests
			</Typography>
			<Typography
				variant="h5"
				gutterBottom
				sx={{
					fontFamily: "Alan Sans",
					color: "primary.main",
					mb: 6,
				}}
			>
				Discover the specific journey of the Nordic Follower
			</Typography>
		</Box>
		<Typography variant="body1" sx={{ textAlign: "center", opacity: 0.7 }}>
			Detailed quest information coming soon...
		</Typography>
	</Box>
);
const MediaPage = () => (
	<Box sx={{ py: 8 }}>
		<Box sx={{ mb: 6, textAlign: "center" }}>
			<Typography
				variant="h2"
				component="h1"
				gutterBottom
				sx={{
					color: "#ffffff",
					fontFamily: "Bungee",
					mb: 1,
				}}
			>
				Gallery
			</Typography>
			<Typography
				variant="h5"
				gutterBottom
				sx={{
					fontFamily: "Alan Sans",
					color: "primary.main",
					mb: 6,
				}}
			>
				Screenshots and memories from Skyrim
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
						<Route path="forum" element={<ForumPage />} />
						<Route path="fan-art" element={<FanArtPage />} />
						<Route path="followers" element={<FollowersPage />} />
						<Route path="technical" element={<TechnicalPage />} />

						<Route path="dialogues" element={<DialoguesPage />} />
						<Route path="songs" element={<SongsPage />} />
						<Route path="media" element={<MediaPage />} />
						<Route
							path="*"
							element={<Box sx={{ p: 4 }}>Page Not Found</Box>}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
