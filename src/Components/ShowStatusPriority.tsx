import React from "react";
import Swal from "sweetalert2";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    CircularProgress,
    Container,
    Chip,
    Fade
} from "@mui/material";

// אייקונים
import LabelImportantRoundedIcon from '@mui/icons-material/LabelImportantRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';

import { usePriorityQuery } from "../Query/PriorityQuery";
import { useStatusQuery } from "../Query/StatusQuery";

type Props = { type: "priorities" | "statuses" };
type Item = { id: number; name: string };

export const ShowPriorityOrStatus: React.FC<Props> = ({ type }) => {
    const prioritiesQ = usePriorityQuery();
    const statusesQ = useStatusQuery();

    const isPriority = type === "priorities";
    const q = isPriority ? prioritiesQ : statusesQ;
    const items: Item[] = (q.data ?? []) as Item[];

    React.useEffect(() => {
        if (q.error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: q.error instanceof Error ? q.error.message : `Failed to load ${type}.`,
                confirmButtonColor: "#4facfe",
            });
        }
    }, [q.error, type]);

    if (q.isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" py={10}>
                <CircularProgress sx={{ color: '#4facfe' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 2 }}>
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 6,
                        overflow: 'hidden',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                    }}
                >
                    {/* Header של הרשימה */}
                    <Box
                        sx={{
                            p: 3,
                            background: 'rgba(248, 250, 252, 0.5)',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <ListAltRoundedIcon sx={{ color: isPriority ? '#9c27b0' : '#4facfe' }} />
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', textTransform: 'capitalize' }}>
                                {type} Management
                            </Typography>
                        </Box>
                        <Chip
                            label={`${items.length} Total`}
                            size="small"
                            sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#64748b' }}
                        />
                    </Box>

                    {/* גוף הרשימה */}
                    <List disablePadding>
                        {items.length === 0 ? (
                            <Box py={5} textAlign="center">
                                <Typography variant="body2" color="text.secondary">No {type} found.</Typography>
                            </Box>
                        ) : (
                            items.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <ListItem
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: '#f8fafc',
                                                '& .arrow-icon': { transform: 'translateX(4px)', color: '#4facfe' }
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <LabelImportantRoundedIcon
                                                sx={{
                                                    fontSize: 20,
                                                    color: isPriority ? '#9c27b0' : '#4facfe',
                                                    opacity: 0.7
                                                }}
                                            />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={item.name}
                                            primaryTypographyProps={{
                                                sx: { fontWeight: 600, color: '#334155', fontSize: '1rem' }
                                            }}
                                        />



                                    </ListItem>
                                    {index < items.length - 1 && <Divider sx={{ mx: 3, opacity: 0.5 }} />}
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </Paper>
            </Fade>
        </Container>
    );
};

export default ShowPriorityOrStatus;