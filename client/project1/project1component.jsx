import React from 'react';
import theme from './theme';
import '../App.css';
import {
    Card,
    CardHeader,
    CardContent,
    ThemeProvider,
    Typography,
} from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const Project1 = () => {
    return (
        <ThemeProvider theme={theme}>
            <Card>
                <CardHeader
                    title="World Wide Travel Alerts"
                    style={{ color: theme.palette.primary.main, textAlign: "center" }}
                />
                <CardContent align='center'>
                    <Typography>
                        <TravelExploreIcon color='primary' style={{ fontSize: 150 }} />
                    </Typography>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default Project1;
