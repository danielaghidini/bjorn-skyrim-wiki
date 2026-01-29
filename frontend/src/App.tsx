import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import skyrimTheme from "./styles/Theme";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import TechnicalPage from "./pages/TechnicalPage";
import FollowersPage from "./pages/FollowersPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FanArtPage from "./pages/FanArtPage";

import DialoguesPage from "./pages/DialoguesPage";
import SongsPage from "./pages/SongsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatPage from "./pages/ChatPage";
import BjornQuestsPage from "./pages/BjornQuestsPage";
import CookieBanner from "./components/common/CookieBanner";

// Forum Pages
import ForumListPage from "./pages/forum/ForumListPage";
import ForumPostPage from "./pages/forum/ForumPostPage";

// Placeholder components for other pages

function App() {
	useEffect(() => {
		useAuthStore.getState().checkAuth();
	}, []);

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

						{/* Forum Routes */}
						<Route path="forum" element={<ForumListPage />} />
						<Route path="forum/:id" element={<ForumPostPage />} />

						<Route path="forum/:id" element={<ForumPostPage />} />

						<Route path="gallery" element={<FanArtPage />} />
						<Route path="followers" element={<FollowersPage />} />
						<Route path="technical" element={<TechnicalPage />} />

						<Route path="dialogues" element={<DialoguesPage />} />
						<Route path="songs" element={<SongsPage />} />

						<Route
							path="*"
							element={<Box sx={{ p: 4 }}>Page Not Found</Box>}
						/>
					</Route>
					{/* Standalone Route for Chat (No MainLayout) */}
					<Route path="/chat" element={<ChatPage />} />
				</Routes>
				<CookieBanner />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
