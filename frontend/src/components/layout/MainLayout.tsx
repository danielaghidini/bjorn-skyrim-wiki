import React from "react";
import {
	Box,
	AppBar,
	Toolbar,
	Typography,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Container,
	IconButton,
	Button,
	Stack,
	Divider,
	Avatar,
	Menu as MuiMenu,
	MenuItem,
} from "@mui/material";
import {
	Scroll,
	MessageSquare,
	Image,
	Menu,
	MessageCircle,
	Wrench,
	Music,
	Bot,
	User,
	LogOut,
	LayoutDashboard,
	ChevronDown,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const drawerWidth = 240;

const menuItems = [
	{
		text: "Quests",
		icon: <Scroll size={18} />,
		path: "/quests/bjorn",
	},
	{
		text: "Dialogues",
		icon: <MessageSquare size={18} />,
		path: "/dialogues",
	},
	{
		text: "Forum",
		icon: <MessageCircle size={18} />,
		path: "/forum",
	},
	{
		text: "Gallery",
		icon: <Image size={18} />,
		path: "/gallery",
	},
	{
		text: "Songs",
		icon: <Music size={18} />,
		path: "/songs",
	},
	{
		text: "Chatbot",
		icon: <Bot size={18} />,
		path: "/chat",
	},
];

const MainLayout: React.FC = () => {
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [userMenuAnchor, setUserMenuAnchor] =
		React.useState<null | HTMLElement>(null);
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setUserMenuAnchor(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setUserMenuAnchor(null);
	};

	const handleProfile = () => {
		handleUserMenuClose();
		navigate("/admin", { state: { tab: "profile" } });
	};

	const handleLogout = () => {
		handleUserMenuClose();
		logout();
		navigate("/");
	};

	const mobileDrawer = (
		<Box sx={{ p: 2, height: "100%", bgcolor: "background.default" }}>
			<Typography
				variant="h6"
				noWrap
				component="div"
				sx={{
					color: "#ffffff",
					fontWeight: "bold",
					fontFamily: "Bungee",
					mb: 3,
					textAlign: "center",
				}}
			>
				Bjorn Wiki
			</Typography>
			<List>
				{menuItems.map((item) => (
					<React.Fragment key={item.text}>
						<ListItem disablePadding sx={{ mb: 1 }}>
							<ListItemButton
								component={NavLink}
								to={item.path}
								onClick={() => setMobileOpen(false)}
								sx={{
									"&.active": {
										backgroundColor:
											"rgba(79, 195, 247, 0.1)",
										borderLeft: "3px solid",
										borderColor: "primary.main",
										"& .MuiListItemIcon-root, & .MuiListItemText-primary":
											{
												color: "primary.main",
											},
									},
								}}
							>
								<ListItemIcon sx={{ minWidth: 40 }}>
									{item.icon}
								</ListItemIcon>
								<ListItemText primary={item.text} />
							</ListItemButton>
						</ListItem>
					</React.Fragment>
				))}
			</List>

			<Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

			<List>
				{useAuthStore((state) => state.token) ? (
					<ListItem disablePadding>
						<ListItemButton
							component={NavLink}
							to="/admin"
							onClick={() => setMobileOpen(false)}
							sx={{
								color: "primary.main",
								fontWeight: "bold",
							}}
						>
							<ListItemIcon
								sx={{ minWidth: 40, color: "primary.main" }}
							>
								<LayoutDashboard size={18} />
							</ListItemIcon>
							<ListItemText primary="Dashboard" />
						</ListItemButton>
					</ListItem>
				) : (
					<ListItem disablePadding>
						<ListItemButton
							component={NavLink}
							to="/login"
							onClick={() => setMobileOpen(false)}
							sx={{
								color: "primary.main",
								fontWeight: "bold",
							}}
						>
							<ListItemIcon
								sx={{ minWidth: 40, color: "primary.main" }}
							>
								<Menu size={18} />
							</ListItemIcon>
							<ListItemText primary="Login" />
						</ListItemButton>
					</ListItem>
				)}
			</List>
		</Box>
	);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<AppBar
				position="fixed"
				sx={{
					bgcolor: "rgba(10, 13, 17, 0.9)",
					backdropFilter: "blur(8px)",
					boxShadow: "none",
					borderBottom: "1px solid rgba(79, 195, 247, 0.2)",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
			>
				<Container maxWidth="lg">
					<Toolbar
						disableGutters
						sx={{ justifyContent: "space-between" }}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								edge="start"
								onClick={handleDrawerToggle}
								sx={{ mr: 2, display: { sm: "none" } }}
							>
								<Menu />
							</IconButton>
							<Typography
								variant="h6"
								noWrap
								component={NavLink}
								to="/"
								sx={{
									color: "#ffffff",
									fontWeight: "bold",
									textDecoration: "none",
									fontFamily: "Bungee",
									letterSpacing: "0.1rem",
								}}
							>
								Bjorn Wiki
							</Typography>
						</Box>

						<Stack
							direction="row"
							spacing={1}
							sx={{ display: { xs: "none", sm: "flex" } }}
						>
							{menuItems.map((item) => (
								<Button
									key={item.text}
									component={NavLink}
									to={item.path}
									startIcon={item.icon}
									sx={{
										color: "text.secondary",
										px: 2,
										"&.active": {
											color: "primary.main",
											backgroundColor:
												"rgba(79, 195, 247, 0.05)",
										},
										"&:hover": {
											color: "primary.light",
										},
									}}
								>
									{item.text}
								</Button>
							))}
							<Box
								sx={{
									borderLeft:
										"1px solid rgba(255,255,255,0.1)",
									pl: 1,
									ml: 1,
									display: "flex",
									alignItems: "center",
								}}
							>
								{user ? (
									<>
										<Button
											onClick={handleUserMenuOpen}
											endIcon={<ChevronDown size={16} />}
											sx={{
												color: "text.secondary",
												textTransform: "none",
												"&:hover": {
													color: "primary.main",
												},
											}}
										>
											<Avatar
												src={user.avatar}
												alt={user.name || user.email}
												sx={{
													width: 28,
													height: 28,
													mr: 1,
													bgcolor: "primary.main",
													fontSize: "0.8rem",
												}}
											>
												{user.name
													?.charAt(0)
													?.toUpperCase() ||
													user.email
														?.charAt(0)
														?.toUpperCase()}
											</Avatar>
											{user.name ||
												user.email?.split("@")[0]}
										</Button>
										<MuiMenu
											anchorEl={userMenuAnchor}
											open={Boolean(userMenuAnchor)}
											onClose={handleUserMenuClose}
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "right",
											}}
											transformOrigin={{
												vertical: "top",
												horizontal: "right",
											}}
											PaperProps={{
												sx: {
													bgcolor:
														"rgba(21, 25, 33, 0.95)",
													border: "1px solid rgba(79, 195, 247, 0.2)",
													minWidth: 180,
												},
											}}
										>
											<MenuItem
												component={NavLink}
												to="/admin"
												onClick={handleUserMenuClose}
											>
												<ListItemIcon>
													<LayoutDashboard
														size={18}
													/>
												</ListItemIcon>
												<ListItemText>
													Dashboard
												</ListItemText>
											</MenuItem>
											<MenuItem onClick={handleProfile}>
												<ListItemIcon>
													<User size={18} />
												</ListItemIcon>
												<ListItemText>
													My Profile
												</ListItemText>
											</MenuItem>
											<Divider
												sx={{
													borderColor:
														"rgba(255,255,255,0.1)",
												}}
											/>
											<MenuItem
												onClick={handleLogout}
												sx={{ color: "error.main" }}
											>
												<ListItemIcon
													sx={{ color: "error.main" }}
												>
													<LogOut size={18} />
												</ListItemIcon>
												<ListItemText>
													Logout
												</ListItemText>
											</MenuItem>
										</MuiMenu>
									</>
								) : (
									<Button
										component={NavLink}
										to="/login"
										variant="outlined"
										size="small"
										sx={{
											borderColor:
												"rgba(79, 195, 247, 0.5)",
											color: "primary.main",
											"&:hover": {
												borderColor: "primary.main",
												bgcolor:
													"rgba(79, 195, 247, 0.1)",
											},
										}}
									>
										Login
									</Button>
								)}
							</Box>
						</Stack>
					</Toolbar>
				</Container>
			</AppBar>

			{/* Mobile Drawer */}
			<Box component="nav">
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					{mobileDrawer}
				</Drawer>
			</Box>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: { xs: 1, md: 3 },
					mt: "80px",
				}}
			>
				<Container maxWidth="lg">
					<Outlet />
				</Container>
			</Box>

			{/* Footer */}
			<Box
				component="footer"
				sx={{
					py: 6,
					mt: "auto",
					bgcolor: "rgba(10, 13, 17, 0.95)",
					borderTop: "1px solid rgba(79, 195, 247, 0.1)",
					textAlign: "center",
				}}
			>
				<Container maxWidth="lg">
					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={4}
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography
							variant="body2"
							sx={{
								color: "text.secondary",
								fontFamily: "Bungee",
								letterSpacing: 1,
							}}
						>
							Bjorn Wiki
						</Typography>

						<Stack direction="row" spacing={3}>
							<Button
								component={NavLink}
								to="/technical"
								sx={{
									color: "text.secondary",
									fontSize: "0.8rem",
									"&:hover": { color: "primary.main" },
								}}
								startIcon={<Wrench size={14} />}
							>
								Technical Info
							</Button>
							<Button
								component="a"
								href="https://ko-fi.com/bjorndev"
								target="_blank"
								sx={{
									color: "text.secondary",
									fontSize: "0.8rem",
									"&:hover": { color: "primary.main" },
								}}
							>
								Support on Ko-fi
							</Button>
						</Stack>

						<Typography
							variant="caption"
							sx={{ color: "text.secondary", opacity: 0.5 }}
						>
							&copy; {new Date().getFullYear()} Bjorn Mod Team.
							Not affiliated with Bethesda Game Studios.
						</Typography>
					</Stack>
				</Container>
			</Box>
		</Box>
	);
};

export default MainLayout;
