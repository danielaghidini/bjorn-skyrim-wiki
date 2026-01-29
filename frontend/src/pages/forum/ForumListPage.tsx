import React, { useState, useEffect } from "react";
import {
	Typography,
	Box,
	Paper,
	Stack,
	Button,
	TextField,
	Chip,
	Menu,
	MenuItem,
	CircularProgress,
	IconButton,
	FormControl,
	Select,
	InputLabel,
} from "@mui/material";
import {
	PlusCircle,
	Filter,
	ThumbsUp,
	MessageSquare,
	X,
	ArrowUpDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../types/forum";
import { forumService } from "../../data/forumService";
import { useAuthStore } from "../../store/authStore";

const ForumListPage: React.FC = () => {
	const navigate = useNavigate();
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null,
	);
	const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
		null,
	);

	const [newPostTitle, setNewPostTitle] = useState("");
	const [newPostContent, setNewPostContent] = useState("");
	const [newPostCategory, setNewPostCategory] =
		useState("General Discussion");
	const [showNewPost, setShowNewPost] = useState(false);
	const [sortBy, setSortBy] = useState<"date" | "likes">("date");
	const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
	const { user } = useAuthStore();
	const isAdmin = user?.role === "ADMIN";

	useEffect(() => {
		const loadPosts = async () => {
			setIsLoading(true);
			try {
				const data = await forumService.getAllPosts();
				setPosts(data);
			} catch (error) {
				console.error("Failed to load posts", error);
			} finally {
				setIsLoading(false);
			}
		};
		loadPosts();
	}, []);

	const handleCreatePost = async () => {
		if (!newPostTitle || !newPostContent) return;

		try {
			await forumService.createPost({
				title: newPostTitle,
				content: newPostContent,
				category: newPostCategory,
			});

			const updatedPosts = await forumService.getAllPosts();
			setPosts(updatedPosts);
			setNewPostTitle("");
			setNewPostContent("");
			setNewPostCategory("General Discussion");
			setShowNewPost(false);
		} catch (error: unknown) {
			console.error("Failed to create post:", error);
			const err = error as { response?: { status?: number } };
			if (err.response && err.response.status === 401) {
				navigate("/login", {
					state: {
						message: "You must be logged in to create a post.",
					},
				});
			} else {
				alert("Failed to create post. Please try again later.");
			}
		}
	};

	// Static list of categories in alphabetical order
	const CATEGORIES = [
		"Announcements",
		"Bug Reports",
		"General Discussion",
		"Guides & Tips",
		"Lore & Stories",
		"Mod Compatibility",
		"Off-Topic",
		"Questions",
		"Suggestions",
		"Technical Issues",
	];

	// Filter out Announcements for non-admins when creating posts
	const availableCategories = isAdmin
		? CATEGORIES
		: CATEGORIES.filter((cat) => cat !== "Announcements");

	// Color mapping for category badges
	const CATEGORY_COLORS: Record<string, string> = {
		Announcements: "#2196F3", // Blue
		"Bug Reports": "#F44336", // Red
		"General Discussion": "#9E9E9E", // Gray
		"Guides & Tips": "#4CAF50", // Green
		"Lore & Stories": "#9C27B0", // Purple
		"Mod Compatibility": "#FF9800", // Orange
		"Off-Topic": "#607D8B", // Blue Gray
		Questions: "#00BCD4", // Cyan
		Suggestions: "#FFEB3B", // Yellow
		"Technical Issues": "#E91E63", // Pink
	};

	const filteredPosts = selectedCategory
		? posts.filter((post) => post.category === selectedCategory)
		: posts;

	// Apply sorting
	const sortedPosts = [...filteredPosts].sort((a, b) => {
		if (sortBy === "likes") {
			return b.likes - a.likes; // Most likes first
		} else {
			// Sort by date (newest first)
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		}
	});

	return (
		<Box sx={{ py: { xs: 4, md: 8 } }}>
			{/* Header */}
			<Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>
				<Typography
					variant="h2"
					gutterBottom
					sx={{
						color: "#ffffff",
						fontFamily: "Bungee",
					}}
				>
					Adventurers' Tavern
				</Typography>
				<Typography
					variant="h5"
					sx={{
						color: "primary.main",
						fontFamily: "Alan Sans",
						maxWidth: "80%",
						mx: "auto",
					}}
				>
					"I might hit a tavern or two... purely for scouting
					purposes, of course."
				</Typography>
			</Box>

			{/* Action Bar */}
			<Stack
				direction="row"
				spacing={2}
				sx={{ mb: 4 }}
				justifyContent="space-between"
				alignItems="center"
			>
				<Box>
					<Button
						startIcon={<Filter size={18} />}
						onClick={(e) => setFilterAnchorEl(e.currentTarget)}
						sx={{
							color: selectedCategory
								? "primary.main"
								: "text.secondary",
							borderColor: selectedCategory
								? "primary.main"
								: "rgba(255,255,255,0.2)",
						}}
						variant="outlined"
					>
						{selectedCategory || "Filter by Category"}
					</Button>
					<Menu
						anchorEl={filterAnchorEl}
						open={Boolean(filterAnchorEl)}
						onClose={() => setFilterAnchorEl(null)}
						PaperProps={{
							sx: {
								bgcolor: "#1a1f2e",
								border: "1px solid rgba(79, 195, 247, 0.2)",
								color: "text.primary",
							},
						}}
					>
						<MenuItem
							onClick={() => {
								setSelectedCategory(null);
								setFilterAnchorEl(null);
							}}
							selected={selectedCategory === null}
						>
							All Categories
						</MenuItem>
						{CATEGORIES.map((cat) => (
							<MenuItem
								key={cat}
								onClick={() => {
									setSelectedCategory(cat);
									setFilterAnchorEl(null);
								}}
								selected={selectedCategory === cat}
							>
								{cat}
							</MenuItem>
						))}
					</Menu>

					{/* Sort Button */}
					<Button
						startIcon={<ArrowUpDown size={18} />}
						onClick={(e) => setSortAnchorEl(e.currentTarget)}
						sx={{
							color: "text.secondary",
							borderColor: "rgba(255,255,255,0.2)",
							ml: 1,
						}}
						variant="outlined"
					>
						{sortBy === "date" ? "Newest" : "Most Liked"}
					</Button>
					<Menu
						anchorEl={sortAnchorEl}
						open={Boolean(sortAnchorEl)}
						onClose={() => setSortAnchorEl(null)}
						PaperProps={{
							sx: {
								bgcolor: "#1a1f2e",
								border: "1px solid rgba(79, 195, 247, 0.2)",
								color: "text.primary",
							},
						}}
					>
						<MenuItem
							onClick={() => {
								setSortBy("date");
								setSortAnchorEl(null);
							}}
							selected={sortBy === "date"}
						>
							Newest First
						</MenuItem>
						<MenuItem
							onClick={() => {
								setSortBy("likes");
								setSortAnchorEl(null);
							}}
							selected={sortBy === "likes"}
						>
							Most Liked
						</MenuItem>
					</Menu>
				</Box>
				<Button
					variant="contained"
					color="primary"
					startIcon={<PlusCircle size={20} />}
					onClick={() => setShowNewPost(!showNewPost)}
					sx={{ fontWeight: "bold" }}
				>
					New Post
				</Button>
			</Stack>

			{/* New Post Form */}
			{showNewPost && (
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
							"100%": { opacity: 1, transform: "translateY(0)" },
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
						<Typography variant="h6" sx={{ color: "#ffffff" }}>
							Start a New Discussion
						</Typography>
						<IconButton onClick={() => setShowNewPost(false)}>
							<X size={20} />
						</IconButton>
					</Box>

					<FormControl fullWidth size="small" sx={{ mb: 2 }}>
						<InputLabel id="category-select-label">
							Category
						</InputLabel>
						<Select
							labelId="category-select-label"
							value={newPostCategory}
							label="Category"
							onChange={(e) => setNewPostCategory(e.target.value)}
							sx={{ bgcolor: "rgba(0,0,0,0.2)" }}
						>
							{availableCategories.map((cat) => (
								<MenuItem key={cat} value={cat}>
									{cat}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						fullWidth
						placeholder="Title"
						variant="outlined"
						size="small"
						value={newPostTitle}
						onChange={(e) => setNewPostTitle(e.target.value)}
						sx={{ mb: 2, bgcolor: "rgba(0,0,0,0.2)" }}
					/>
					<TextField
						fullWidth
						multiline
						rows={4}
						placeholder="Share your suggestion or story..."
						variant="outlined"
						value={newPostContent}
						onChange={(e) => setNewPostContent(e.target.value)}
						sx={{ mb: 2, bgcolor: "rgba(0,0,0,0.2)" }}
					/>
					<Stack
						direction="row"
						spacing={2}
						justifyContent="flex-end"
					>
						<Button
							onClick={() => setShowNewPost(false)}
							sx={{ color: "text.secondary" }}
						>
							Cancel
						</Button>
						<Button variant="contained" onClick={handleCreatePost}>
							Post
						</Button>
					</Stack>
				</Paper>
			)}

			{/* Loading State */}
			{isLoading ? (
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress />
				</Box>
			) : (
				/* Post List */
				<Stack spacing={2}>
					{sortedPosts.length === 0 ? (
						<Paper
							sx={{
								p: 4,
								textAlign: "center",
								bgcolor: "rgba(21, 25, 33, 0.5)",
							}}
						>
							<Typography color="text.secondary">
								No posts found. Be the first to post!
							</Typography>
						</Paper>
					) : (
						sortedPosts.map((post) => (
							<Paper
								key={post.id}
								onClick={() => navigate(`/forum/${post.slug}`)}
								sx={{
									p: 3,
									bgcolor:
										post.category === "Announcements"
											? "rgba(33, 150, 243, 0.12)"
											: "rgba(21, 25, 33, 0.8)",
									border:
										post.category === "Announcements"
											? "1px solid rgba(33, 150, 243, 0.4)"
											: "1px solid rgba(79, 195, 247, 0.05)",
									borderRadius: 2,
									cursor: "pointer",
									transition: "all 0.2s ease",
									"&:hover": {
										borderColor:
											post.category === "Announcements"
												? "rgba(33, 150, 243, 0.8)"
												: "primary.main",
										transform: "translateX(4px)",
										bgcolor:
											post.category === "Announcements"
												? "rgba(33, 150, 243, 0.18)"
												: "rgba(21, 25, 33, 0.95)",
									},
								}}
							>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "flex-start",
										mb: 1,
									}}
								>
									<Box sx={{ flexGrow: 1 }}>
										<Stack
											direction="row"
											spacing={2}
											alignItems="center"
											sx={{ mb: 1 }}
										>
											<Chip
												label={post.category}
												size="small"
												variant="outlined"
												sx={{
													borderRadius: 1,
													fontSize: "0.65rem",
													height: "20px",
													borderColor:
														CATEGORY_COLORS[
															post.category
														] || "#4FC3F7",
													color:
														CATEGORY_COLORS[
															post.category
														] || "#4FC3F7",
												}}
											/>
											<Typography
												variant="caption"
												sx={{ color: "text.secondary" }}
											>
												Posted by{" "}
												<span style={{ color: "#fff" }}>
													{post.author}
												</span>{" "}
												• {post.date}
											</Typography>
										</Stack>
										<Typography
											variant="h6"
											sx={{
												color: "#ffffff",
												fontFamily: "Alan Sans",
												fontWeight: "bold",
												mb: 0.5,
											}}
										>
											{post.title}
										</Typography>
										<Typography
											variant="body2"
											sx={{
												color: "text.secondary",
												display: "-webkit-box",
												WebkitLineClamp: 2,
												WebkitBoxOrient: "vertical",
												overflow: "hidden",
											}}
										>
											{post.content}
										</Typography>
									</Box>

									{/* Stats */}
									<Stack
										spacing={1}
										alignItems="flex-end"
										sx={{ pl: 2, minWidth: "80px" }}
									>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 0.5,
												color: "text.secondary",
												cursor: "pointer",
												"&:hover": {
													color: "primary.main",
												},
											}}
											onClick={async (e) => {
												e.stopPropagation();
												try {
													await forumService.toggleLike(
														post.id,
													);
													// Refresh posts to show new count
													const updatedPosts =
														await forumService.getAllPosts();
													setPosts(updatedPosts);
												} catch (error: unknown) {
													const err = error as {
														response?: {
															status?: number;
														};
													};
													if (
														err.response &&
														err.response.status ===
															401
													) {
														navigate("/login", {
															state: {
																message:
																	"You must be logged in to like a post.",
															},
														});
													}
												}
											}}
										>
											<ThumbsUp
												size={16}
												style={{ opacity: 0.7 }}
												fill={
													post.isLiked
														? "currentColor"
														: "none"
												}
											/>
											<Typography
												variant="caption"
												color={
													post.isLiked
														? "primary.main"
														: "text.secondary"
												}
											>
												{post.likes}
											</Typography>
										</Box>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 0.5,
												color: "text.secondary",
											}}
										>
											<MessageSquare
												size={16}
												style={{ opacity: 0.7 }}
											/>
											<Typography variant="caption">
												{post.comments.length}
											</Typography>
										</Box>
									</Stack>
								</Box>
							</Paper>
						))
					)}
				</Stack>
			)}
		</Box>
	);
};

export default ForumListPage;
