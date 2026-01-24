import { createTheme } from "@mui/material/styles";

const skyrimTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#4fc3f7", // Light Blue (Frost Blue)
			light: "#8bf6ff",
			dark: "#0093c4",
			contrastText: "#000000",
		},
		secondary: {
			main: "#4b6584", // Nordic Blue/Grey
			light: "#778ca3",
			dark: "#2d3436",
		},
		background: {
			default: "#0a0d11", // Slightly bluer dark background
			paper: "#151921",
		},
		text: {
			primary: "#ffffff",
			secondary: "#f8fafc", // Very light blue/grey
		},
		divider: "rgba(79, 195, 247, 0.2)",
	},
	typography: {
		fontFamily:
			'"Alan Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontFamily: '"Bungee", "sans-serif"',
			fontWeight: 400,
			letterSpacing: "0.05em",
			color: "#ffffff",
		},
		h2: {
			fontFamily: '"Bungee", "sans-serif"',
			fontWeight: 400,
			color: "#ffffff",
		},
		h3: {
			fontFamily: '"Bungee", "sans-serif"',
			fontWeight: 400,
			color: "#ffffff",
		},
		button: {
			textTransform: "none",
			fontWeight: 600,
		},
	},
	shape: {
		borderRadius: 8, // Softer edges
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 4,
					border: "1px solid transparent",
					"&.MuiButton-containedPrimary:hover": {
						backgroundColor: "#8bf6ff", // primary.light
						color: "#000000",
					},
					"&:hover": {
						borderColor: "#4fc3f7",
						backgroundColor: "rgba(79, 195, 247, 0.1)",
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
					border: "1px solid rgba(79, 195, 247, 0.1)",
				},
			},
		},
	},
});

export default skyrimTheme;
