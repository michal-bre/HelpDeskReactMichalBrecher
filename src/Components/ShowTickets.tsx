import  { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTicketsQuery } from "../Query/TicketsQuery";
import { useStatusQuery } from "../Query/StatusQuery";
import {
    Container, Box, Typography, Stack, Paper, Avatar, Chip,
    IconButton, TextField, InputAdornment, Tabs, Tab
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const PURPLE_GRADIENT = "linear-gradient(135deg, rgba(25,118,210,1) 0%, rgba(156,39,176,0.95) 100%)";


// הגדרת טיפוס לסטטוס כדי למנוע את השגיאה שצילמת
interface Status {
    id: number;
    name: string;
    color?: string;
}

const getStatusStyle = (statusName: string) => {
    const name = statusName.toLowerCase();
    if (name.includes('open')) return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' }; // תכלת
    if (name.includes('close')) return { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' }; // סגול
    if (name.includes('procces')) return { bg: '#eff6ff', text: '#1d4ed8', border: '#dbeafe' }; // כחול רויאל
    if (name.includes('ignore')) return { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' }; // אפור פלדה
    return { bg: '#fdf4ff', text: '#a21caf', border: '#fae8ff' }; // לילך/ורוד
};

export const ShowTickets = () => {
    const navigate = useNavigate();
    const { data: ticketsData, isLoading: ticketsLoading } = useTicketsQuery();

    // הגדרת הטיפוס כ-Array של Status כדי לפתור את השגיאה מהצילום מסך
    const { data: statusesData, isLoading: statusLoading } = useStatusQuery();
    const statuses = (statusesData as Status[]) ?? [];

    const [searchTerm, setSearchTerm] = useState("");
    const [activeStatus, setActiveStatus] = useState<number | "all">("all");

    const filteredTickets = useMemo(() => {
        const tickets = ticketsData ?? [];
        return tickets.filter(t => {
            const matchesSearch = t.subject?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = activeStatus === "all" || t.status_id === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [ticketsData, searchTerm, activeStatus]);

    if (ticketsLoading || statusLoading) return null;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1px' }}>
                    Support Tickets
                </Typography>
            </Box>

            {/* חיפוש וסינון */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Search tickets..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'white' } }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#6366f1' }} /></InputAdornment>,
                    }}
                />
                <Tabs
                    value={activeStatus}
                    onChange={(_, val) => setActiveStatus(val)}
                    sx={{
                        '& .MuiTab-root': { fontWeight: 800, color: 'linear-gradient(135deg, rgba(25,118,210,1) 0%, rgba(156,39,176,0.95) 100%)' },
                        '& .Mui-selected': { color: '#6366f1 !important' },
                        '& .MuiTabs-indicator': { backgroundColor: '#6366f1', height: 3 }
                    }}
                >
                    <Tab label="ALL" value="all" />
                    {statuses.map((s) => (
                        <Tab key={s.id} label={s.name.toUpperCase()} value={s.id} />
                    ))}
                </Tabs>
            </Box>

            <Stack spacing={2}>
                {filteredTickets.map((ticket) => {
                    // כאן התיקון לשגיאה: TypeScript עכשיו יודע שזה מערך
                    const currentStatus = statuses.find((s) => s.id === ticket.status_id);
                    const statusName = currentStatus?.name || "Unknown";
                    const style = getStatusStyle(statusName);

                    return (
                        <Paper
                            key={ticket.id}
                            elevation={0}
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                            sx={{
                                p: 2, borderRadius: 5, border: '1px solid #f1f5f9',
                                transition: '0.2s', cursor: 'pointer',
                                '&:hover': { boxShadow: '0 12px 24px rgba(0,0,0,0.04)', borderColor: '#6366f1' }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {/* מזהה (סגול-כחול) */}
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '22%' }}>
                                    <Avatar sx={{ background: PURPLE_GRADIENT, width: 42, height: 42, fontSize: '0.9rem', fontWeight: 700 }}>
                                        {ticket.id}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
                                            {ticket.subject || "No Subject"}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* מידע מרכזי (תכלת-סגול רך) */}
                                <Stack direction="row" spacing={3} sx={{ flexGrow: 1, px: 2 }}>
                                    {/* שם המשתמש שפתח את הטיקט */}
                                    <InfoItem
                                        icon={<PersonOutlineIcon />}
                                        label="USER"
                                        value={ticket.created_by_name || "Unknown User"}
                                    />

                                    {/* תאריך יצירה אמיתי מה-DB */}
                                    <InfoItem
                                        icon={<CalendarTodayIcon />}
                                        label="DATE"
                                        value={ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('he-IL') : "No Date"}
                                    />

                                    {/* עדיפות - שימוש ב-priority_id הקיים */}
                                    <InfoItem
                                        icon={<FlagOutlinedIcon />}
                                        label="PRIORITY"
                                        value={ticket.priority_id ? `${ticket.priority_name}` : "Normal"}
                                    />
                                </Stack>
                                {/* סטטוס מעוצב */}
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Chip
                                        label={statusName}
                                        sx={{
                                            bgcolor: style.bg, color: style.text, border: `1px solid ${style.border}`,
                                            fontWeight: 800, borderRadius: '10px', px: 1
                                        }}
                                    />
                                    <IconButton size="small" sx={{ color: '#cbd5e1' }}>
                                        <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Paper>
                    );
                })}
            </Stack>
        </Container>
    );
};

const InfoItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: '130px' }}>
        <Box sx={{ color: '#94a3b8', display: 'flex', transform: 'scale(0.8)' }}>{icon}</Box>
        <Box>
            <Typography variant="caption" display="block" color="text.disabled" sx={{ fontWeight: 800, fontSize: '0.6rem' }}>{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>{value}</Typography>
        </Box>
    </Box>
);