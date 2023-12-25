import React, { useReducer, useEffect } from 'react';
import theme from './theme';
import '../App.css';
import {
    Autocomplete,
    Card,
    CardHeader,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    ThemeProvider,
    Typography,
} from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const ListAdvisories = (props) => {
    // const GRAPHURL = "http://localhost:5000/graphql";
    const GRAPHURL = "/graphql";
    const initialState = {
        mode: "Traveler",
        advisories: [],
        alerts: [],
        options: [],
        autocompleteSelection: "",
    };
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const sendMsg = (msg) => {
        props.msg(msg);
    };

    useEffect(() => {
        switch (state.mode) {
            case "Region":
                fetchData("query { regions }")
                    .then((response) => { return response.json() })
                    .then((json) => {
                        setState({
                            options: json.data.regions,
                        });
                        sendMsg(`Found ${json.data.regions.length} regions`);
                    });
                break;
            case "Sub-Region":
                fetchData("query { subregions }")
                    .then((response) => { return response.json() })
                    .then((json) => {
                        setState({
                            options: json.data.subregions,
                        });
                        sendMsg(`Found ${json.data.subregions.length} sub-regions`);
                    });
                break;
            case "Traveler":
            default:
                fetchData("query { travelers }")
                    .then((response) => { return response.json() })
                    .then((json) => {
                        setState({
                            options: json.data.travelers,
                        });
                        sendMsg(`Found ${json.data.travelers.length} travelers`);
                    });
                break;
        }
    }, [state.mode]);

    useEffect(() => {
        switch (state.mode) {
            case "Region":
                fetchData(`query ($variable: String) { alertsforregion(variable: $variable) {name, text, date} }`, state.autocompleteSelection)
                    .then((response) => { return response.json() })
                    .then((json) => {
                        setState({
                            alerts: json.data.alertsforregion,
                        });
                        if (state.autocompleteSelection !== "")
                            sendMsg(`Found ${json.data.alertsforregion.length} alerts for ${state.autocompleteSelection}`);
                    });
                break;
            case "Sub-Region":
                fetchData(`query ($variable: String) { alertsforsubregion(variable: $variable) {name, text, date} }`, state.autocompleteSelection)
                    .then((response) => { return response.json() })
                    .then((json) => {
                        setState({
                            alerts: json.data.alertsforsubregion,
                        });
                        if (state.autocompleteSelection !== "")
                            sendMsg(`Found ${json.data.alertsforsubregion.length} alerts for ${state.autocompleteSelection}`);
                    });
                break;
            case "Traveler":
            default:
                fetchData(`query ($variable: String) { advisoriesfortraveler(variable: $variable) {name, country, text, date} }`, state.autocompleteSelection)
                    .then((response) => { return response.json() })
                    .then((json) => {
                        setState({
                            advisories: json.data.advisoriesfortraveler,
                        });
                        if (state.autocompleteSelection !== "")
                            sendMsg(`Found ${json.data.advisoriesfortraveler.length} advisories for ${state.autocompleteSelection}`);
                    });
                break;
        }
    }, [state.autocompleteSelection]);

    const renderBasedOnMode = (params) => {
        switch (state.mode) {
            case "Region":
                return (
                    <TextField
                        {...params}
                        label="Regions"
                        variant='outlined'
                        fullWidth
                    />
                );
            case "Sub-Region":
                return (
                    <TextField
                        {...params}
                        label="Sub-Regions"
                        variant='outlined'
                        fullWidth
                    />
                );
            case "Traveler":
            default:
                return (
                    <TextField
                        {...params}
                        label="Travelers"
                        variant='outlined'
                        fullWidth
                    />
                );
        }
    };

    const renderTableBasedOnMode = () => {
        switch (state.mode) {
            case "Traveler":
                return (
                    <TableBody>
                        {state.advisories.map((advisory) => (
                            <TableRow key={advisory.country}>
                                <TableCell style={{ backgroundColor: theme.palette.background.default }}>
                                    {advisory.country}
                                </TableCell>
                                <TableCell align="right" style={{ backgroundColor: theme.palette.background.default }}>{advisory.text} {advisory.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                );
            default:
                return (
                    <TableBody>
                        {state.alerts.map((alert) => (
                            <TableRow key={alert.name}>
                                <TableCell style={{ backgroundColor: theme.palette.background.default }}>
                                    {alert.name}
                                </TableCell>
                                <TableCell align="right" style={{ backgroundColor: theme.palette.background.default }}>{alert.text} {alert.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                );
        }
    };

    const handleSelectChange = (e) => {
        setState({
            mode: e.target.value,
            autocompleteSelection: "",
            options: [],
            advisories: [],
            alerts: [],
        });
    };

    const handleAutocompleteInput = (e, selectedOption) => {
        selectedOption
            ? setState({ autocompleteSelection: selectedOption })
            : setState({ autocompleteSelection: "" });
    };

    const fetchData = async (q, variable = "") => {
        try {
            return await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ query: q, variables: { variable } }),
            });
        } catch (error) {
            sendMsg(`Problem loading server data - ${error.message}`);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Card>
                <CardHeader
                    title="World Wide Travel Alerts"
                    style={{ color: theme.palette.primary.main, textAlign: "center" }}
                />
                <CardContent align='center'>
                    <Typography>
                        <TravelExploreIcon color='primary' style={{ fontSize: 150, }} />
                    </Typography>
                    <FormControl>
                        <InputLabel shrink>List</InputLabel>
                        <Select
                            id="mode-select"
                            label='List'
                            notched={true}
                            value={state.mode}
                            onChange={handleSelectChange}
                            style={{ width: 300, textAlign: 'left', }}
                        >
                            <MenuItem value={"Traveler"}>Advisories by Traveler</MenuItem>
                            <MenuItem value={"Region"}>Alerts by Region</MenuItem>
                            <MenuItem value={"Sub-Region"}>Alerts by Sub-Region</MenuItem>
                        </Select>
                    </FormControl>
                    <Autocomplete
                        id="regions"
                        options={state.options}
                        getOptionLabel={(option) => option}
                        style={{ width: 300, marginTop: 10 }}
                        value={state.autocompleteSelection}
                        onChange={handleAutocompleteInput}
                        autoComplete
                        blurOnSelect
                        clearOnEscape
                        renderInput={(params) => (
                            renderBasedOnMode(params)
                        )}
                    />
                    <TableContainer style={{ maxHeight: 345, marginTop: 10, }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ backgroundColor: theme.palette.secondary.light }}>Country</TableCell>
                                    <TableCell style={{ backgroundColor: theme.palette.secondary.light }} align="right">Alert Information</TableCell>
                                </TableRow>
                            </TableHead>
                            {renderTableBasedOnMode()}
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default ListAdvisories;