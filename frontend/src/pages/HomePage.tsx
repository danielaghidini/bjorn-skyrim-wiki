import React from "react";
import {
	Typography,
	Box,
	Paper,
	Grid,
	Button,
	List,
	ListItem,
	ListItemText,
	Divider,
	Card,
	CardContent,
	CardActionArea,
} from "@mui/material";
import {
	Shield,
	Scroll,
	MessageCircle,
	MessageSquare,
	Image as ImageIcon,
	ArrowRight,
	Palette,
	Music,
} from "lucide-react";
import { Link } from "react-router-dom";

// Swiper imports - use bundle CSS for compatibility
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

const carouselImages = [
	"/carousel_1.jpg",
	"/carousel_2.jpg",
	"/carousel_3.jpg",
];

const hubItems = [
	{
		title: "Bjorn Quests",
		description: "Specific mod quests and Bjorn's personal redemption arc.",
		icon: <Scroll size={40} color="#4fc3f7" />,
		path: "/quests/bjorn",
		category: "Mod Content",
	},
	{
		title: "Dialogues",
		description: "Explore over 4500 lines of fully voiced Nordic wisdom.",
		icon: <MessageSquare size={40} color="#4fc3f7" />,
		path: "/dialogues",
		category: "Lore",
	},
	{
		title: "Adventures' Tavern",
		description:
			"Join the community to share suggestions and your own tales.",
		icon: <MessageCircle size={40} color="#4fc3f7" />,
		path: "/forum",
		category: "Community",
	},
	{
		title: "Fan Art",
		description: "See the amazing art created by the community.",
		icon: <Palette size={40} color="#ffffff" />,
		path: "/fan-art",
		category: "Visuals",
	},
	{
		title: "Gallery",
		description: "Official screenshots and media from Bjorn's journey.",
		icon: <ImageIcon size={40} color="#4fc3f7" />,
		path: "/media",
		category: "Visuals",
	},
	{
		title: "Bjorn's Songs",
		description:
			"Listen to the melodies and verses Bjorn learned as a bard.",
		icon: <Music size={40} color="#ffffff" />,
		path: "/songs",
		category: "Lore",
	},
];

const HomePage: React.FC = () => {
	return (
		<Box sx={{ pb: 8 }}>
			{/* Hero Carousel Section */}
			<Box
				sx={{
					position: "relative",
					width: "100%",
					height: { xs: "200px", md: "550px" },
					borderRadius: 2,
					overflow: "hidden",
					mb: 6,
					boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
					border: "1px solid rgba(255, 255, 255, 0.1)",
					"& .swiper": {
						width: "100%",
						height: "100%",
					},
					"& .swiper-button-next, & .swiper-button-prev": {
						color: "#ffffff",
					},
					"& .swiper-pagination-bullet-active": {
						backgroundColor: "#ffffff",
					},
				}}
			>
				<Swiper
					modules={[Navigation, Pagination, Autoplay]}
					spaceBetween={0}
					slidesPerView={1}
					navigation
					pagination={{ clickable: true }}
					autoplay={{ delay: 5000, disableOnInteraction: false }}
					loop={true}
				>
					{carouselImages.map((src, index) => (
						<SwiperSlide key={index}>
							<Box
								component="img"
								src={src}
								alt={`Bjorn Carousel Image ${index + 1}`}
								sx={{
									width: "100%",
									height: "100%",
									objectFit: { xs: "contain", md: "cover" },
								}}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</Box>

			{/* Intro Section */}
			<Grid container spacing={6} sx={{ mb: { xs: 4, md: 8 } }}>
				<Grid size={{ xs: 12, md: 7 }}>
					<Typography
						variant="h2"
						component="h1"
						gutterBottom
						sx={{
							fontFamily: "Bungee",
							color: "#ffffff",
							mb: 1,
						}}
					>
						I'm Bjorn.
					</Typography>
					<Typography
						variant="h6"
						gutterBottom
						sx={{
							fontFamily: "Alan Sans",
							color: "primary.main",
							mb: 4,
							maxWidth: "100%",
							mx: "auto",
						}}
					>
						Looking for someone to watch your back? I can do it.
					</Typography>
					<Typography
						variant="body1"
						paragraph
						sx={{
							fontSize: "1.1rem",
							lineHeight: 1.8,
							color: "#ffffff",
							opacity: 0.9,
						}}
					>
						Bjorn is not just another rough mercenary of Skyrim.
						Despite his scars and serious gaze, there is more to
						this Nord than meets the eye. Born and raised in the
						frigid regions of Skyrim, Bjorn's life has never been
						easy. From the tragic loss of his family to the harsh
						realities of the mercenary life, nothing has been able
						to dampen his spirit in his fight for justice.
					</Typography>
					<Typography
						variant="body1"
						paragraph
						sx={{
							fontSize: "1.1rem",
							lineHeight: 1.8,
							color: "#ffffff",
							opacity: 0.9,
						}}
					>
						He strives to make Skyrim a better place for all, even
						if it means shedding blood along the way. As long as he
						has your trust, Bjorn will maintain his loyalty, always
						ready to lend a hand. Though he has a troubled past, he
						still possesses a heart of gold that understands the
						meaning of honor.
					</Typography>
				</Grid>

				<Grid size={{ xs: 12, md: 5 }}>
					<Paper
						sx={{
							p: 4,
							backgroundColor: "rgba(21, 25, 33, 0.8)",
							borderRadius: 2,
							height: "100%",
							border: "1px solid rgba(79, 195, 247, 0.2)",
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
							<Shield size={24} color="#4fc3f7" />
							<Typography variant="h5" sx={{ color: "#ffffff" }}>
								Bjorn Stats
							</Typography>
						</Box>
						<List sx={{ "& .MuiListItem-root": { px: 0 } }}>
							<ListItem>
								<ListItemText
									primary="Voice Acting"
									secondary="4500+ High Quality AI Generated Lines"
									primaryTypographyProps={{
										color: "primary.main",
									}}
									secondaryTypographyProps={{
										sx: { color: "#ffffff", opacity: 0.7 },
									}}
								/>
							</ListItem>
							<Divider
								sx={{
									my: 1,
									borderColor: "rgba(255,255,255,0.05)",
								}}
							/>
							<ListItem>
								<ListItemText
									primary="Quests"
									secondary="13 Quests with Hours of New Content"
									primaryTypographyProps={{
										color: "primary.main",
									}}
									secondaryTypographyProps={{
										sx: { color: "#ffffff", opacity: 0.7 },
									}}
								/>
							</ListItem>
							<Divider
								sx={{
									my: 1,
									borderColor: "rgba(255,255,255,0.05)",
								}}
							/>
							<ListItem>
								<ListItemText
									primary="Followers"
									secondary="+3 Unique Companions"
									primaryTypographyProps={{
										color: "primary.main",
									}}
									secondaryTypographyProps={{
										sx: { color: "#ffffff", opacity: 0.7 },
									}}
								/>
							</ListItem>
						</List>
						<Box sx={{ mt: 3 }}>
							<Button
								variant="contained"
								fullWidth
								sx={{ py: 1.5, fontWeight: "bold" }}
								component="a"
								href="https://www.nexusmods.com/skyrimspecialedition/mods/91652"
								target="_blank"
							>
								Download at Nexus
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>

			{/* Wiki Hub Section */}
			<Box sx={{ mb: { xs: 4, md: 8 } }}>
				<Typography
					variant="h3"
					gutterBottom
					sx={{
						fontSize: "2rem",
						mb: 4,
						textAlign: "center",
						color: "#ffffff",
					}}
				>
					Explore the Wiki
				</Typography>
				<Grid container spacing={3}>
					{hubItems.map((item, index) => (
						<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
							<Card
								sx={{
									height: "100%",
									backgroundColor: "rgba(13, 25, 41, 0.7)",
									border: "1px solid rgba(255,255,255,0.05)",
									transition:
										"transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
									"&:hover": {
										transform: "translateY(-5px)",
										borderColor: "primary.main",
										boxShadow:
											"0 0 20px rgba(79, 195, 247, 0.2)",
									},
								}}
							>
								<CardActionArea
									component={Link}
									to={item.path}
									sx={{ height: "100%", p: 1 }}
								>
									<CardContent
										sx={{ textAlign: "center", py: 4 }}
									>
										<Box
											sx={{
												mb: 3,
												display: "flex",
												justifyContent: "center",
											}}
										>
											{item.icon}
										</Box>
										<Typography
											variant="h5"
											gutterBottom
											sx={{
												color: "#ffffff",
												fontFamily: "Bungee",
												fontSize: "1.2rem",
											}}
										>
											{item.title}
										</Typography>
										<Typography
											variant="body2"
											sx={{
												color: "#ffffff",
												opacity: 0.7,
												mb: 2,
												minHeight: "3rem",
											}}
										>
											{item.description}
										</Typography>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "primary.main",
												gap: 1,
											}}
										>
											<Typography
												variant="button"
												sx={{ fontWeight: "bold" }}
											>
												Explore
											</Typography>
											<ArrowRight size={16} />
										</Box>
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>

			{/* Footnote / Call to Action */}
			<Paper
				sx={{
					p: { xs: 3, md: 6 },
					textAlign: "center",
					backgroundColor: "rgba(79, 195, 247, 0.1)",
					color: "#ffffff",
					borderRadius: 2,
					border: "1px solid rgba(79, 195, 247, 0.2)",
				}}
			>
				<Typography
					variant="h4"
					sx={{
						color: "primary.main",
						mb: 2,
						fontFamily: "Bungee",
						fontSize: { xs: "1.5rem", md: "2.125rem" },
					}}
				>
					Support the Project
				</Typography>
				<Typography
					variant="h6"
					sx={{
						mb: 4,
						fontFamily: "Alan Sans",
						fontWeight: 400,
						opacity: 0.8,
						maxWidth: "800px",
						mx: "auto",
					}}
				>
					Creating and maintaining mods like Bjorn takes time and
					effort, so any support you can offer is greatly appreciated!
					Thank you for considering supporting my work, and I hope you
					enjoy having Bjorn as your trusty follower!
				</Typography>
				<Button
					variant="contained"
					color="primary"
					size="large"
					sx={{
						fontWeight: "bold",
						fontSize: "1.1rem",
						px: 6,
						py: 2,
					}}
					component="a"
					href="https://ko-fi.com/bjorndev"
					target="_blank"
				>
					Support on Ko-fi
				</Button>
			</Paper>
		</Box>
	);
};

export default HomePage;
