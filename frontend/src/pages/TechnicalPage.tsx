import React from "react";
import {
	Typography,
	Box,
	Paper,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import {
	ShieldAlert,
	Download,
	Settings,
	CheckCircle2,
	XCircle,
} from "lucide-react";

const TechnicalPage: React.FC = () => {
	return (
		<Box sx={{ py: 8 }}>
			<Box sx={{ mb: 6, textAlign: "center" }}>
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
					Technical Info
				</Typography>
				<Typography
					variant="h5"
					gutterBottom
					sx={{
						fontFamily: "Alan Sans",
						color: "primary.main",
						mb: 6,
						textAlign: "center",
					}}
				>
					Behind the scenes of the Bjorn Follower project
				</Typography>
			</Box>

			<Grid container spacing={4}>
				{/* Requirements & Installation */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper
						sx={{
							p: 4,
							bgcolor: "rgba(21, 25, 33, 0.8)",
							border: "1px solid rgba(79, 195, 247, 0.1)",
							height: "100%",
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								mb: 3,
								gap: 2,
							}}
						>
							<Download size={32} color="#4fc3f7" />
							<Typography
								variant="h4"
								sx={{
									color: "#ffffff",
									fontFamily: "Alan Sans",
								}}
							>
								Installation
							</Typography>
						</Box>
						<Typography
							variant="body1"
							paragraph
							sx={{ color: "#ffffff", opacity: 0.9 }}
						>
							Bjorn is a standalone follower and does not require
							any additional mod frameworks to function. However,
							always ensure your game is up to date.
						</Typography>
						<List sx={{ color: "#ffffff" }}>
							<ListItem>
								<ListItemIcon>
									<CheckCircle2 size={20} color="#4fc3f7" />
								</ListItemIcon>
								<ListItemText primary="Compatible with Skyrim Special Edition and Anniversary Edition." />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<CheckCircle2 size={20} color="#4fc3f7" />
								</ListItemIcon>
								<ListItemText primary="Install via your favorite mod manager (MO2, Vortex)." />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<CheckCircle2 size={20} color="#4fc3f7" />
								</ListItemIcon>
								<ListItemText primary="Place late in the load order to ensure dialogue priority." />
							</ListItem>
						</List>
					</Paper>
				</Grid>

				{/* Compatibility */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper
						sx={{
							p: 4,
							bgcolor: "rgba(21, 25, 33, 0.8)",
							border: "1px solid rgba(79, 195, 247, 0.1)",
							height: "100%",
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								mb: 3,
								gap: 2,
							}}
						>
							<ShieldAlert size={32} color="#4fc3f7" />
							<Typography
								variant="h4"
								sx={{
									color: "#ffffff",
									fontFamily: "Alan Sans",
								}}
							>
								Compatibility
							</Typography>
						</Box>
						<Typography
							variant="body1"
							paragraph
							sx={{ color: "#ffffff", opacity: 0.9 }}
						>
							Bjorn uses custom voice lines and logic, making him
							highly compatible with almost everything.
						</Typography>
						<List sx={{ color: "#ffffff" }}>
							<ListItem>
								<ListItemIcon>
									<CheckCircle2 size={20} color="#4fc3f7" />
								</ListItemIcon>
								<ListItemText primary="Compatible with all follower limit mods (AFT, EFF)." />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<CheckCircle2 size={20} color="#4fc3f7" />
								</ListItemIcon>
								<ListItemText primary="Compatible with city overhauls and new lands." />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<XCircle size={20} color="#ff5252" />
								</ListItemIcon>
								<ListItemText primary="Conflicts with mods that alter the specific location where Bjorn is found (check Nexus for patches)." />
							</ListItem>
						</List>
					</Paper>
				</Grid>

				{/* Troubleshooting */}
				<Grid size={{ xs: 12 }}>
					<Paper
						sx={{
							p: 4,
							bgcolor: "rgba(21, 25, 33, 0.8)",
							border: "1px solid rgba(79, 195, 247, 0.1)",
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								mb: 3,
								gap: 2,
							}}
						>
							<Settings size={32} color="#4fc3f7" />
							<Typography
								variant="h4"
								sx={{
									color: "#ffffff",
									fontFamily: "Alan Sans",
								}}
							>
								Common Issues
							</Typography>
						</Box>
						<Grid container spacing={4}>
							<Grid size={{ xs: 12, md: 4 }}>
								<Typography
									variant="h6"
									color="primary"
									gutterBottom
								>
									No Dialogue?
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: "#ffffff", opacity: 0.8 }}
								>
									Save and reload your game right after
									meeting Bjorn. This often forces the Skyrim
									engine to register new dialogue scripts.
								</Typography>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<Typography
									variant="h6"
									color="primary"
									gutterBottom
								>
									Horse Issues?
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: "#ffffff", opacity: 0.8 }}
								>
									If Snow Storm gets lost, use the "Summon
									Bjorn" spell or wait 24 hours in a different
									cell.
								</Typography>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<Typography
									variant="h6"
									color="primary"
									gutterBottom
								>
									Quest Not Advancing?
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: "#ffffff", opacity: 0.8 }}
								>
									Ensure you don't have other high-priority
									world interaction mods conflicting with
									Bjorn's specific quest scenes.
								</Typography>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default TechnicalPage;
