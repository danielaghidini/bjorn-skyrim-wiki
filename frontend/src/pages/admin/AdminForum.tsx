import { useState, useEffect } from "react";
import {
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	IconButton,
	Typography,
	Chip,
	Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { forumService } from "../../data/forumService";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

interface AdminForumProps {
	showOnlyMine?: boolean; // If true, only show posts by current user
}

const AdminForum = ({ showOnlyMine = false }: AdminForumProps) => {
	const [posts, setPosts] = useState<any[]>([]);
	const { user } = useAuthStore();
	const isAdmin = user?.role === "ADMIN";
	const navigate = useNavigate();

	const fetchPosts = async () => {
		try {
			const data = await forumService.getAllPosts();
			// Filter to user's posts only if showOnlyMine is true
			const filteredPosts = showOnlyMine
				? data.filter((p) => p.isAuthor)
				: data;
			setPosts(filteredPosts);
		} catch (error) {
			console.error("Failed to fetch posts", error);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, [showOnlyMine]);

	const handleDelete = async (e: React.MouseEvent, postId: string) => {
		e.stopPropagation(); // Prevent navigation when clicking delete
		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				await forumService.deletePost(postId);
				setPosts(posts.filter((p) => p.id !== postId));
			} catch (error) {
				alert("Failed to delete post.");
			}
		}
	};

	// Determine if user can manage a post (admin can manage all, user can manage their own)
	const canManage = (post: any) => {
		return isAdmin || post.isAuthor;
	};

	return (
		<List>
			{posts.length === 0 && (
				<Typography sx={{ p: 2, opacity: 0.5 }}>
					{showOnlyMine
						? "You haven't created any posts yet."
						: "No forum posts found."}
				</Typography>
			)}
			{posts.map((post) => (
				<ListItem
					key={post.id}
					disablePadding
					secondaryAction={
						canManage(post) && (
							<IconButton
								edge="end"
								aria-label="delete"
								onClick={(e) => handleDelete(e, post.id)}
							>
								<DeleteIcon />
							</IconButton>
						)
					}
					sx={{
						bgcolor: "rgba(255,255,255,0.02)",
						mb: 1,
						borderRadius: 1,
					}}
				>
					<ListItemButton
						onClick={() => navigate(`/forum/${post.slug}`)}
						sx={{ borderRadius: 1 }}
					>
						<ListItemText
							primary={
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}
								>
									<Typography
										variant="body1"
										sx={{ color: "primary.main" }}
									>
										{post.title}
									</Typography>
									<Chip
										label={post.category}
										size="small"
										color="primary"
										variant="outlined"
										sx={{ height: 20, fontSize: "0.7rem" }}
									/>
								</Box>
							}
							secondary={
								<>
									<Typography
										component="span"
										variant="body2"
										sx={{ display: "block" }}
									>
										By {post.author} •{" "}
										{post.comments.length} comments
									</Typography>
								</>
							}
						/>
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
};

export default AdminForum;
