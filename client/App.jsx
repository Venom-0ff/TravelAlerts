import React, { useState, useReducer } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./week7/class1/theme";
import {
    AppBar,
    IconButton,
    Menu,
    MenuItem,
    Snackbar,
    Toolbar,
    Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Project1 from "./project1/project1component";
import AlertsSetup from "./project1/alertsetupcomponent";
import AddAdvisory from "./project1/advisoryaddcomponent";
import ListAdvisories from "./project1/advisorylistcomponent";

const App = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const initialState = {
        refresh: false,
        snackbarMsg: "",
        hasMsg: false,
    };
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const handleClose = () => {
        state.refresh = false;
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const refreshData = () => {
        state.refresh = true;
        setAnchorEl(null);
    };

    const msgForSnack = (msg) => {
        setState({ snackbarMsg: msg, hasMsg: true, refresh: false });
    };

    const snackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setState({ hasMsg: false });
    };

    const snackAction = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={snackbarClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <ThemeProvider theme={theme}>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h5'>
                        INFO3139 - Project 1
                    </Typography>
                    <IconButton
                        id="menubtn"
                        onClick={handleClick}
                        color="inherit"
                        style={{ marginLeft: "auto", paddingRight: "1vh" }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem component={NavLink} to="/home" onClick={handleClose}>
                            Home
                        </MenuItem>
                        <MenuItem component={NavLink} onClick={refreshData}>
                            Reset Data
                        </MenuItem>
                        <MenuItem component={NavLink} to="/add" onClick={handleClose}>
                            Add Advisory
                        </MenuItem>
                        <MenuItem component={NavLink} to="/list" onClick={handleClose}>
                            List Advisories
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/" element={<Project1 />} />
                <Route path="/home" element={<Project1 />} />
                <Route path="/add" element={<AddAdvisory msg={msgForSnack} />} />
                <Route path="/list" element={<ListAdvisories msg={msgForSnack} />} />
            </Routes>
            <AlertsSetup
                msg={msgForSnack}
                refresh={state.refresh}
            />
            <Typography
                color="primary"
                style={{ float: "right", paddingRight: "1vh", fontSize: "smaller" }}
            >
                &copy;2023, Stepan Kostyukov
            </Typography>
            <Snackbar
                open={state.hasMsg}
                message={state.snackbarMsg}
                autoHideDuration={5000}
                onClose={snackbarClose}
                action={snackAction}
            />
        </ThemeProvider>
    );
};

export default App;