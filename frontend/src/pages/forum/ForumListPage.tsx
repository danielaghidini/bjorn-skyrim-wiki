import React, { useState, useEffect } from "react";
import {
	Typography,
	Box,
	Paper,
	Stack,
	Button,
	TextField,
	Chip,
} from "@mui/material";
import { PlusCircle, Filter, ThumbsUp, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../types/forum";
import { forumService } from "../../data/mockForum";

const ForumListPage: React.FC = () => {
	const navigate = useNavigate();
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		const loadPosts = async () => {
			const data = await forumService.getAllPosts();
			setPosts(data);
		};
		loadPosts();
	}, []);
	const [newPostTitle, setNewPostTitle] = useState("");
	const [newPostContent, setNewPostContent] = useState("");
	const [showNewPost, setShowNewPost] = useState(false);

	const handleCreatePost = async () => {
		if (!newPostTitle || !newPostContent) return;

		try {
			await forumService.createPost({
				title: newPostTitle,
				content: newPostContent,
				category: "Suggestion",
			});

			const updatedPosts = await forumService.getAllPosts();
			setPosts(updatedPosts);
			setNewPostTitle("");
			setNewPostContent("");
			setShowNewPost(false);
		} catch (error: any) {
			console.error("Failed to create post:", error);
			if (error.response && error.response.status === 401) {
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
				<Button
					variant="contained"
					color="primary"
					startIcon={<PlusCircle size={20} />}
					onClick={() => setShowNewPost(!showNewPost)}
					sx={{ fontWeight: "bold" }}
				>
					New Post
				</Button>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						color: "text.secondary",
					}}
				>
					<Filter size={18} />
					<Typography variant="body2">Filter by Category</Typography>
				</Box>
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
					}}
				>
					<Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
						Post to the Notice Board
					</Typography>
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

			{/* Post List */}
			<Stack spacing={2}>
				{posts.map((post) => (
					<Paper
						key={post.id}
						onClick={() => navigate(`/forum/${post.slug}`)}
						sx={{
							p: 3,
							bgcolor: "rgba(21, 25, 33, 0.8)",
							border: "1px solid rgba(79, 195, 247, 0.05)",
							borderRadius: 2,
							cursor: "pointer",
							transition: "all 0.2s ease",
							"&:hover": {
								borderColor: "primary.main",
								transform: "translateX(4px)",
								bgcolor: "rgba(21, 25, 33, 0.95)",
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
										color={
											post.category === "Suggestion"
												? "primary"
												: "secondary"
										}
										sx={{
											borderRadius: 1,
											fontSize: "0.65rem",
											height: "20px",
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
										"&:hover": { color: "primary.main" },
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
										} catch (error: any) {
											if (
												error.response &&
												error.response.status === 401
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
				))}
			</Stack>
		</Box>
	);
};

export default ForumListPage;
