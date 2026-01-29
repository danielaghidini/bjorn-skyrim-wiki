import { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Avatar,
	Chip,
	CircularProgress,
	Select,
	MenuItem,
	FormControl,
	IconButton,
	Tooltip,
} from "@mui/material";
import { Shield, Mail, Calendar, ShieldAlert, Trash2 } from "lucide-react";
import api from "../../api/api";

interface User {
	id: string;
	email: string;
	name: string | null;
	role: string;
	createdAt: string;
}

const AdminUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchUsers = async () => {
		try {
			const response = await api.get(`/api/admin/users`);
			setUsers(response.data);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleRoleChange = async (userId: string, newRole: string) => {
		try {
			await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
			fetchUsers();
		} catch (error) {
			console.error("Error updating role:", error);
			alert("Failed to update user role");
		}
	};

	const handleDeleteUser = async (userId: string) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this user? This action cannot be undone.",
			)
		)
			return;

		try {
			await api.delete(`/api/admin/users/${userId}`);
			fetchUsers();
		} catch (error) {
			console.error("Error deleting user:", error);
			alert("Failed to delete user");
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box>
			<Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
				<ShieldAlert size={32} color="#4fc3f7" />
				<Box>
					<Typography
						variant="h4"
						sx={{ color: "#fff", fontFamily: "Bungee" }}
					>
						User Management
					</Typography>
					<Typography variant="body2" sx={{ opacity: 0.6 }}>
						Manage registered users and their permissions
					</Typography>
				</Box>
			</Box>

			<TableContainer
				component={Paper}
				sx={{
					bgcolor: "rgba(21, 25, 33, 0.5)",
					borderRadius: "16px",
					border: "1px solid rgba(255, 255, 255, 0.05)",
					boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
				}}
			>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: "rgba(79, 195, 247, 0.05)" }}>
							<TableCell
								sx={{
									color: "primary.main",
									fontWeight: "bold",
								}}
							>
								User
							</TableCell>
							<TableCell
								sx={{
									color: "primary.main",
									fontWeight: "bold",
								}}
							>
								Email
							</TableCell>
							<TableCell
								sx={{
									color: "primary.main",
									fontWeight: "bold",
								}}
							>
								Joined
							</TableCell>
							<TableCell
								sx={{
									color: "primary.main",
									fontWeight: "bold",
								}}
							>
								Role
							</TableCell>
							<TableCell
								align="right"
								sx={{
									color: "primary.main",
									fontWeight: "bold",
								}}
							>
								Actions
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow
								key={user.id}
								sx={{
									"&:hover": {
										bgcolor: "rgba(255,255,255,0.02)",
									},
								}}
							>
								<TableCell>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 2,
										}}
									>
										<Avatar
											sx={{
												bgcolor:
													user.role === "ADMIN"
														? "error.main"
														: "primary.main",
											}}
										>
											{user.name
												? user.name[0].toUpperCase()
												: user.email[0].toUpperCase()}
										</Avatar>
										<Typography
											sx={{
												color: "#fff",
												fontWeight: 500,
											}}
										>
											{user.name || "Incognito Nord"}
										</Typography>
									</Box>
								</TableCell>
								<TableCell
									sx={{ color: "rgba(255,255,255,0.7)" }}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
										}}
									>
										<Mail size={14} /> {user.email}
									</Box>
								</TableCell>
								<TableCell
									sx={{ color: "rgba(255,255,255,0.7)" }}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
										}}
									>
										<Calendar size={14} />{" "}
										{new Date(
											user.createdAt,
										).toLocaleDateString()}
									</Box>
								</TableCell>
								<TableCell>
									<Chip
										label={user.role}
										size="small"
										color={
											user.role === "ADMIN"
												? "error"
												: "primary"
										}
										variant="outlined"
										icon={<Shield size={12} />}
										sx={{ fontWeight: "bold" }}
									/>
								</TableCell>
								<TableCell>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "flex-end",
											gap: 1,
										}}
									>
										<FormControl
											size="small"
											sx={{ width: 110 }}
										>
											<Select
												value={user.role}
												onChange={(e) =>
													handleRoleChange(
														user.id,
														e.target.value,
													)
												}
												sx={{
													color: "#fff",
													fontSize: "0.8rem",
													".MuiSelect-select": {
														py: "6px",
														pl: "12px",
													},
													".MuiOutlinedInput-notchedOutline":
														{
															borderColor:
																"rgba(255,255,255,0.2)",
														},
													"&:hover .MuiOutlinedInput-notchedOutline":
														{
															borderColor:
																"primary.main",
														},
												}}
											>
												<MenuItem value="USER">
													User
												</MenuItem>
												<MenuItem value="ADMIN">
													Admin
												</MenuItem>
											</Select>
										</FormControl>
										<Box
											sx={{
												width: 40,
												display: "flex",
												justifyContent: "center",
											}}
										>
											<Tooltip title="Delete User">
												<IconButton
													onClick={() =>
														handleDeleteUser(
															user.id,
														)
													}
													sx={{
														color: "rgba(255,255,255,0.3)",
														"&:hover": {
															color: "error.main",
															bgcolor:
																"rgba(211, 47, 47, 0.1)",
														},
													}}
												>
													<Trash2 size={18} />
												</IconButton>
											</Tooltip>
										</Box>
									</Box>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default AdminUsers;
