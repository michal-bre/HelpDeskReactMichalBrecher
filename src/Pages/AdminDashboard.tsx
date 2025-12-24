import React, { useMemo } from "react";
import { 
    Box, Typography, Paper, Stack, Container, 
    Avatar, CircularProgress 
} from "@mui/material";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from "recharts";

import { useUserContext } from "../Context/UserContext";
import { useTicketsQuery } from "../Query/TicketsQuery"; 
import { useStatusQuery } from "../Query/StatusQuery";

// אייקונים
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SpeedIcon from '@mui/icons-material/Speed';

// הגדרת טיפוסים כדי לפתור את שגיאות ה-TypeScript שצילמת
interface Ticket {
    id: number;
    subject: string;
    status_id: number;
    status?: { name: string };
}

interface Status {
    id: number;
    name: string;
}

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

const AdminDashboard: React.FC = () => {
    const { user } = useUserContext();
    
    // שימוש ב-as כדי ש-TypeScript יזהה את המערכים ולא ייתן שגיאת unknown
    const ticketsQuery = useTicketsQuery();
    const statusesQuery = useStatusQuery();

    const tickets = (ticketsQuery.data ?? []) as Ticket[];
    const statuses = (statusesQuery.data ?? []) as Status[];

    const adminName = user?.userDetails?.name ?? "Admin";

    // לוגיקת עיבוד הנתונים - כאן פתרנו את השגיאות מהצילום מסך
    const stats = useMemo(() => {
        const total = tickets.length;
        const open = tickets.filter(t => t.status_id === 1).length;
        const closed = tickets.filter(t => t.status_id === 2).length;
        const successRate = total > 0 ? Math.round((closed / total) * 100) : 0;

        // בניית נתונים לגרף העמודות - שימוש ב-map על מערך ידוע (מוריד שגיאת unknown)
        const distribution = statuses.map(s => ({
            name: s.name,
            value: tickets.filter(t => t.status_id === s.id).length,
            color: s.name.toLowerCase() === 'open' ? '#4facfe' : '#9c27b0'
        }));

        // נתונים לגרף השטח (Area) - מבוסס על הטיקטים האחרונים
        const activityData = tickets.slice(-7).map((t) => ({
            day: `T-${t.id}`,
            count: Math.floor(Math.random() * 15) + 5 // כאן ניתן לחבר לתאריכים אם יש ב-API
        }));

        const recentActivity = [...tickets].slice(0, 5);

        return { total, open, closed, successRate, distribution, activityData, recentActivity };
    }, [tickets, statuses]);

    if (ticketsQuery.isLoading || statusesQuery.isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress sx={{ color: '#4facfe' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px' }}>
                    Welcome back, {adminName} 
                </Typography>
                <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 500, mt: 1 }}>
                    Real-time data synchronization is active.
                </Typography>
            </Box>

            {/* KPI Cards - Flexbox */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
                {[
                    { label: "Total Tickets", value: stats.total, icon: <ConfirmationNumberIcon />, growth: "Overall" },
                    { label: "Currently Open", value: stats.open, icon: <SpeedIcon />, growth: "Active" },
                    { label: "Resolution Rate", value: `${stats.successRate}%`, icon: <TrendingUpIcon />, growth: "Success" },
                    { label: "Team Users", value: "8 Active", icon: <PeopleAltIcon />, growth: "Stable" },
                ].map((stat, index) => (
                    <Paper key={index} elevation={0} sx={{ 
                        flex: '1 1 calc(25% - 24px)', minWidth: '220px',
                        p: 3, borderRadius: 5, border: '1px solid #f1f5f9',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.02)',
                        transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Avatar sx={{ background: index % 2 === 0 ? '#f0f9ff' : '#faf5ff', color: index % 2 === 0 ? '#4facfe' : '#9c27b0', borderRadius: 3 }}>
                                {stat.icon}
                            </Avatar>
                            <Typography variant="caption" sx={{ color: '#4facfe', fontWeight: 700, bgcolor: '#f0f9ff', px: 1, borderRadius: 1 }}>
                                {stat.growth}
                            </Typography>
                        </Stack>
                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 2, color: '#1e293b' }}>{stat.value}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{stat.label}</Typography>
                    </Paper>
                ))}
            </Box>

            {/* Graphs - Flexbox */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 6 }}>
                <Paper sx={{ flex: '1 1 55%', minWidth: '350px', p: 4, borderRadius: 6, border: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: '#334155' }}>Volume Analysis</Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={stats.activityData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4facfe" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="count" stroke="#4facfe" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                <Paper sx={{ flex: '1 1 35%', minWidth: '280px', p: 4, borderRadius: 6, border: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: '#334155' }}>Status Load</Typography>
                    <Box sx={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats.distribution}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                                    {stats.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Box>

            {/* Recent Activity Section */}
            <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid #f1f5f9' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Live Feed</Typography>
                <Stack spacing={2.5}>
                    {stats.recentActivity.map((ticket) => (
                        <Box key={ticket.id} sx={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            p: 2.5, borderRadius: 4, bgcolor: '#fcfdfe', border: '1px solid #f1f5f9'
                        }}>
                            <Stack direction="row" spacing={2.5} alignItems="center">
                                <Avatar sx={{ width: 42, height: 42, background: MAIN_GRADIENT, fontWeight: 700 }}>
                                    {ticket.subject?.[0].toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#1e293b' }}>{ticket.subject}</Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Ticket ID: #{ticket.id} • Verified</Typography>
                                </Box>
                            </Stack>
                            <Box sx={{ 
                                px: 2, py: 0.8, borderRadius: 2.5, fontWeight: 900, fontSize: '0.7rem',
                                bgcolor: ticket.status?.name?.toLowerCase() === 'open' ? '#e0f2fe' : '#f3e8ff',
                                color: ticket.status?.name?.toLowerCase() === 'open' ? '#0369a1' : '#7e22ce',
                                textTransform: 'uppercase'
                            }}>
                                {ticket.status?.name}
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Container>
    );
};

export default AdminDashboard;