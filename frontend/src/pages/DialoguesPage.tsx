import React, { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Box,
	TextField,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	CircularProgress,
	Alert,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Play, Pause } from "lucide-react";
import api from "../api/api";
import { SUPABASE_STORAGE_URL } from "../config/apiConfig";
import { getActorName } from "../utils/voiceMapping";

interface Dialogue {
	id: string;
	topicText: string;
	responseText: string;
	voiceType: string;
	fileName: string;
	audioFileName?: string;
	topicInfo: string;
}

const DialoguesPage: React.FC = () => {
	const [dialogues, setDialogues] = useState<Dialogue[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [playingId, setPlayingId] = useState<string | null>(null);
	const audioRef = React.useRef<HTMLAudioElement | null>(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState("");
	const [subtype, setSubtype] = useState<string[]>([]);
	const [city, setCity] = useState<string>("");
	const [emotion, setEmotion] = useState<string>("");
	const [questGroup, setQuestGroup] = useState<string>("");
	const [character, setCharacter] = useState<string>("");
	const [sceneNPC, setSceneNPC] = useState<string>("");
	const [context, setContext] = useState<string>("");

	const cities = [
		"Dawnstar",
		"Falkreath",
		"Ivarstead",
		"Markarth",
		"Morthal",
		"Riften",
		"Riverwood",
		"Solitude",
		"Whiterun",
		"Windhelm",
		"Winterhold",
	];

	const emotions = ["Anger", "Disgust", "Happy", "Sad", "Surprise"];
	const questGroups = [
		"Brotherhood",
		"CivilWar",
		"Companions",
		"Dawnguard",
		"Mages",
		"Main",
		"Thieves",
	];
	const characters = [
		"Adielle",
		"Aela",
		"Astrid",
		"Barni",
		"Brynjolf",
		"Delphine",
		"Delvin",
		"Esbern",
		"Galmar",
		"Gore",
		"Inigo",
		"Kaidan",
		"Lucien",
		"Lydia",
		"Narri",
		"Serana",
		"Sven",
		"Thruzar",
	];
	const contexts = ["Friendship", "Marriage", "Moods"];

	const filters = [
		{ id: "Thoughts", label: "Bjorn's Thoughts" },
		{ id: "Combat", label: "Combat" },
		{ id: "Hello", label: "Hello" },
		{ id: "Idle", label: "Idle" },
		{ id: "Names", label: "My Names" },
		{ id: "Scenes", label: "Scenes" },
	];

	const fetchDialogues = async () => {
		setLoading(true);
		// Stop any playing audio when changing filters
		if (audioRef.current) {
			audioRef.current.pause();
			setPlayingId(null);
		}
		try {
			const response = await api.get(`/api/dialogues`, {
				params: {
					page: page + 1,
					limit: rowsPerPage,
					search,
					voiceType:
						subtype.includes("Scenes") || sceneNPC
							? undefined
							: "DG04BjornVoice",
					subtype: sceneNPC
						? [...new Set([...subtype, "Scenes"])].join(",")
						: subtype.length > 0
							? subtype.join(",")
							: undefined,
					city: city || undefined,
					emotion: emotion || undefined,
					questGroup: questGroup || undefined,
					character: sceneNPC || character || undefined,
					context: context || undefined,
				},
			});
			setDialogues(response.data.data);
			setTotal(response.data.pagination.total);
			setLoading(false);
		} catch (err) {
			console.error(err);
			setError("Failed to load dialogues.");
			setLoading(false);
		}
	};

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			fetchDialogues();
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [
		page,
		rowsPerPage,
		search,
		subtype,
		city,
		emotion,
		questGroup,
		character,
		sceneNPC,
		context,
	]);

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handlePlayAudio = (dialogue: Dialogue) => {
		console.log("Play requested for:", dialogue);
		if (playingId === dialogue.id) {
			audioRef.current?.pause();
			setPlayingId(null);
		} else {
			const audioSource = dialogue.audioFileName || dialogue.fileName;
			console.log("Audio source identified:", audioSource);

			if (audioRef.current && audioSource) {
				// Ensure extension is .wav
				const fileName = audioSource.endsWith(".wav")
					? audioSource
					: audioSource.replace(/\.(xwm|fuz)$/i, ".wav");

				const audioUrl = `${SUPABASE_STORAGE_URL}/DG04BjornVoice/${fileName}`;
				console.log("Final audio URL:", audioUrl);

				audioRef.current.src = audioUrl;
				audioRef.current.play().catch((err) => {
					console.error("Audio playback error:", err);
					setError(`Could not play audio: ${fileName}`);
				});
				setPlayingId(dialogue.id);
			} else {
				console.error(
					"No valid audio source found for dialogue:",
					dialogue.id,
				);
				setError("Audio file reference missing.");
			}
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
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
				Bjorn Dialogues
			</Typography>
			<Typography
				variant="h5"
				gutterBottom
				sx={{
					fontFamily: "Alan Sans",
					color: "primary.main",
					mb: 4,
					textAlign: "center",
					maxWidth: "80%",
					mx: "auto",
				}}
			>
				"I'm a man of action, not words. But if you give me a mug of
				mead, I might just start spilling my secrets."
			</Typography>

			<Box mb={4}>
				<TextField
					fullWidth
					label="Search dialogues & scenes..."
					variant="outlined"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					sx={{ bgcolor: "background.paper", mb: 2 }}
				/>

				<Box
					sx={{
						display: "flex",
						gap: 1.5,
						flexWrap: "nowrap",
						mb: 2,
						width: "100%",
						overflowX: "auto",
						pt: 1, // Give space for the shrunk labels
						pb: 1, // Space for scrollbar
						"&::-webkit-scrollbar": {
							height: "6px",
						},
						"&::-webkit-scrollbar-thumb": {
							backgroundColor: "rgba(79, 195, 247, 0.2)",
							borderRadius: "3px",
						},
					}}
				>
					<FormControl
						sx={{ minWidth: 120, flexGrow: 1, flexShrink: 0 }}
					>
						<InputLabel id="type-group-label" shrink>
							Type
						</InputLabel>
						<Select
							labelId="type-group-label"
							id="type-select"
							multiple
							value={subtype}
							label="Type"
							size="small"
							onChange={(e) => {
								const value = e.target.value;
								const newValues =
									typeof value === "string"
										? value.split(",")
										: (value as string[]);

								if (newValues.includes("")) {
									setSubtype([]);
								} else {
									setSubtype(newValues);
								}
								setPage(0);
							}}
							sx={{ bgcolor: "background.paper" }}
							renderValue={(selected) => {
								if (selected.length === 0) return "All";
								return selected
									.map(
										(id) =>
											filters.find((f) => f.id === id)
												?.label || id,
									)
									.join(", ");
							}}
							displayEmpty
						>
							<MenuItem value="">
								<em>All</em>
							</MenuItem>
							{filters.map((f) => (
								<MenuItem key={f.id} value={f.id}>
									{f.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl
						sx={{ minWidth: 110, flexGrow: 1, flexShrink: 0 }}
					>
						<InputLabel id="city-group-label" shrink>
							City
						</InputLabel>
						<Select
							labelId="city-group-label"
							id="city-select"
							value={city}
							label="City"
							size="small"
							onChange={(e) => {
								setCity(e.target.value as string);
								setPage(0);
							}}
							sx={{ bgcolor: "background.paper" }}
							displayEmpty
						>
							<MenuItem value="">
								<em>All</em>
							</MenuItem>
							{cities.map((c) => (
								<MenuItem key={c} value={c}>
									{c}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl
						sx={{ minWidth: 110, flexGrow: 1, flexShrink: 0 }}
					>
						<InputLabel id="emotion-group-label" shrink>
							Emotion
						</InputLabel>
						<Select
							labelId="emotion-group-label"
							id="emotion-select"
							value={emotion}
							label="Emotion"
							size="small"
							onChange={(e) => {
								setEmotion(e.target.value as string);
								setPage(0);
							}}
							sx={{ bgcolor: "background.paper" }}
							displayEmpty
						>
							<MenuItem value="">
								<em>All</em>
							</MenuItem>
							{emotions.map((e) => (
								<MenuItem key={e} value={e}>
									{e}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl
						sx={{ minWidth: 120, flexGrow: 1, flexShrink: 0 }}
					>
						<InputLabel id="quest-group-label" shrink>
							Questline
						</InputLabel>
						<Select
							labelId="quest-group-label"
							id="quest-select"
							value={questGroup}
							label="Questline"
							size="small"
							onChange={(e) => {
								setQuestGroup(e.target.value as string);
								setPage(0);
							}}
							sx={{ bgcolor: "background.paper" }}
							displayEmpty
						>
							<MenuItem value="">
								<em>All</em>
							</MenuItem>
							{questGroups.map((q) => (
								<MenuItem key={q} value={q}>
									{q}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl
						sx={{ minWidth: 120, flexGrow: 1, flexShrink: 0 }}
					>
						<InputLabel id="char-group-label" shrink>
							Characters
						</InputLabel>
						<Select
							labelId="char-group-label"
							id="char-select"
							value={character}
							label="Characters"
							size="small"
							onChange={(e) => {
								setCharacter(e.target.value as string);
								setPage(0);
							}}
							sx={{ bgcolor: "background.paper" }}
							displayEmpty
						>
							<MenuItem value="">
								<em>All</em>
							</MenuItem>
							{characters.map((c) => (
								<MenuItem key={c} value={c}>
									{c}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl
						sx={{ minWidth: 130, flexGrow: 1, flexShrink: 0 }}
					>
						<InputLabel id="scene-npc-label" shrink>
							Scene with...
						</InputLabel>
						<Select
							labelId="scene-npc-label"
							id="scene-npc-select"
							value={sceneNPC}
							label="Scene with..."
							size="small"
							onChange={(e) => {
								setSceneNPC(e.target.value as string);
								setPage(0);
							}}
							sx={{ bgcolor: "background.paper" }}
							displayEmpty
						>
							<MenuItem value="">
								<em>No NPC</em>
							</MenuItem>
							{characters.map((c) => (
								<MenuItem key={c} value={c}>
									{c}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl
						sx={{ minWidth: 110, flexGrow: 1, flexShrink: 0 }}
					>
						<InputLabel id="context-group-label" shrink>
							Context
						</InputLabel>
						<Select
							labelId="context-group-label"
							id="context-select"
							value={context}
							label="Context"
							size="small"
							onChange={(e) => {
								setContext(e.target.value as string);
								setPage(0);
							}}
							sx={{ bgcolor: "background.paper" }}
							displayEmpty
						>
							<MenuItem value="">
								<em>All</em>
							</MenuItem>
							{contexts.map((c) => (
								<MenuItem key={c} value={c}>
									{c}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Box
						sx={{
							display: "flex",
							alignItems: "stretch",
							flexShrink: 0,
							flexGrow: 0,
						}}
					>
						<Button
							variant="outlined"
							color="primary"
							startIcon={<DeleteIcon />}
							onClick={() => {
								setSubtype([]);
								setCity("");
								setEmotion("");
								setQuestGroup("");
								setCharacter("");
								setSceneNPC("");
								setContext("");
								setSearch("");
								setPage(0);
							}}
							sx={{
								height: "40px",
								borderColor: "rgba(79, 195, 247, 0.4)",
								"&:hover": {
									borderColor: "rgba(79, 195, 247, 0.8)",
									bgcolor: "rgba(79, 195, 247, 0.05)",
								},
								borderRadius: 1,
								textTransform: "none",
								px: 2,
								fontSize: "0.85rem",
							}}
						>
							Clear
						</Button>
					</Box>
				</Box>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Paper
				sx={{
					width: "100%",
					overflow: "hidden",
					border: "1px solid rgba(79, 195, 247, 0.2)",
				}}
			>
				<audio
					ref={audioRef}
					onEnded={() => setPlayingId(null)}
					style={{ display: "none" }}
				/>
				{loading ? (
					<Box p={4} textAlign="center">
						<CircularProgress />
					</Box>
				) : (
					<TableContainer sx={{ maxHeight: 600 }}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									<TableCell sx={{ fontWeight: "bold" }}>
										{subtype.includes("Scenes") || sceneNPC
											? "Speaker"
											: "Player Topic"}
									</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>
										Response
									</TableCell>
									<TableCell
										sx={{
											fontWeight: "bold",
											width: 80,
											textAlign: "center",
										}}
									>
										Audio
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{dialogues
									.filter(
										(row) =>
											!/^===.+===$/.test(
												row.responseText,
											),
									)
									.map((row) => (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={row.id}
										>
											<TableCell sx={{ maxWidth: 300 }}>
												{subtype.includes("Scenes") ||
												sceneNPC
													? getActorName(
															row.voiceType,
														)
													: row.topicText || "—"}
											</TableCell>
											<TableCell>
												{row.responseText}
											</TableCell>
											<TableCell align="center">
												{row.voiceType ===
													"DG04BjornVoice" &&
													(row.audioFileName ||
														row.fileName) && (
														<Button
															variant={
																playingId ===
																row.id
																	? "contained"
																	: "outlined"
															}
															size="small"
															onClick={() =>
																handlePlayAudio(
																	row,
																)
															}
															startIcon={
																playingId ===
																row.id ? (
																	<Pause
																		size={
																			16
																		}
																	/>
																) : (
																	<Play
																		size={
																			16
																		}
																	/>
																)
															}
															sx={{
																minWidth:
																	"90px",
																textTransform:
																	"none",
																borderRadius:
																	"20px",
																animation:
																	playingId ===
																	row.id
																		? "pulse 2s infinite"
																		: "none",
																"@keyframes pulse":
																	{
																		"0%": {
																			boxShadow:
																				"0 0 0 0 rgba(79, 195, 247, 0.4)",
																		},
																		"70%": {
																			boxShadow:
																				"0 0 0 10px rgba(79, 195, 247, 0)",
																		},
																		"100%": {
																			boxShadow:
																				"0 0 0 0 rgba(79, 195, 247, 0)",
																		},
																	},
															}}
														>
															{playingId ===
															row.id
																? "Stop"
																: "Play"}
														</Button>
													)}
											</TableCell>
										</TableRow>
									))}
								{dialogues.length === 0 && (
									<TableRow>
										<TableCell colSpan={3} align="center">
											No dialogues found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				)}
				<TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={total}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Container>
	);
};

export default DialoguesPage;
