import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ייבוא הניווט
import { useUsersQuery } from "../Query/UsersQuery";
import type { UserDetails } from "../Types/User";
import {
    Card,
    CardContent,
    Stack,
    Typography,
    Skeleton,
    Box,
    Avatar,
    TextField,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Container,
    Fade
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';

// מיפוי עיצוב לפי תפקידים
const roleThemeMap: Record<string, { color: string, label: string }> = {
    admin: { color: "#d32f2f", label: "Admin" },
    agent: { color: "#4facfe", label: "Agent" },
    customer: { color: "#9c27b0", label: "Customer" },
};

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

export const ShowUsers = () => {
    const navigate = useNavigate(); // הוק לביצוע הניווט
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    
    const usersQuery = useUsersQuery();
    
    // שימוש ב-as כדי למנוע שגיאת unknown מה-Query
    const users = (usersQuery.data || []) as UserDetails[];

    const handleRoleChange = (_: React.MouseEvent<HTMLElement>, newRole: string) => {
        if (newRole !== null) setRoleFilter(newRole);
    };

    // לוגיקת סינון משולבת
    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (usersQuery.isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Stack spacing={2}>
                    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 4 }} />
                    <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 3 }} />
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 6 }} />
                    ))}
                </Stack>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Header - עיצוב יוקרתי תואם */}
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ 
                    background: MAIN_GRADIENT, 
                    width: 64, 
                    height: 64,
                    boxShadow: '0 8px 16px rgba(79, 172, 254, 0.2)'
                }}>
                    <PeopleIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1.5px', color: '#1e293b' }}>
                        Team Members
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        Manage and view detailed profiles of your staff
                    </Typography>
                </Box>
            </Box>

            {/* Filters Section */}
            <Stack spacing={2} sx={{ mb: 6 }}>
                <TextField
                    fullWidth
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 5,
                            bgcolor: 'white',
                            height: 60,
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            border: '1px solid #f1f5f9'
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#4facfe', ml: 1 }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <ToggleButtonGroup
                    value={roleFilter}
                    exclusive
                    onChange={handleRoleChange}
                    fullWidth
                    sx={{ 
                        gap: 1.5,
                        '& .MuiToggleButton-root': {
                            border: '1px solid #f1f5f9 !important',
                            borderRadius: '16px !important',
                            fontWeight: 800,
                            py: 1.5,
                            color: '#94a3b8',
                            transition: '0.3s',
                            '&.Mui-selected': {
                                background: MAIN_GRADIENT,
                                color: 'white',
                                border: 'none !important',
                                boxShadow: '0 8px 15px rgba(79, 172, 254, 0.2)'
                            },
                            '&:hover': { bgcolor: '#f8fafc' }
                        }
                    }}
                >
                    <ToggleButton value="all">ALL MEMBERS</ToggleButton>
                    <ToggleButton value="admin">ADMINS</ToggleButton>
                    <ToggleButton value="agent">AGENTS</ToggleButton>
                    <ToggleButton value="customer">CUSTOMERS</ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            {/* Results List */}
            <Stack spacing={2.5}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const role = roleThemeMap[user.role.toLowerCase()] || { color: "#64748b", label: user.role };
                        return (
                            <Fade in={true} key={user.id}>
                                <Card 
                                    elevation={0}
                                    onClick={() => navigate(`/users/${user.id}`)} // ניווט לפרטי המשתמש
                                    sx={{ 
                                        cursor: 'pointer',
                                        borderRadius: 7, 
                                        border: '1px solid #f1f5f9',
                                        transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-5px) scale(1.01)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                                            borderColor: alpha(role.color, 0.2)
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: '28px !important' }}>
                                        <Stack direction="row" spacing={3} alignItems="center">
                                            <Avatar sx={{ 
                                                width: 60, height: 60, 
                                                background: `linear-gradient(45deg, ${role.color}, ${alpha(role.color, 0.6)})`,
                                                fontWeight: 900, fontSize: '1.4rem',
                                                boxShadow: `0 8px 16px ${alpha(role.color, 0.2)}`
                                            }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </Avatar>

                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b', mb: 0.5 }}>
                                                    {user.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                                    {user.email}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ 
                                                px: 2.5, py: 1, borderRadius: '14px',
                                                bgcolor: alpha(role.color, 0.08),
                                                border: `1px solid ${alpha(role.color, 0.1)}`
                                            }}>
                                                <Typography sx={{ 
                                                    color: role.color, fontSize: '0.75rem', 
                                                    fontWeight: 900, textTransform: 'uppercase',
                                                    letterSpacing: '1px'
                                                }}>
                                                    {role.label}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Fade>
                        );
                    })
                ) : (
                    <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f8fafc', borderRadius: 8, border: '2px dashed #e2e8f0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#94a3b8' }}>
                            No matches found for "{searchTerm}"
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Container>
    );
};