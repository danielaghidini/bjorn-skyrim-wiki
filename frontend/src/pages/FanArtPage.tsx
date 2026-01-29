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
	Tabs,
	Tab,
	Chip,
	Paper,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	IconButton,
	Dialog,
} from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { X, PlusCircle } from "lucide-react";
import api from "../api/api";

interface FanArt {
	id: string;
	title: string;
	imageUrl: string;
	artistName: string;
	description?: string;
	type?: string;
}

const FanArtPage: React.FC = () => {
	const [fanArts, setFanArts] = useState<FanArt[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedTab, setSelectedTab] = useState("All");
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const { user } = useAuthStore();
	// Form states
	const [newItemTitle, setNewItemTitle] = useState("");
	const [newImageUrl, setNewImageUrl] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [newItemType, setNewItemType] = useState("Fan Art");

	const handleCreate = async () => {
		if (!newItemTitle || !newImageUrl) return;
		try {
			await api.post("/api/fan-art", {
				title: newItemTitle,
				imageUrl: newImageUrl,
				artistName: user?.name || "Anonymous",
				description: newDescription,
				type: newItemType,
			});
			setNewItemTitle("");
			setNewImageUrl("");
			setNewDescription("");
			setNewItemType("Fan Art");
			setShowCreateForm(false);

			// Refresh list
			const response = await api.get(`/api/fan-art`);
			setFanArts(response.data);
		} catch (error) {
			console.error("Error creating item:", error);
			setError("Failed to create item.");
		}
	};

	useEffect(() => {
		const fetchFanArt = async () => {
			try {
				const response = await api.get(`/api/fan-art`);
				setFanArts(response.data);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching gallery:", err);
				setError("Failed to load the gallery.");
				setLoading(false);
			}
		};

		fetchFanArt();
	}, []);

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: string,
	) => {
		setSelectedTab(newValue);
	};

	const filteredArts =
		selectedTab === "All"
			? fanArts
			: fanArts.filter(
					(art) =>
						(art.type || "Fan Art") === selectedTab ||
						(selectedTab === "Fan Art" && !art.type), // Handle legacy items as Fan Art
				);

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
			<Box textAlign="center" mb={6}>
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
					Gallery
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

			<Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
				<Tabs
					value={selectedTab}
					onChange={handleTabChange}
					centered={true}
					textColor="primary"
					indicatorColor="primary"
				>
					<Tab label="All" value="All" />
					<Tab label="Fan Art" value="Fan Art" />
					<Tab label="Screenshots" value="Screenshot" />
				</Tabs>
			</Box>

			{user ? (
				<Box sx={{ mb: 4 }}>
					<Box display="flex" justifyContent="flex-end" mb={2}>
						{!showCreateForm && (
							<Button
								variant="contained"
								color="primary"
								startIcon={<PlusCircle size={20} />}
								onClick={() => setShowCreateForm(true)}
								sx={{ fontWeight: "bold" }}
							>
								Upload Art
							</Button>
						)}
					</Box>

					{showCreateForm && (
						<Paper
							sx={{
								p: 3,
								mb: 4,
								bgcolor: "rgba(21, 25, 33, 0.9)",
								border: "1px solid",
								borderColor: "primary.main",
								borderRadius: 2,
								animation: "fadeIn 0.3s ease-in-out",
								"@keyframes fadeIn": {
									"0%": {
										opacity: 0,
										transform: "translateY(-10px)",
									},
									"100%": {
										opacity: 1,
										transform: "translateY(0)",
									},
								},
							}}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mb: 2,
								}}
							>
								<Typography
									variant="h6"
									sx={{ color: "#ffffff" }}
								>
									Upload New Art
								</Typography>
								<IconButton
									onClick={() => setShowCreateForm(false)}
								>
									<X size={20} color="#ffffff" />
								</IconButton>
							</Box>

							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: 2,
								}}
							>
								<Box sx={{ display: "flex", gap: 2 }}>
									<TextField
										label="Title"
										variant="outlined"
										size="small"
										fullWidth
										value={newItemTitle}
										onChange={(e) =>
											setNewItemTitle(e.target.value)
										}
										sx={{ bgcolor: "rgba(0,0,0,0.2)" }}
									/>
									<FormControl
										size="small"
										sx={{ minWidth: 150 }}
									>
										<InputLabel>Type</InputLabel>
										<Select
											value={newItemType}
											label="Type"
											onChange={(e) =>
												setNewItemType(e.target.value)
											}
											sx={{ bgcolor: "rgba(0,0,0,0.2)" }}
										>
											<MenuItem value="Fan Art">
												Fan Art
											</MenuItem>
											<MenuItem value="Screenshot">
												Screenshot
											</MenuItem>
										</Select>
									</FormControl>
								</Box>

								<TextField
									label="Image URL"
									variant="outlined"
									size="small"
									fullWidth
									value={newImageUrl}
									onChange={(e) =>
										setNewImageUrl(e.target.value)
									}
									sx={{ bgcolor: "rgba(0,0,0,0.2)" }}
								/>

								<TextField
									label="Description (Optional)"
									variant="outlined"
									size="small"
									fullWidth
									multiline
									rows={3}
									value={newDescription}
									onChange={(e) =>
										setNewDescription(e.target.value)
									}
									sx={{ bgcolor: "rgba(0,0,0,0.2)" }}
								/>

								<Box
									display="flex"
									justifyContent="flex-end"
									gap={2}
									mt={1}
								>
									<Button
										onClick={() => setShowCreateForm(false)}
										sx={{ color: "text.secondary" }}
									>
										Cancel
									</Button>
									<Button
										variant="contained"
										onClick={handleCreate}
										disabled={!newItemTitle || !newImageUrl}
									>
										Post
									</Button>
								</Box>
							</Box>
						</Paper>
					)}
				</Box>
			) : (
				<Alert severity="info" sx={{ mb: 4 }}>
					Please log in to submit your own art or screenshots.
				</Alert>
			)}

			{error && (
				<Alert severity="error" sx={{ mb: 4 }}>
					{error}
				</Alert>
			)}

			{filteredArts.length === 0 && !error ? (
				<Typography
					variant="body1"
					textAlign="center"
					color="text.secondary"
				>
					No items found in this category.
				</Typography>
			) : (
				<Grid container spacing={4}>
					{filteredArts.map((art) => (
						<Grid key={art.id} size={{ xs: 12, sm: 6, md: 4 }}>
							<Card
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
									background: "rgba(13, 25, 41, 0.7)",
									backdropFilter: "blur(10px)",
									border: "1px solid rgba(79, 195, 247, 0.2)",
									transition:
										"transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
									"&:hover": {
										transform: "translateY(-10px)",
										boxShadow:
											"0 0 20px rgba(79, 195, 247, 0.2)",
										border: "1px solid #4fc3f7",
									},
									position: "relative",
								}}
							>
								<Chip
									label={art.type || "Fan Art"}
									size="small"
									color="primary"
									sx={{
										position: "absolute",
										top: 10,
										right: 10,
										zIndex: 1,
										opacity: 0.9,
									}}
								/>
								<Tooltip
									title={art.description || art.title}
									arrow
									placement="top"
								>
									<CardMedia
										component="img"
										image={art.imageUrl}
										alt={art.title}
										onClick={() =>
											setSelectedImage(art.imageUrl)
										}
										sx={{
											height: 350,
											objectFit: "cover",
											cursor: "pointer",
											borderBottom:
												"1px solid rgba(79, 195, 247, 0.2)",
										}}
									/>
								</Tooltip>
								<CardContent sx={{ flexGrow: 1, p: 3 }}>
									<Typography
										variant="h5"
										component="h2"
										gutterBottom
										sx={{
											fontFamily: "Bungee",
											color: "#ffffff",
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

			<Dialog
				open={!!selectedImage}
				onClose={() => setSelectedImage(null)}
				maxWidth="lg"
				PaperProps={{
					sx: {
						bgcolor: "transparent",
						boxShadow: "none",
						backgroundImage: "none",
					},
				}}
			>
				<Box sx={{ position: "relative", outline: "none" }}>
					<IconButton
						onClick={() => setSelectedImage(null)}
						sx={{
							position: "absolute",
							top: 10,
							right: 10,
							color: "#ffffff",
							bgcolor: "rgba(0,0,0,0.5)",
							"&:hover": {
								bgcolor: "rgba(0,0,0,0.7)",
							},
						}}
					>
						<X size={24} />
					</IconButton>
					<Box
						component="img"
						src={selectedImage || undefined}
						alt="Full size"
						sx={{
							maxWidth: "100%",
							maxHeight: "90vh",
							display: "block",
							borderRadius: 2,
							border: "1px solid rgba(79, 195, 247, 0.5)",
							boxShadow: "0 0 50px rgba(0,0,0,0.5)",
						}}
					/>
				</Box>
			</Dialog>
		</Container>
	);
};

export default FanArtPage;
