import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
  alpha
} from "@mui/material";

import {
  Users, UserPlus, ShieldPlus, Activity, LogOut,
  PlusCircle, List as ListIcon, LayoutDashboard,
  MessagesSquare, ChevronRight
} from "lucide-react";

import { useUserContext } from "../Context/UserContext";
import { useQueryClient } from "@tanstack/react-query";

export const DRAWER_WIDTH = 280;
const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, dispatch } = useUserContext();
  const queryClient = useQueryClient();

  if (!user) return null;

  const userRole = user.userDetails.role;
  const isAdmin = userRole === "admin";

  const handleLogout = () => {
    queryClient.clear();
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const renderNavItem = (label: string, path: string, icon: React.ReactNode) => {
    const active = location.pathname === path;
    return (
      <ListItem disablePadding sx={{ mb: 0.5, px: 2 }}>
        <ListItemButton
          onClick={() => navigate(path)}
          sx={{
            borderRadius: "12px",
            py: 1.5,
            background: active ? MAIN_GRADIENT : "transparent",
            color: active ? "white" : "#94a3b8",
            "&:hover": {
              background: active ? MAIN_GRADIENT : alpha("#f1f5f9", 0.5),
              color: active ? "white" : "#1e293b",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
            {React.cloneElement(icon as React.ReactElement)}
          </ListItemIcon>
          <ListItemText
            primary={label}
            primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 700 }}
          />
          {active && <ChevronRight size={16} />}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        borderRight: "1px solid #f1f5f9",
        position: "fixed", // נשאר קבוע בצד
        left: 0,
        top: 0,
        overflow: "hidden", // ביטול גלילה בסיידבר
        zIndex: 1000,
      }}
    >
      {/* Logo Section */}
      <Box sx={{ p: "32px 24px", display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{
          background: MAIN_GRADIENT,
          width: 36, height: 36,
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <MessagesSquare size={20} color="#fff" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b", letterSpacing: "-0.5px" }}>
          HelpDesk
        </Typography>
      </Box>

      {/* Navigation Groups */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" sx={{ px: 4, mb: 2, display: "block", color: "#cbd5e1", fontWeight: 800, letterSpacing: 1 }}>
          GENERAL
        </Typography>
        <List disablePadding>
          {renderNavItem("Overview", `/${userRole}/dashboard`, <LayoutDashboard />)}
          {userRole === "customer" && renderNavItem("New Ticket", "/ticket/new", <PlusCircle />)}
          {renderNavItem("All Tickets", "/tickets", <ListIcon />)}
        </List>

        {isAdmin && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="caption" sx={{ px: 4, mb: 2, display: "block", color: "#cbd5e1", fontWeight: 800, letterSpacing: 1 }}>
              ADMIN TOOLS
            </Typography>
            <List disablePadding>
              {renderNavItem("User Directory", "/users", <Users />)}
              {renderNavItem("Create Account", "/createUser", <UserPlus />)}
              {renderNavItem("Priorities", "/createPriority", <ShieldPlus />)}
              {renderNavItem("Statuses", "/createStatus", <Activity />)}
            </List>
          </Box>
        )}
      </Box>

      {/* Footer Profile Section - תואם לתמונה */}
      <Box sx={{ p: 2, mb: 2 }}>
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1.5, mb: 2,
          p: 1.5, bgcolor: alpha("#f8fafc", 0.8), borderRadius: "14px"
        }}>
          <Avatar sx={{
            bgcolor: alpha("#9c27b0", 0.1),
            color: "#9c27b0",
            fontWeight: 800, width: 34, height: 34, fontSize: "0.8rem"
          }}>
            {user.userDetails.name[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b" }}>
              {user.userDetails.name}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
              {userRole}
            </Typography>
          </Box>
        </Box>

        {/* כפתור ה-Sign Out המעוצב */}
        <Button
          fullWidth
          onClick={handleLogout}
          startIcon={<LogOut size={18} />}
          sx={{
            color: "#ff4d4f",
            fontWeight: 800,
            justifyContent: "flex-start",
            px: 2,
            "&:hover": { bgcolor: "#fff1f0" }
          }}
        >
          SIGN OUT
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;