import React, { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Grid,
	Card,
	CardMedia,
	CardContent,
	Box,
	CircularProgress,
	Alert,
	Tooltip,
} from "@mui/material";
import api from "../api/api";

interface FanArt {
	id: string;
	title: string;
	imageUrl: string;
	artistName: string;
	description?: string;
}

const FanArtPage: React.FC = () => {
	const [fanArts, setFanArts] = useState<FanArt[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchFanArt = async () => {
			try {
				const response = await api.get(`/api/fan-art`);
				setFanArts(response.data);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching fan art:", err);
				setError("Failed to load the art gallery.");
				setLoading(false);
			}
		};

		fetchFanArt();
	}, []);

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="60vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 8 }}>
			<Box textAlign="center" mb={8}>
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
					Fan Art
				</Typography>
				<Typography
					variant="h5"
					gutterBottom
					sx={{
						fontFamily: "Alan Sans",
						color: "primary.main",
						mb: 6,
						textAlign: "center",
						maxWidth: "80%",
						mx: "auto",
					}}
				>
					"This land holds many secrets, but it also holds much
					beauty. I try to appreciate both."
				</Typography>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 4 }}>
					{error}
				</Alert>
			)}

			{fanArts.length === 0 && !error ? (
				<Typography
					variant="body1"
					textAlign="center"
					color="text.secondary"
				>
					No art pieces in the gallery yet. Be the first to
					contribute!
				</Typography>
			) : (
				<Grid container spacing={4}>
					{fanArts.map((art) => (
						<Grid key={art.id} size={{ xs: 12, sm: 6, md: 4 }}>
							<Card
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
									background: "rgba(30, 30, 30, 0.6)",
									backdropFilter: "blur(10px)",
									border: "1px solid rgba(139, 115, 85, 0.2)",
									transition:
										"transform 0.3s ease, box-shadow 0.3s ease",
									"&:hover": {
										transform: "translateY(-10px)",
										boxShadow:
											"0 10px 30px rgba(0,0,0,0.5)",
										border: "1px solid rgba(139, 115, 85, 0.5)",
									},
								}}
							>
								<Tooltip
									title={art.description || art.title}
									arrow
									placement="top"
								>
									<CardMedia
										component="img"
										image={art.imageUrl}
										alt={art.title}
										sx={{
											height: 350,
											objectFit: "cover",
											borderBottom:
												"1px solid rgba(139, 115, 85, 0.2)",
										}}
									/>
								</Tooltip>
								<CardContent sx={{ flexGrow: 1, p: 3 }}>
									<Typography
										variant="h5"
										component="h2"
										gutterBottom
										sx={{
											fontFamily: "'Cinzel', serif",
											color: "#e0d8c3",
										}}
									>
										{art.title}
									</Typography>
									<Typography
										variant="body2"
										color="primary"
										sx={{ fontWeight: 600 }}
									>
										By: {art.artistName}
									</Typography>
									{art.description && (
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mt: 1, fontStyle: "italic" }}
										>
											"{art.description}"
										</Typography>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			)}
		</Container>
	);
};

export default FanArtPage;
