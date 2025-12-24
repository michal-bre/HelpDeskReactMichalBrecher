import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";
import {
	AppBar,
	Box,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
	Toolbar,
	Typography,
	Avatar,
	Menu,
	MenuItem,
	Divider,
	Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Swal from "sweetalert2";

type Props = {
	children: React.ReactNode;
};

const DRAWER_WIDTH = 260;

export const AppShell: React.FC<Props> = ({ children }) => {
	const { user, dispatch } = useUserContext();
	const navigate = useNavigate();
	const location = useLocation();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

	const role = user?.userDetails?.role || "guest";
	const userName = user?.userDetails?.name || "User";

	const handleLogout = () => {
		Swal.fire({
			title: "Log Out?",
			text: "You will be logged out of your account.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#EF4444",
			cancelButtonColor: "#6B7280",
			confirmButtonText: "Log Out",
		}).then((result) => {
			if (result.isConfirmed) {
				dispatch({ type: "LOGOUT" });
				navigate("/login");
				Swal.fire({
					title: "Logged Out",
					text: "See you next time!",
					icon: "success",
					timer: 1500,
					showConfirmButton: false,
				});
			}
		});
	};

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setProfileMenuAnchor(event.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setProfileMenuAnchor(null);
	};

	// Navigation items by role
	const getNavItems = () => {
		const baseItems = [
			{ label: "Dashboard", icon: DashboardIcon, path: `/${role}/dashboard` },
		];

		if (role === "customer") {
			return [
				...baseItems,
				{ label: "My Tickets", icon: ConfirmationNumberIcon, path: "/tickets" },
			];
		}

		if (role === "agent" || role === "admin") {
			const agentItems = [
				...baseItems,
				{ label: "Tickets", icon: ConfirmationNumberIcon, path: "/tickets" },
			];

			if (role === "admin") {
				return [
					...agentItems,
					{ label: "Users", icon: PeopleIcon, path: "/admin/users" },
					{ label: "Settings", icon: SettingsIcon, path: "/admin/settings" },
				];
			}

			return agentItems;
		}

		return baseItems;
	};

	const navItems = getNavItems();

	const drawerContent = (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			{/* Logo/Title */}
			<Box sx={{ p: 2 }}>
				<Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
					Help Desk
				</Typography>
				<Typography variant="caption" sx={{ color: "text.secondary", textTransform: "capitalize" }}>
					{role} Account
				</Typography>
			</Box>

			<Divider />

			{/* Navigation */}
			<List sx={{ flex: 1, p: 1 }}>
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = location.pathname === item.path;
					return (
						<ListItemButton
							key={item.path}
							selected={isActive}
							onClick={() => {
								navigate(item.path);
								setDrawerOpen(false);
							}}
						>
							<ListItemIcon>
								<Icon />
							</ListItemIcon>
							<ListItemText primary={item.label} />
						</ListItemButton>
					);
				})}
			</List>

			<Divider />

			{/* User Info */}
			<Box sx={{ p: 2 }}>
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
						{userName[0]?.toUpperCase()}
					</Avatar>
					<Box sx={{ minWidth: 0, flex: 1 }}>
						<Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
							{userName}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{role}
						</Typography>
					</Box>
				</Stack>
			</Box>
		</Box>
	);

	return (
		<Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
			{/* AppBar */}
			<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<Toolbar>
					<IconButton
						color="inherit"
						edge="start"
						onClick={() => setDrawerOpen(true)}
						sx={{ mr: 2, display: { sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>

					<Box sx={{ flex: 1 }} />

					<Stack direction="row" spacing={2} alignItems="center">
						<IconButton
							onClick={handleProfileMenuOpen}
							size="small"
							sx={{ ml: 2 }}
						>
							<Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
								{userName[0]?.toUpperCase()}
							</Avatar>
						</IconButton>

						<Menu
							anchorEl={profileMenuAnchor}
							open={Boolean(profileMenuAnchor)}
							onClose={handleProfileMenuClose}
							anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							transformOrigin={{ vertical: "top", horizontal: "right" }}
						>
							<MenuItem disabled>
								<Typography variant="body2" sx={{ fontWeight: 600 }}>
									{userName}
								</Typography>
							</MenuItem>
							<Divider />
							<MenuItem onClick={handleLogout}>
								<LogoutIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
								Log Out
							</MenuItem>
						</Menu>
					</Stack>
				</Toolbar>
			</AppBar>

			{/* Desktop Drawer */}
			<Drawer
				variant="permanent"
				sx={{
					width: DRAWER_WIDTH,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: DRAWER_WIDTH,
						boxSizing: "border-box",
						mt: 8,
					},
					display: { xs: "none", sm: "block" },
				}}
			>
				{drawerContent}
			</Drawer>

			{/* Mobile Drawer */}
			<Drawer
				anchor="left"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				sx={{ display: { xs: "block", sm: "none" } }}
			>
				<Box sx={{ width: DRAWER_WIDTH }}>
					<Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
						<IconButton onClick={() => setDrawerOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>
					{drawerContent}
				</Box>
			</Drawer>

			{/* Main Content */}
			<Box
				component="main"
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					pt: 10,
					pb: 4,
				}}
			>
				<Container maxWidth="lg" sx={{ flex: 1 }}>
					{children}
				</Container>
			</Box>
		</Box>
	);
};

export default AppShell;