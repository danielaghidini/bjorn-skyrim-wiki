import { useState } from "react";
import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	Paper,
	Alert,
	Link,
} from "@mui/material";

import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import api from "../api/api";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	const setAuth = useAuthStore((state) => state.setAuth);
	const message = (location.state as { message?: string })?.message;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await api.post(`/auth/login`, {
				email,
				password,
			});

			setAuth(response.data.user, response.data.token);
			navigate("/admin");
		} catch (err: unknown) {
			const error = err as { response?: { data?: { error?: string } } };
			setError(error.response?.data?.error || "Failed to login");
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					py: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Paper sx={{ p: 4, width: "100%" }}>
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
						Login
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
						Access the mercenary archives
					</Typography>
					{message && (
						<Alert severity="info" sx={{ mb: 2 }}>
							{message}
						</Alert>
					)}
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}
					<Box component="form" onSubmit={handleSubmit} noValidate>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
						<Box sx={{ textAlign: "center" }}>
							<Link
								component={RouterLink}
								to="/register"
								variant="body2"
							>
								Don't have an account? Sign Up
							</Link>
						</Box>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default LoginPage;
