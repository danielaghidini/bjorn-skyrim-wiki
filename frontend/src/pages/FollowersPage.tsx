import React from "react";
import {
	Typography,
	Box,
	Grid,
	Paper,
	CardContent,
	Avatar,
	Stack,
	Chip,
	Divider,
} from "@mui/material";
import { Sword, Ghost, Baby } from "lucide-react";

const followers = [
	{
		name: "Little Shadow",
		role: "Assassin",
		description:
			"A lethal shadow in the night. She excels at stealth and quick strikes, making her the perfect companion for those who prefer the subtle approach.",
		icon: <Ghost size={40} color="#4fc3f7" />,
		color: "#4fc3f7",
		traits: ["Stealth Expert", "Dagger Specialist", "Silent"],
	},
	{
		name: "Thruzar",
		role: "Orc Warrior",
		description:
			"A powerhouse on the battlefield. This Orc warrior values honor and strength above all else, always ready to stand at the frontline of any conflict.",
		icon: <Sword size={40} color="#ffffff" />,
		color: "#ffffff",
		traits: ["High Health", "Heavy Armor", "Two-Handed"],
	},
	{
		name: "Barni",
		role: "Young Companion",
		description:
			"A young boy who joined the journey. While not a warrior, his presence adds a unique dynamic to the group as he learns the ways of the world.",
		icon: <Baby size={40} color="#4fc3f7" />,
		color: "#4fc3f7",
		traits: ["Unique Interactions", "Story Reactive", "Vulnerable"],
	},
];

const FollowersPage: React.FC = () => {
	return (
		<Box sx={{ pb: 8 }}>
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
					Additional Followers
				</Typography>
				<Typography
					variant="h6"
					sx={{
						color: "primary.main",
						fontFamily: "Alan Sans",
						opacity: 0.8,
					}}
				>
					Meet the companions who joined Bjorn's journey through
					Skyrim.
				</Typography>
			</Box>

			<Grid container spacing={4}>
				{followers.map((follower) => (
					<Grid key={follower.name} size={{ xs: 12, md: 4 }}>
						<Paper
							sx={{
								height: "100%",
								p: 0,
								bgcolor: "rgba(21, 25, 33, 0.8)",
								border: "1px solid rgba(79, 195, 247, 0.1)",
								overflow: "hidden",
								transition:
									"transform 0.3s ease, border-color 0.3s ease",
								"&:hover": {
									transform: "translateY(-5px)",
									borderColor: "primary.main",
								},
							}}
						>
							<Box
								sx={{
									height: 120,
									background: `linear-gradient(135deg, ${follower.color}15 0%, rgba(13, 25, 41, 0.8) 100%)`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										bgcolor: "rgba(0,0,0,0.3)",
										border: `2px solid ${follower.color}33`,
									}}
								>
									{follower.icon}
								</Avatar>
							</Box>
							<CardContent
								sx={{ p: 3, pt: 4, textAlign: "center" }}
							>
								<Typography
									variant="h4"
									sx={{
										color: "#ffffff",
										mb: 1,
										fontFamily: "Alan Sans",
										fontWeight: "bold",
									}}
								>
									{follower.name}
								</Typography>
								<Chip
									label={follower.role}
									size="small"
									sx={{
										bgcolor: `${follower.color}22`,
										color: follower.color,
										fontWeight: "bold",
										mb: 3,
										borderRadius: 1,
									}}
								/>
								<Typography
									variant="body1"
									sx={{
										color: "#ffffff",
										opacity: 0.8,
										mb: 4,
										minHeight: "4.5rem",
									}}
								>
									{follower.description}
								</Typography>
								<Divider sx={{ mb: 3, opacity: 0.1 }} />
								<Stack
									direction="row"
									spacing={1}
									flexWrap="wrap"
									justifyContent="center"
									useFlexGap
								>
									{follower.traits.map((trait) => (
										<Chip
											key={trait}
											label={trait}
											variant="outlined"
											size="small"
											sx={{
												fontSize: "0.7rem",
												color: "text.secondary",
												borderColor:
													"rgba(255,255,255,0.1)",
											}}
										/>
									))}
								</Stack>
							</CardContent>
						</Paper>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default FollowersPage;
