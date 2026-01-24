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
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const RegisterPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const setAuth = useAuthStore((state) => state.setAuth);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const apiUrl =
				import.meta.env.VITE_API_URL || "http://localhost:3000";
			const response = await axios.post(`${apiUrl}/auth/register`, {
				name,
				email,
				password,
			});

			setAuth(response.data.user, response.data.token);
			navigate("/"); // Redirect to home after register
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to register");
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Paper sx={{ p: 4, width: "100%" }}>
					<Typography
						component="h1"
						variant="h5"
						align="center"
						gutterBottom
					>
						Create Account
					</Typography>
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
							id="name"
							label="Full Name"
							name="name"
							autoComplete="name"
							autoFocus
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
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
							autoComplete="new-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</Button>
						<Box sx={{ textAlign: "center" }}>
							<Link
								component={RouterLink}
								to="/login"
								variant="body2"
							>
								Already have an account? Sign in
							</Link>
						</Box>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default RegisterPage;
