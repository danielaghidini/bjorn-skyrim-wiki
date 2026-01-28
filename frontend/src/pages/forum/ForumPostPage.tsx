import React, { useState, useEffect } from "react";
import {
	Typography,
	Box,
	Paper,
	Stack,
	Button,
	TextField,
	Divider,
	Avatar,
	Chip,
	CircularProgress,
} from "@mui/material";
import {
	ThumbsUp,
	MessageSquare,
	Send,
	ArrowLeft,
	Calendar,
	User,
	Trash2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import type { Post } from "../../types/forum";
import { forumService } from "../../data/forumService";

const ForumPostPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [post, setPost] = useState<Post | null>(null);
	const [newComment, setNewComment] = useState("");

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (id) {
			const fetchPost = async () => {
				setIsLoading(true);
				try {
					const foundPost = await forumService.getPostById(id);
					setPost(foundPost || null);
				} catch (error) {
					console.error("Failed to fetch post", error);
				} finally {
					setIsLoading(false);
				}
			};
			fetchPost();
		}
	}, [id]);

	const handleAddComment = async () => {
		if (!newComment.trim() || !post || !id) return;

		try {
			await forumService.addComment(id, newComment);

			const updatedPost = await forumService.getPostById(id);
			if (updatedPost) {
				setPost(updatedPost);
			}
			setNewComment("");
		} catch (error: any) {
			console.error("Failed to add comment:", error);
			if (error.response && error.response.status === 401) {
				navigate("/login", {
					state: {
						message: "You must be logged in to add a comment.",
					},
				});
			} else {
				alert("Failed to add comment. Please try again later.");
			}
		}
	};

	const handleLike = async () => {
		if (!post || !id) return;
		try {
			await forumService.toggleLike(id);
			// Verify: fetch updated post or optimistically increment
			const updatedPost = await forumService.getPostById(id);
			if (updatedPost) setPost(updatedPost);
		} catch (error: any) {
			console.error("Failed to like post", error);
			if (error.response && error.response.status === 401) {
				navigate("/login", {
					state: {
						message: "You must be logged in to like a post.",
					},
				});
			}
		}
	};

	const handleDelete = async () => {
		if (!post || !id) return;
		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				await forumService.deletePost(id);
				navigate("/forum");
			} catch (error) {
				console.error("Failed to delete post", error);
				alert("Failed to delete post");
			}
		}
	};

	if (isLoading) {
		return (
			<Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (!post) {
		return (
			<Box sx={{ py: 8, textAlign: "center" }}>
				<Typography variant="h5" color="text.secondary">
					Post not found
				</Typography>
				<Button
					startIcon={<ArrowLeft />}
					onClick={() => navigate("/forum")}
					sx={{ mt: 2 }}
				>
					Back to Tavern
				</Button>
			</Box>
		);
	}

	return (
		<Box sx={{ py: { xs: 4, md: 8 } }}>
			<Button
				startIcon={<ArrowLeft />}
				onClick={() => navigate("/forum")}
				sx={{ mb: 4, color: "text.secondary" }}
			>
				Back to Tavern
			</Button>

			<Paper
				sx={{
					p: { xs: 3, md: 5 },
					bgcolor: "rgba(21, 25, 33, 0.8)",
					border: "1px solid rgba(79, 195, 247, 0.1)",
					borderRadius: 2,
				}}
			>
				{/* Header */}
				<Box sx={{ mb: 4 }}>
					<Chip
						label={post.category}
						color={
							post.category === "Suggestion"
								? "primary"
								: "secondary"
						}
						size="small"
						sx={{ mb: 2, borderRadius: 1 }}
					/>
					<Typography
						variant="h3"
						sx={{
							color: "#ffffff",
							fontFamily: "Alan Sans",
							mb: 2,
						}}
					>
						{post.title}
					</Typography>
					<Stack
						direction="row"
						spacing={3}
						alignItems="center"
						sx={{ color: "text.secondary", fontSize: "0.9rem" }}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<User size={16} />
							<Typography variant="body2">
								{post.author}
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<Calendar size={16} />
							<Typography variant="body2">{post.date}</Typography>
						</Box>
					</Stack>

					{/* Author Actions */}
					{post.isAuthor && (
						<Button
							color="error"
							startIcon={<Trash2 size={18} />}
							onClick={handleDelete}
							sx={{ mt: 2 }}
						>
							Delete Post
						</Button>
					)}
				</Box>

				<Divider
					sx={{ mb: 4, borderColor: "rgba(255,255,255,0.05)" }}
				/>

				{/* Content */}
				<Typography
					variant="body1"
					sx={{
						color: "#e0e0e0",
						lineHeight: 1.8,
						fontSize: "1.1rem",
						mb: 6,
						whiteSpace: "pre-wrap",
					}}
				>
					{post.content}
				</Typography>

				{/* Actions */}
				<Stack direction="row" spacing={3} sx={{ mb: 6 }}>
					<Button
						startIcon={
							<ThumbsUp
								size={20}
								fill={post.isLiked ? "currentColor" : "none"}
							/>
						}
						sx={{
							color: post.isLiked
								? "primary.main"
								: "text.secondary",
							transition: "all 0.2s",
							transform: post.isLiked
								? "scale(1.05)"
								: "scale(1)",
						}}
						onClick={handleLike}
					>
						{post.likes} Likes
					</Button>
					<Button
						startIcon={<MessageSquare size={20} />}
						sx={{ color: "text.secondary" }}
					>
						{post.comments.length} Comments
					</Button>
				</Stack>

				{/* Comments Section */}
				<Box sx={{ bgcolor: "rgba(0,0,0,0.2)", p: 3, borderRadius: 2 }}>
					<Typography variant="h6" sx={{ mb: 3, color: "#fff" }}>
						Discussion
					</Typography>

					{/* New Comment */}
					<Box sx={{ display: "flex", gap: 2, mb: 4 }}>
						<Avatar sx={{ bgcolor: "primary.dark" }}>Y</Avatar>
						<Box sx={{ flexGrow: 1 }}>
							<TextField
								fullWidth
								multiline
								rows={2}
								placeholder="Add to the conversation..."
								variant="outlined"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								sx={{
									mb: 1,
									bgcolor: "rgba(255,255,255,0.05)",
								}}
							/>
							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-end",
								}}
							>
								<Button
									variant="contained"
									size="small"
									endIcon={<Send size={16} />}
									onClick={handleAddComment}
									disabled={!newComment.trim()}
								>
									Reply
								</Button>
							</Box>
						</Box>
					</Box>

					{/* List */}
					<Stack spacing={3}>
						{post.comments.map((comment) => (
							<Box
								key={comment.id}
								sx={{ display: "flex", gap: 2 }}
							>
								<Avatar
									sx={{
										width: 32,
										height: 32,
										bgcolor: "rgba(255,255,255,0.1)",
										fontSize: "0.8rem",
									}}
								>
									{comment.author[0]}
								</Avatar>
								<Box>
									<Stack
										direction="row"
										spacing={1}
										alignItems="center"
										sx={{ mb: 0.5 }}
									>
										<Typography
											variant="subtitle2"
											sx={{
												color: "primary.light",
												fontWeight: "bold",
											}}
										>
											{comment.author}
										</Typography>
										<Typography
											variant="caption"
											sx={{ color: "text.secondary" }}
										>
											{comment.date}
										</Typography>
									</Stack>
									<Typography
										variant="body2"
										sx={{ color: "#e0e0e0" }}
									>
										{comment.text}
									</Typography>
								</Box>
							</Box>
						))}
					</Stack>
				</Box>
			</Paper>
		</Box>
	);
};

export default ForumPostPage;
