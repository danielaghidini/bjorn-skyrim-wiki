import { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Paper,
	Grid,
	List,
	ListItem,
	ListItemText,
	CircularProgress,
	Button,
	Avatar,
	Tooltip,
	Fade,
} from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { Award, TrendingUp, Calendar, Layout, Info, Users } from "lucide-react";
import api from "../../api/api";

interface MetricData {
	totalViews: number;
	totalUsers: number;
	viewsByPath: { path: string; count: number }[];
	viewsByDay: { date: string; displayDate: string; count: number }[];
	topContributors: {
		name: string;
		total: number;
		breakdown: {
			articles: number;
			quests: number;
			fanArts: number;
		};
	}[];
}

const AdminMetrics = () => {
	const [metrics, setMetrics] = useState<MetricData | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchMetrics = async () => {
		try {
			const response = await api.get(`/api/admin/metrics`);
			setMetrics(response.data);
		} catch (error) {
			console.error("Error fetching metrics:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleClearMetrics = async () => {
		if (
			window.confirm("Are you sure you want to clear ALL access metrics?")
		) {
			try {
				await api.get(`/api/admin/metrics?clear=true`);
				fetchMetrics();
			} catch (error) {
				console.error("Error clearing metrics:", error);
			}
		}
	};

	useEffect(() => {
		fetchMetrics();
	}, []);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
				<CircularProgress
					thickness={2}
					size={60}
					sx={{ color: "primary.main" }}
				/>
			</Box>
		);
	}

	if (!metrics) {
		return (
			<Typography color="error" textAlign="center" sx={{ mt: 4 }}>
				Failed to load metrics data.
			</Typography>
		);
	}

	return (
		<Fade in={!loading} timeout={800}>
			<Box sx={{ p: { xs: 1, md: 0 } }}>
				{/* Top Actions */}
				<Box
					sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}
				>
					<Tooltip title="Reset all tracking data">
						<Button
							variant="outlined"
							color="error"
							startIcon={<DeleteSweepIcon />}
							onClick={handleClearMetrics}
							size="small"
							sx={{
								textTransform: "none",
								borderRadius: "8px",
								borderColor: "rgba(211, 47, 47, 0.4)",
								"&:hover": {
									bgcolor: "rgba(211, 47, 47, 0.1)",
									borderColor: "error.main",
								},
							}}
						>
							Clear Historical Data
						</Button>
					</Tooltip>
				</Box>

				<Grid container spacing={4}>
					{/* Primary Stats Row */}
					<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
						<Paper
							elevation={0}
							sx={{
								p: 4,
								height: "100%",
								textAlign: "center",
								background:
									"linear-gradient(135deg, rgba(79, 195, 247, 0.1) 0%, rgba(21, 25, 33, 0.8) 100%)",
								borderRadius: "16px",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								border: "1px solid rgba(79, 195, 247, 0.15)",
								boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
							}}
						>
							<Box
								sx={{
									bgcolor: "rgba(79, 195, 247, 0.1)",
									p: 1.5,
									borderRadius: "50%",
									mb: 1.5,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<TrendingUp size={24} color="#4fc3f7" />
							</Box>
							<Typography
								variant="overline"
								sx={{
									letterSpacing: 2,
									fontWeight: 700,
									color: "primary.light",
									opacity: 0.8,
									fontSize: "0.65rem",
								}}
							>
								TOTAL VIEWS
							</Typography>
							<Typography
								variant="h3"
								sx={{
									fontFamily: "Bungee",
									color: "#fff",
									my: 1,
									fontSize: { xs: "2.5rem", md: "3rem" },
									textShadow:
										"0 0 15px rgba(79, 195, 247, 0.3)",
								}}
							>
								{metrics.totalViews.toLocaleString()}
							</Typography>
							<Typography
								variant="caption"
								sx={{ opacity: 0.4, fontStyle: "italic" }}
							>
								All recorded hits
							</Typography>
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
						<Paper
							elevation={0}
							sx={{
								p: 4,
								height: "100%",
								textAlign: "center",
								background:
									"linear-gradient(135deg, rgba(139, 115, 85, 0.1) 0%, rgba(21, 25, 33, 0.8) 100%)",
								borderRadius: "16px",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								border: "1px solid rgba(139, 115, 85, 0.15)",
								boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
							}}
						>
							<Box
								sx={{
									bgcolor: "rgba(139, 115, 85, 0.1)",
									p: 1.5,
									borderRadius: "50%",
									mb: 1.5,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Users size={24} color="#e0d8c3" />
							</Box>
							<Typography
								variant="overline"
								sx={{
									letterSpacing: 2,
									fontWeight: 700,
									color: "#e0d8c3",
									opacity: 0.8,
									fontSize: "0.65rem",
								}}
							>
								REGISTERED USERS
							</Typography>
							<Typography
								variant="h3"
								sx={{
									fontFamily: "Bungee",
									color: "#fff",
									my: 1,
									fontSize: { xs: "2.5rem", md: "3rem" },
									textShadow:
										"0 0 15px rgba(139, 115, 85, 0.3)",
								}}
							>
								{metrics.totalUsers.toLocaleString()}
							</Typography>
							<Typography
								variant="caption"
								sx={{ opacity: 0.4, fontStyle: "italic" }}
							>
								Community members
							</Typography>
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, lg: 6 }}>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								height: "100%",
								bgcolor: "rgba(21, 25, 33, 0.5)",
								borderRadius: "16px",
								border: "1px solid rgba(255, 255, 255, 0.05)",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									mb: 3,
									gap: 1.5,
								}}
							>
								<Calendar size={20} color="#4fc3f7" />
								<Typography
									variant="h6"
									sx={{ fontWeight: 600, color: "#f0f0f0" }}
								>
									Views History (Last 7 Days)
								</Typography>
							</Box>

							<Box
								sx={{
									display: "flex",
									gap: 1.5,
									flexGrow: 1,
									alignItems: "flex-end",
									justifyContent: "space-between",
									mt: "auto",
								}}
							>
								{metrics.viewsByDay.map((day, idx) => {
									const maxCount = Math.max(
										...metrics.viewsByDay.map((d) =>
											Number(d.count),
										),
										1,
									);
									const heightPercent = Math.max(
										(Number(day.count) / maxCount) * 100,
										5,
									);

									return (
										<Box
											key={idx}
											sx={{
												flex: 1,
												textAlign: "center",
												height: "100%",
												display: "flex",
												flexDirection: "column",
												justifyContent: "flex-end",
											}}
										>
											<Tooltip
												title={`${day.count} views on ${day.date}`}
											>
												<Box
													sx={{
														height: `${heightPercent}%`,
														width: "100%",
														bgcolor:
															Number(day.count) >
															0
																? "primary.main"
																: "rgba(255,255,255,0.05)",
														borderRadius:
															"4px 4px 0 0",
														transition:
															"all 0.3s ease",
														cursor: "help",
														"&:hover": {
															bgcolor:
																"primary.light",
															transform:
																"scaleX(1.1)",
														},
													}}
												/>
											</Tooltip>
											<Paper
												sx={{
													mt: 1,
													p: 1,
													bgcolor: "rgba(0,0,0,0.3)",
													borderRadius: "4px",
													border: "1px solid rgba(255,255,255,0.02)",
												}}
											>
												<Typography
													variant="caption"
													sx={{
														display: "block",
														textTransform:
															"uppercase",
														fontSize: "0.6rem",
														fontWeight: 700,
														opacity: 0.6,
													}}
												>
													{
														day.displayDate?.split(
															",",
														)[0]
													}
												</Typography>
												<Typography
													variant="subtitle2"
													sx={{
														fontWeight: 700,
														color:
															Number(day.count) >
															0
																? "primary.main"
																: "inherit",
													}}
												>
													{day.count}
												</Typography>
											</Paper>
										</Box>
									);
								})}
							</Box>
						</Paper>
					</Grid>

					{/* Secondary Data Sections */}
					<Grid size={{ xs: 12, md: 7 }}>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								bgcolor: "rgba(21, 25, 33, 0.5)",
								borderRadius: "16px",
								border: "1px solid rgba(255, 255, 255, 0.05)",
								height: "100%",
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									mb: 3,
									gap: 1.5,
								}}
							>
								<Layout size={20} color="#4fc3f7" />
								<Typography
									variant="h6"
									sx={{ fontWeight: 600, color: "#f0f0f0" }}
								>
									Popular Content
								</Typography>
								<Tooltip title="Pages visited by unique and returning sessions">
									<Info
										size={14}
										style={{
											opacity: 0.4,
											marginLeft: "auto",
										}}
									/>
								</Tooltip>
							</Box>

							<List sx={{ p: 0 }}>
								{metrics.viewsByPath.map((item, idx) => (
									<ListItem
										key={idx}
										sx={{
											px: 2,
											py: 1.5,
											mb: 1,
											borderRadius: "8px",
											bgcolor: "rgba(255,255,255,0.02)",
											transition: "all 0.2s ease",
											"&:hover": {
												bgcolor:
													"rgba(79, 195, 247, 0.05)",
												transform: "translate(4px, 0)",
											},
										}}
									>
										<ListItemText
											primary={item.path}
											secondary={`${item.count} total views`}
											primaryTypographyProps={{
												sx: {
													fontFamily: "monospace",
													color: "primary.light",
													fontSize: "0.9rem",
												},
											}}
											secondaryTypographyProps={{
												sx: {
													opacity: 0.6,
													fontSize: "0.75rem",
												},
											}}
										/>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1.5,
											}}
										>
											<Box
												sx={{
													height: "6px",
													width: "60px",
													bgcolor:
														"rgba(255,255,255,0.1)",
													borderRadius: "10px",
													overflow: "hidden",
												}}
											>
												<Box
													sx={{
														height: "100%",
														width: `${(item.count / Math.max(metrics.totalViews, 1)) * 100}%`,
														bgcolor: "primary.main",
														borderRadius: "10px",
													}}
												/>
											</Box>
											<Typography
												variant="caption"
												sx={{
													opacity: 0.5,
													minWidth: "35px",
													textAlign: "right",
												}}
											>
												{Math.round(
													(item.count /
														Math.max(
															metrics.totalViews,
															1,
														)) *
														100,
												)}
												%
											</Typography>
										</Box>
									</ListItem>
								))}
								{metrics.viewsByPath.length === 0 && (
									<Typography
										sx={{
											p: 4,
											textAlign: "center",
											opacity: 0.4,
										}}
									>
										No access data recorded yet.
									</Typography>
								)}
							</List>
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, md: 5 }}>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								bgcolor: "rgba(21, 25, 33, 0.5)",
								borderRadius: "16px",
								border: "1px solid rgba(139, 115, 85, 0.2)",
								background:
									"linear-gradient(135deg, rgba(21, 25, 33, 0.8) 0%, rgba(139, 115, 85, 0.05) 100%)",
								height: "100%",
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									mb: 3,
									gap: 1.5,
									color: "#e0d8c3",
								}}
							>
								<Award size={20} />
								<Typography
									variant="h6"
									sx={{ fontWeight: 600 }}
								>
									Hall of Contributors
								</Typography>
							</Box>

							<Grid container spacing={2}>
								{metrics.topContributors.map((user, idx) => (
									<Grid size={{ xs: 12 }} key={idx}>
										<Paper
											sx={{
												p: 2,
												bgcolor: "rgba(0,0,0,0.4)",
												borderRadius: "12px",
												display: "flex",
												alignItems: "center",
												gap: 2,
												border: "1px solid rgba(255,255,255,0.03)",
												transition:
													"border-color 0.3s ease",
												"&:hover": {
													borderColor: "primary.main",
												},
											}}
										>
											<Avatar
												sx={{
													bgcolor: "primary.main",
													width: 48,
													height: 48,
													fontWeight: "bold",
													boxShadow:
														"0 4px 12px rgba(0,0,0,0.5)",
												}}
											>
												{user.name
													? user.name[0].toUpperCase()
													: "?"}
											</Avatar>
											<Box sx={{ flexGrow: 1 }}>
												<Typography
													variant="subtitle1"
													sx={{
														fontWeight: 700,
														color: "#f0f0f0",
													}}
												>
													{user.name ||
														"Anonymous User"}
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: "primary.light",
														display: "flex",
														alignItems: "center",
														gap: 0.5,
													}}
												>
													<TrendingUp size={12} />{" "}
													{user.total} Contributions
												</Typography>
											</Box>
											<Box textAlign="right">
												<Typography
													variant="caption"
													sx={{
														display: "block",
														opacity: 0.4,
														fontSize: "0.65rem",
													}}
												>
													{user.breakdown.articles}{" "}
													Art |{" "}
													{user.breakdown.fanArts} Pan
													| {user.breakdown.quests}{" "}
													Qst
												</Typography>
											</Box>
										</Paper>
									</Grid>
								))}
								{metrics.topContributors.length === 0 && (
									<Grid size={{ xs: 12 }}>
										<Typography
											sx={{
												p: 4,
												textAlign: "center",
												opacity: 0.4,
											}}
										>
											No data recorded yet.
										</Typography>
									</Grid>
								)}
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</Fade>
	);
};

export default AdminMetrics;
