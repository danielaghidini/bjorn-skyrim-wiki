import { useState, useRef } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	Avatar,
	Stack,
	Alert,
	Paper,
} from "@mui/material";
import { Upload, User, Lock } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/api";

const MAX_FILE_SIZE = 100 * 1024; // 100KB

const AdminProfile = () => {
	const { user, setUser } = useAuthStore();
	const [name, setName] = useState(user?.name || "");
	const [avatar, setAvatar] = useState(user?.avatar || "");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > MAX_FILE_SIZE) {
			setError(
				`Image too large. Maximum size is ${MAX_FILE_SIZE / 1024}KB`,
			);
			return;
		}

		if (!file.type.startsWith("image/")) {
			setError("Please select an image file");
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			const base64 = event.target?.result as string;
			setAvatar(base64);
			setError("");
		};
		reader.onerror = () => {
			setError("Failed to read file");
		};
		reader.readAsDataURL(file);
	};

	const handleSaveProfile = async () => {
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			const response = await api.put("/auth/profile", { name, avatar });
			setUser(response.data.user);
			setSuccess("Profile updated successfully!");
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	const handleChangePassword = async () => {
		setError("");
		setSuccess("");

		if (newPassword !== confirmPassword) {
			setError("New passwords do not match");
			return;
		}

		if (newPassword.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		setLoading(true);

		try {
			const response = await api.put("/auth/profile", {
				currentPassword,
				newPassword,
			});
			setUser(response.data.user);
			setSuccess("Password changed successfully!");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to change password");
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveAvatar = () => {
		setAvatar("");
	};

	return (
		<Box>
			<Typography
				variant="h5"
				gutterBottom
				sx={{ mb: 3, fontWeight: "bold" }}
			>
				Account Settings
			</Typography>

			{success && (
				<Alert
					severity="success"
					sx={{ mb: 3 }}
					onClose={() => setSuccess("")}
				>
					{success}
				</Alert>
			)}
			{error && (
				<Alert
					severity="error"
					sx={{ mb: 3 }}
					onClose={() => setError("")}
				>
					{error}
				</Alert>
			)}

			{/* Main Layout - Flex Row */}
			<Box
				sx={{
					display: "flex",
					gap: 3,
					flexDirection: { xs: "column", md: "row" },
				}}
			>
				{/* Left - Avatar Card (fixed width ~250px) */}
				<Paper
					sx={{
						p: 3,
						textAlign: "center",
						bgcolor: "rgba(21, 25, 33, 0.6)",
						border: "1px solid rgba(79, 195, 247, 0.1)",
						minWidth: { md: 250 },
						maxWidth: { md: 250 },
						alignSelf: "flex-start",
					}}
				>
					<input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={handleFileChange}
						style={{ display: "none" }}
					/>
					<Box
						onClick={() => fileInputRef.current?.click()}
						sx={{
							position: "relative",
							display: "inline-block",
							cursor: "pointer",
							mb: 2,
							"&:hover .avatar-overlay": { opacity: 1 },
						}}
					>
						<Avatar
							src={avatar}
							alt={name}
							sx={{
								width: 120,
								height: 120,
								bgcolor: "primary.main",
								fontSize: "3rem",
								mx: "auto",
							}}
						>
							{name?.charAt(0)?.toUpperCase() ||
								user?.email?.charAt(0)?.toUpperCase()}
						</Avatar>
						<Box
							className="avatar-overlay"
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								width: 120,
								height: 120,
								borderRadius: "50%",
								bgcolor: "rgba(0,0,0,0.6)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								opacity: 0,
								transition: "opacity 0.2s ease",
							}}
						>
							<Upload size={28} color="white" />
						</Box>
					</Box>

					<Typography variant="h6" sx={{ mb: 0.5 }}>
						{name || "No name set"}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mb: 1.5 }}
					>
						{user?.email}
					</Typography>

					<Typography
						variant="caption"
						sx={{
							bgcolor:
								user?.role === "ADMIN"
									? "primary.main"
									: "grey.700",
							px: 1.5,
							py: 0.5,
							borderRadius: 1,
							display: "inline-block",
						}}
					>
						{user?.role}
					</Typography>

					{avatar && (
						<Box sx={{ mt: 2 }}>
							<Typography
								variant="caption"
								onClick={handleRemoveAvatar}
								sx={{
									color: "error.main",
									cursor: "pointer",
									"&:hover": { textDecoration: "underline" },
								}}
							>
								Remove avatar
							</Typography>
						</Box>
					)}

					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ display: "block", mt: 2 }}
					>
						Click the avatar to upload
						<br />
						(Max 100KB)
					</Typography>
				</Paper>

				{/* Right - Forms (flex grow) */}
				<Box
					sx={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						gap: 3,
					}}
				>
					{/* Profile Info Card */}
					<Paper
						sx={{
							p: 3,
							bgcolor: "rgba(21, 25, 33, 0.6)",
							border: "1px solid rgba(79, 195, 247, 0.1)",
						}}
					>
						<Stack
							direction="row"
							spacing={1}
							alignItems="center"
							sx={{ mb: 3 }}
						>
							<User size={20} />
							<Typography variant="h6">
								Profile Information
							</Typography>
						</Stack>

						<Box
							sx={{
								display: "flex",
								gap: 2,
								flexWrap: "wrap",
								alignItems: "flex-start",
							}}
						>
							<TextField
								label="Display Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								size="small"
								placeholder="Enter your display name"
								sx={{ flex: 1, minWidth: 200 }}
							/>
							<TextField
								label="Email"
								value={user?.email || ""}
								size="small"
								disabled
								helperText="Email cannot be changed"
								sx={{ flex: 1, minWidth: 200 }}
							/>
							<Button
								variant="contained"
								onClick={handleSaveProfile}
								disabled={loading}
								sx={{ height: 40 }}
							>
								Save Changes
							</Button>
						</Box>
					</Paper>

					{/* Password Card */}
					<Paper
						sx={{
							p: 3,
							bgcolor: "rgba(21, 25, 33, 0.6)",
							border: "1px solid rgba(79, 195, 247, 0.1)",
						}}
					>
						<Stack
							direction="row"
							spacing={1}
							alignItems="center"
							sx={{ mb: 3 }}
						>
							<Lock size={20} />
							<Typography variant="h6">
								Change Password
							</Typography>
						</Stack>

						<Box
							sx={{
								display: "flex",
								gap: 2,
								flexWrap: "wrap",
								alignItems: "flex-start",
							}}
						>
							<TextField
								label="Current Password"
								type="password"
								value={currentPassword}
								onChange={(e) =>
									setCurrentPassword(e.target.value)
								}
								size="small"
								sx={{ flex: 1, minWidth: 150 }}
							/>
							<TextField
								label="New Password"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								size="small"
								sx={{ flex: 1, minWidth: 150 }}
							/>
							<TextField
								label="Confirm New Password"
								type="password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								size="small"
								sx={{ flex: 1, minWidth: 150 }}
							/>
							<Button
								variant="outlined"
								onClick={handleChangePassword}
								disabled={
									loading || !currentPassword || !newPassword
								}
								sx={{ height: 40 }}
							>
								Update Password
							</Button>
						</Box>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ mt: 1.5, display: "block" }}
						>
							Password must be at least 6 characters
						</Typography>
					</Paper>
				</Box>
			</Box>
		</Box>
	);
};

export default AdminProfile;
