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
		id: "1",
		title: "The Dragonborn Comes",
		description:
			"A classic Nordic ballad about the arrival of the Dovahkiin.",
		fileName: "dragonborn_comes.wav",
	},
	{
		id: "2",
		title: "Steel and Mead",
		description: "A rowdy tavern song celebrating the life of a mercenary.",
		fileName: "steel_and_mead.wav",
	},
	{
		id: "3",
		title: "Song of the Dragonborn (Bjorn's Version)",
		description: "Bjorn's unique take on the ancient dragon hymns.",
		fileName: "bjorn_dragon_song.wav",
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
		<Container maxWidth="md" sx={{ py: 8 }}>
			<Box textAlign="center" mb={8}>
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
					}}
				>
					Melodies and verses learned on the road to Bard's College
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
									p: 3,
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
										gap: 3,
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
											width: 60,
											height: 60,
										}}
									>
										{playingId === song.id ? (
											<Pause
												size={30}
												fill="currentColor"
											/>
										) : (
											<Play
												size={30}
												fill="currentColor"
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
					Bard Quest in Solitude.
				</Typography>
			</Box>
		</Container>
	);
};

export default SongsPage;
