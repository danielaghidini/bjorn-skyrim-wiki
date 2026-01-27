import React from "react";
import {
	Container,
	Typography,
	Box,
	Paper,
	List,
	ListItem,
	IconButton,
	Divider,
	useTheme,
} from "@mui/material";
import { Play, Pause, Music } from "lucide-react";

interface Song {
	id: string;
	title: string;
	description: string;
	fileName: string;
}

const songs: Song[] = [
	{
		id: "00",
		title: "The Dragonborn Comes",
		description: "Bjorn's raw rendition of the classic prophecy.",
		fileName: "00-TheDragonbornComes.wav",
	},
	{
		id: "01",
		title: "Steel And Mead",
		description: "A drinking song for those who live by the sword.",
		fileName: "01-SteelAndMead.wav",
	},
	{
		id: "02",
		title: "The Winter Kept Her Voice",
		description: "A melancholic ballad about loss and silence.",
		fileName: "02-TheWinterKeptHerVoice.wav",
	},
	{
		id: "03",
		title: "The Mead is Gone but the Fire Remains",
		description: "Reflecting on what stays when the party ends.",
		fileName: "03-TheMeadisGonebuttheFireRemains.wav",
	},
	{
		id: "04",
		title: "No Road Leads Back",
		description: "A song about moving forward when there is no return.",
		fileName: "04-NoRoadLeadsBack.wav",
	},
	{
		id: "05",
		title: "Where the Storm Ends",
		description: "Searching for peace in a land of turmoil.",
		fileName: "05-WheretheStormEnds.wav",
	},
	{
		id: "06",
		title: "By the Nine",
		description: "A hymn to the divines, sung with rough reverence.",
		fileName: "06-By the Nine.wav",
	},
	{
		id: "07",
		title: "The One With The Voice",
		description: "Honoring the power of the Thu'um.",
		fileName: "07-TheOneWithTheVoice.wav",
	},
];

const SongsPage: React.FC = () => {
	const theme = useTheme();
	const [playingId, setPlayingId] = React.useState<string | null>(null);
	const audioRef = React.useRef<HTMLAudioElement | null>(null);

	const handlePlaySync = (song: Song) => {
		if (playingId === song.id) {
			audioRef.current?.pause();
			setPlayingId(null);
		} else {
			if (audioRef.current) {
				audioRef.current.src = `/audio/songs/${song.fileName}`;
				audioRef.current
					.play()
					.catch((err) => console.error("Audio play failed:", err));
				setPlayingId(song.id);
			}
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
			<Box textAlign="center" mb={{ xs: 4, md: 8 }}>
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
					Bjorn's Repertoire
				</Typography>
				<Typography
					variant="h5"
					gutterBottom
					sx={{
						fontFamily: "Alan Sans",
						color: "primary.main",
						mb: 6,
						maxWidth: "80%",
						mx: "auto",
					}}
				>
					Well, I'm no bard, but I'll give it a go. Just don't expect
					the moons and stars, alright?
				</Typography>
			</Box>

			<Paper
				sx={{
					p: 0,
					bgcolor: "rgba(21, 25, 33, 0.8)",
					border: "1px solid rgba(79, 195, 247, 0.1)",
					overflow: "hidden",
				}}
			>
				<audio
					ref={audioRef}
					onEnded={() => setPlayingId(null)}
					style={{ display: "none" }}
				/>
				<List sx={{ p: 0 }}>
					{songs.map((song, index) => (
						<React.Fragment key={song.id}>
							{index > 0 && (
								<Divider sx={{ opacity: 0.1, mx: 2 }} />
							)}
							<ListItem
								sx={{
									p: { xs: 1.5, md: 3 },
									transition: "background-color 0.3s ease",
									"&:hover": {
										bgcolor: "rgba(79, 195, 247, 0.05)",
									},
								}}
							>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										width: "100%",
										gap: { xs: 1.5, md: 3 },
									}}
								>
									<IconButton
										onClick={() => handlePlaySync(song)}
										sx={{
											bgcolor:
												playingId === song.id
													? "primary.main"
													: "rgba(255,255,255,0.05)",
											color:
												playingId === song.id
													? "#000"
													: "primary.main",
											"&:hover": {
												bgcolor:
													playingId === song.id
														? "primary.main"
														: "rgba(79, 195, 247, 0.2)",
											},
											width: { xs: 48, md: 60 },
											height: { xs: 48, md: 60 },
										}}
									>
										{playingId === song.id ? (
											<Pause
												size={24}
												fill="currentColor"
												style={{
													width: "100%",
													height: "100%",
													padding: 4,
												}}
											/>
										) : (
											<Play
												size={24}
												fill="currentColor"
												style={{
													width: "100%",
													height: "100%",
													padding: 4,
												}}
											/>
										)}
									</IconButton>

									<Box sx={{ flexGrow: 1 }}>
										<Typography
											variant="h5"
											sx={{
												fontFamily: "'Cinzel', serif",
												color: "#ffffff",
												mb: 0.5,
											}}
										>
											{song.title}
										</Typography>
										<Typography
											variant="body2"
											sx={{
												color: "text.secondary",
												fontStyle: "italic",
											}}
										>
											{song.description}
										</Typography>
									</Box>

									<Music
										size={24}
										style={{
											opacity:
												playingId === song.id ? 1 : 0.2,
											color: theme.palette.primary.main,
											transition: "opacity 0.3s ease",
										}}
									/>
								</Box>
							</ListItem>
						</React.Fragment>
					))}
				</List>
			</Paper>

			<Box mt={6} textAlign="center">
				<Typography
					variant="body2"
					sx={{ color: "text.secondary", opacity: 0.6 }}
				>
					Tip: Bjorn's unique songs are unlocked after completing his
					personal quest, <strong>The Bard Within</strong>.
				</Typography>
			</Box>
		</Container>
	);
};

export default SongsPage;
