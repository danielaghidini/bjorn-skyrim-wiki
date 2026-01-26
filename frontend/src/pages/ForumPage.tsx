import React, { useState } from "react";
import {
	Typography,
	Box,
	Paper,
	TextField,
	Button,
	Avatar,
	Divider,
	IconButton,
	Stack,
	Chip,
} from "@mui/material";
import {
	MessageSquare,
	ThumbsUp,
	Send,
	PlusCircle,
	Filter,
} from "lucide-react";

interface Comment {
	id: string;
	author: string;
	text: string;
	date: string;
}

interface Post {
	id: string;
	author: string;
	title: string;
	content: string;
	date: string;
	category: string;
	likes: number;
	comments: Comment[];
}

const ForumPage: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([
		{
			id: "1",
			author: "Dovahkiin99",
			title: "Suggestion: Bjorn and Serana Interaction",
			content:
				"I'd love to see Bjorn have some unique bickering or comments when traveling together with Serana. They are both such strong personalities!",
			date: "2024-01-20",
			category: "Suggestion",
			likes: 12,
			comments: [
				{
					id: "c1",
					author: "NordicFan",
					text: "Great idea! Serana's cynicism would clash well with Bjorn's honor.",
					date: "2024-01-21",
				},
			],
		},
		{
			id: "2",
			author: "ShieldMaiden",
			title: "Story: The Battle of Whiterun with Bjorn",
			content:
				"Just finished the Civil War questline with Bjorn. His commentary during the siege was epic. He really felt like a brother-in-arms.",
			date: "2024-01-18",
			category: "Story",
			likes: 25,
			comments: [],
		},
	]);

	const [newPostTitle, setNewPostTitle] = useState("");
	const [newPostContent, setNewPostContent] = useState("");
	const [showNewPost, setShowNewPost] = useState(false);

	const handleCreatePost = () => {
		if (!newPostTitle || !newPostContent) return;

		const newPost: Post = {
			id: Date.now().toString(),
			author: "You",
			title: newPostTitle,
			content: newPostContent,
			date: new Date().toISOString().split("T")[0],
			category: "Suggestion",
			likes: 0,
			comments: [],
		};

		setPosts([newPost, ...posts]);
		setNewPostTitle("");
		setNewPostContent("");
		setShowNewPost(false);
	};

	return (
		<Box sx={{ py: 8 }}>
			{/* Header */}
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
					Adventures' Tavern
				</Typography>
				<Typography
					variant="h6"
					sx={{
						color: "primary.main",
						fontFamily: "Alan Sans",
						opacity: 0.8,
					}}
				>
					Welcome to the forum! Share your suggestions and experiences
					here.
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
					sx={{
						fontWeight: "bold",
					}}
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

			{/* Post Feed */}
			<Stack spacing={4}>
				{posts.map((post) => (
					<Paper
						key={post.id}
						sx={{
							p: 3,
							bgcolor: "rgba(21, 25, 33, 0.8)",
							border: "1px solid rgba(79, 195, 247, 0.1)",
							borderRadius: 2,
							transition: "border-color 0.3s ease",
							"&:hover": {
								borderColor: "rgba(79, 195, 247, 0.4)",
							},
						}}
					>
						{/* Post Header */}
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								mb: 2,
							}}
						>
							<Stack
								direction="row"
								spacing={2}
								alignItems="center"
							>
								<Avatar
									sx={{
										bgcolor: "secondary.main",
										width: 32,
										height: 32,
									}}
								>
									{post.author[0]}
								</Avatar>
								<Box>
									<Typography
										variant="subtitle2"
										sx={{
											color: "#ffffff",
											fontWeight: "bold",
										}}
									>
										{post.author}
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: "text.secondary" }}
									>
										{post.date}
									</Typography>
								</Box>
							</Stack>
							<Chip
								label={post.category}
								size="small"
								variant="outlined"
								color={
									post.category === "Suggestion"
										? "primary"
										: "secondary"
								}
								sx={{ borderRadius: 1, fontSize: "0.7rem" }}
							/>
						</Box>

						{/* Post Content */}
						<Typography
							variant="h5"
							sx={{
								mb: 1,
								color: "#ffffff",
								fontFamily: "Alan Sans",
								fontWeight: "bold",
							}}
						>
							{post.title}
						</Typography>
						<Typography
							variant="body1"
							sx={{
								color: "#ffffff",
								opacity: 0.9,
								lineHeight: 1.6,
								mb: 3,
							}}
						>
							{post.content}
						</Typography>

						<Divider
							sx={{
								mb: 2,
								borderColor: "rgba(255,255,255,0.05)",
							}}
						/>

						{/* Post Actions */}
						<Stack direction="row" spacing={3} alignItems="center">
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.5,
									color: "text.primary",
								}}
							>
								<IconButton
									size="small"
									sx={{ color: "primary.main" }}
								>
									<ThumbsUp size={18} />
								</IconButton>
								<Typography variant="body2">
									{post.likes}
								</Typography>
							</Box>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.5,
									color: "text.primary",
								}}
							>
								<MessageSquare
									size={18}
									style={{ opacity: 0.6 }}
								/>
								<Typography variant="body2">
									{post.comments.length}
								</Typography>
							</Box>
						</Stack>

						{/* Comments List */}
						{post.comments.length > 0 && (
							<Box
								sx={{
									mt: 3,
									pl: 2,
									borderLeft:
										"2px solid rgba(79, 195, 247, 0.2)",
								}}
							>
								{post.comments.map((comment) => (
									<Box key={comment.id} sx={{ mb: 2 }}>
										<Typography
											variant="subtitle2"
											sx={{
												color: "primary.main",
												fontSize: "0.8rem",
											}}
										>
											{comment.author}{" "}
											<Typography
												component="span"
												variant="caption"
												sx={{
													color: "text.secondary",
													ml: 1,
												}}
											>
												{comment.date}
											</Typography>
										</Typography>
										<Typography
											variant="body2"
											sx={{
												color: "#ffffff",
												opacity: 0.8,
											}}
										>
											{comment.text}
										</Typography>
									</Box>
								))}
							</Box>
						)}

						{/* Add Comment */}
						<Box sx={{ mt: 2, display: "flex", gap: 1 }}>
							<TextField
								fullWidth
								placeholder="Write a comment..."
								size="small"
								variant="standard"
								sx={{
									"& .MuiInputBase-input": {
										fontSize: "0.85rem",
										py: 1,
										color: "#ffffff",
									},
								}}
							/>
							<IconButton size="small" color="primary">
								<Send size={18} />
							</IconButton>
						</Box>
					</Paper>
				))}
			</Stack>
		</Box>
	);
};

export default ForumPage;
