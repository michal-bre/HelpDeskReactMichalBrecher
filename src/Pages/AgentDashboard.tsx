import React, { useMemo } from "react";
import { 
    Box, Typography, Paper, Stack, Container, 
    Avatar, Button, alpha, CircularProgress 
} from "@mui/material";
import { 
    BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";
import { useTicketsQuery } from "../Query/TicketsQuery";

// אייקונים
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MAIN_GRADIENT = "linear-gradient(135deg, #4facfe 0%, #9c27b0 100%)";

const AgentDashboard: React.FC = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    
    // שליפת נתונים אמיתיים
    const { data, isLoading } = useTicketsQuery();
    const allTickets = (data ?? []) as any[];

    const agentName = user?.userDetails?.name ?? "Agent";
    const agentId = user?.userDetails?.id;

    // עיבוד נתונים אמיתיים של הסוכן
    const stats = useMemo(() => {
        const myTickets = allTickets.filter(t => t.assigned_to === agentId);
        const pending = myTickets.filter(t => t.status_id === 1).length; // סטטוס פתוח
        const completed = myTickets.filter(t => t.status_id === 2).length; // סטטוס סגור
        
        const chartData = [
            { name: 'Pending', value: pending, color: '#4facfe' },
            { name: 'Completed', value: completed, color: '#9c27b0' },
        ];

        return { 
            total: myTickets.length, 
            pending, 
            completed, 
            chartData, 
            recentTickets: myTickets.slice(0, 4) 
        };
    }, [allTickets, agentId]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress sx={{ color: '#4facfe' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header - בולט עם הגרדיאנט שאת אוהבת */}
            <Box sx={{ 
                mb: 6, display: 'flex', flexWrap: 'wrap', 
                justifyContent: 'space-between', alignItems: 'center', gap: 2 
            }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px' }}>
                        Hello, {agentName}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        You have <span style={{ color: '#9c27b0', fontWeight: 800 }}>{stats.pending}</span> tickets waiting for you.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    onClick={() => navigate("/tickets")}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                        background: MAIN_GRADIENT, borderRadius: "14px", px: 4, py: 1.5, 
                        fontWeight: 800, fontSize: '1rem', boxShadow: '0 10px 20px rgba(156, 39, 176, 0.2)'
                    }}
                >
                    MY TICKETS
                </Button>
            </Box>

            {/* KPI Section - שימוש ב-Flexbox במקום Grid */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
                {[
                    { label: "Assigned To Me", value: stats.total, icon: <AssignmentIcon />, color: '#4facfe' },
                    { label: "Pending Tasks", value: stats.pending, icon: <PendingActionsIcon />, color: '#9c27b0' },
                    { label: "Completed", value: stats.completed, icon: <CheckCircleOutlineIcon />, color: '#3e32e5ff' },
                ].map((item, index) => (
                    <Paper key={index} elevation={0} sx={{ 
                        flex: '1 1 300px', p: 3, borderRadius: 6, border: '1px solid #f1f5f9',
                        transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: alpha(item.color, 0.1), color: item.color, borderRadius: 3 }}>
                                {item.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 900 }}>{item.value}</Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700 }}>{item.label}</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                ))}
            </Box>

            {/* Content Section - גרף ורשימה אחד ליד השני ב-Flex */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {/* Graph Card */}
                <Paper sx={{ flex: '1 1 500px', p: 4, borderRadius: 7, border: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: '#334155' }}>Workload Distribution</Typography>
                    <Box sx={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats.chartData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={55}>
                                    {stats.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                {/* Recent Feed - בדיוק כמו ב-Admin */}
                <Paper sx={{ flex: '1 1 350px', p: 4, borderRadius: 7, border: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Recent Assignments</Typography>
                    <Stack spacing={2.5}>
                        {stats.recentTickets.map((ticket: any) => (
                            <Box key={ticket.id} sx={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                p: 2, borderRadius: 4, bgcolor: '#fcfdfe', border: '1px solid #f1f5f9'
                            }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ 
                                        width: 38, height: 38, background: MAIN_GRADIENT, 
                                        fontSize: '0.9rem', fontWeight: 700 
                                    }}>
                                        {ticket.subject?.[0].toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                            {ticket.subject.length > 20 ? ticket.subject.substring(0, 20) + '...' : ticket.subject}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>ID: #{ticket.id}</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        ))}
                        {stats.recentTickets.length === 0 && (
                            <Typography variant="body2" sx={{ textAlign: 'center', color: '#94a3b8', py: 4 }}>
                                All caught up! No active tickets.
                            </Typography>
                        )}
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
};

export default AgentDashboard;