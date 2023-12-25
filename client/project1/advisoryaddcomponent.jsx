import React, { useReducer, useEffect } from 'react';
import theme from './theme';
import '../App.css';
import {
    Autocomplete,
    Button,
    Card,
    CardHeader,
    CardContent,
    TextField,
    ThemeProvider,
    Typography,
} from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const AddAdvisory = (props) => {
    // const GRAPHURL = "http://localhost:5000/graphql";
    const GRAPHURL = "/graphql";
    const initialState = {
        travName: "",
        selectedCountry: null,
        text: "",
        alerts: [],
        countryNames: [],
    };
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const sendMsg = (msg) => {
        props.msg(msg);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ query: "query { alerts {country, name, text, date, region, subregion} }" }),
            });

            let json = await response.json();

            setState({
                alerts: json.data.alerts,
                countryNames: json.data.alerts.map((a) => a.name),
            });

            sendMsg(`Found ${json.data.alerts.length} countries`)
        } catch (error) {
            sendMsg(`Problem loading server data - ${error.message}`);
        }
    };

    const onAddClicked = async () => {
        let advisory = {
            name: state.travName,
            country: state.selectedCountry,
            text: state.text,
            date: getDateTime(),
        };

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
            let query = JSON.stringify({
                query: `mutation {addadvisory(name: "${advisory.name}", country: "${advisory.country}", text: "${advisory.text}", date: "${advisory.date}" ) { name, country, text, date }}`,
            });

            await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: query,
            });

            setState({
                travName: "",
                selectedCountry: null,
                text: "",
            });

            sendMsg(`Added Advisory on ${advisory.date}`);
        } catch (error) {
            setState({
                travName: "",
                selectedCountry: null,
                text: "",
            });
            sendMsg(`${error.message} - advisory not added`);
        }
    };

    const getDateTime = () => {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    };

    const getText = (country) => {
        return state.alerts.find(x => x.name === country).text;
    };

    const handleNameInput = (e) => {
        setState({ travName: e.target.value });
    };

    const handleCountryInput = (e, selectedOption) => {
        selectedOption
            ? setState({ selectedCountry: selectedOption, text: getText(selectedOption) })
            : setState({ selectedCountry: null, text: "" });
    };

    const emptyorundefined =
        state.travName === undefined ||
        state.travName === "" ||
        state.selectedCountry === undefined ||
        state.selectedCountry === null;

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
                    <Typography variant='h6' fontWeight='bold' color='primary' style={{ marginTop: 10, }}>Add Advisory</Typography>
                    <TextField
                        onChange={handleNameInput}
                        placeholder="Traveler's name"
                        value={state.travName}
                        style={{ marginTop: 10, width: 300, }}
                    />
                    <Autocomplete
                        id="countries"
                        options={state.countryNames}
                        getOptionLabel={(option) => option}
                        style={{ width: 300, marginTop: 10 }}
                        value={state.selectedCountry}
                        onChange={handleCountryInput}
                        autoComplete
                        blurOnSelect
                        clearOnEscape
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choose a country"
                                variant='outlined'
                                fullWidth
                            />
                        )}
                    />
                    <Button
                        color="secondary"
                        variant="contained"
                        style={{ marginTop: 10 }}
                        onClick={onAddClicked}
                        disabled={emptyorundefined}
                    >
                        <Typography>Add Advisory</Typography>
                    </Button>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}

export default AddAdvisory;