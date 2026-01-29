import React, { useState } from "react";
import { Box, Button, Typography, Slide, Stack } from "@mui/material";
import { Cookie } from "lucide-react";

const CookieBanner: React.FC = () => {
	const [isVisible, setIsVisible] = useState(() => {
		if (typeof window !== "undefined") {
			return !localStorage.getItem("cookie_consent");
		}
		return false;
	});

	const handleAccept = () => {
		localStorage.setItem("cookie_consent", "true");
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
			<Box
				sx={{
					position: "fixed",
					bottom: 0,
					left: 0,
					right: 0,
					bgcolor: "rgba(10, 14, 23, 0.95)",
					borderTop: "1px solid rgba(34, 211, 238, 0.3)",
					p: 3,
					zIndex: 9999,
					backdropFilter: "blur(10px)",
					boxShadow: "0 -4px 20px rgba(0,0,0,0.5)",
				}}
			>
				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={2}
					alignItems="center"
					justifyContent="space-between"
					maxWidth="1200px"
					mx="auto"
				>
					<Stack direction="row" spacing={2} alignItems="center">
						<Cookie size={32} color="#22d3ee" />
						<Typography
							variant="body2"
							sx={{ color: "text.secondary", maxWidth: "800px" }}
						>
							We use cookies and local storage to enhance your
							experience, remember your preferences, and ensure
							the security of our realm. By continuing to use this
							site, you agree to our use of these technologies.
						</Typography>
					</Stack>
					<Stack direction="row" spacing={2}>
						<Button
							variant="outlined"
							onClick={handleAccept} // Technically "Decline" might just close it or limited mode, but simplistic approach is Ack.
							sx={{
								color: "text.secondary",
								borderColor: "rgba(255,255,255,0.2)",
							}}
						>
							Close
						</Button>
						<Button
							variant="contained"
							onClick={handleAccept}
							sx={{
								bgcolor: "#22d3ee",
								color: "#000",
								fontWeight: "bold",
								"&:hover": { bgcolor: "#06b6d4" },
							}}
						>
							Accept All
						</Button>
					</Stack>
				</Stack>
			</Box>
		</Slide>
	);
};

export default CookieBanner;
