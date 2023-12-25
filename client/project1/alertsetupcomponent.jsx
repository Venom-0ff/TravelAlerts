import React, { useReducer, useEffect } from 'react';
import theme from './theme';
import '../App.css';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ThemeProvider,
} from '@mui/material';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';

const AlertsSetup = (props) => {
    // const GRAPHURL = "http://localhost:5000/graphql";
    const GRAPHURL = "/graphql";
    const initialState = {
        results: [],
        isVisible: false,
    };
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const sendMsg = (msg) => {
        props.msg(msg);
    };

    useEffect(() => {
        if (props.refresh)
            setup();
    }, [props]);

    const setup = async () => {
        try {
            setState({ isVisible: true });
            sendMsg("Running setup...");

            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ query: "query { project1_setup {results} }" }),
            });

            let json = await response.json();
            setState({
                results: json.data.project1_setup.results
                    .replace(/([.])\s*(?=[A-Z])/g, "$1|")
                    .split("|"),
            });

            sendMsg("Alerts collections setup completed!");

            setTimeout(() => {
                setState({ isVisible: false, results:[] });
            }, 6000);
        } catch (error) {
            console.log(error);
            sendMsg(`Problem loading server data - ${error.message}`);
        }
    };

    return (
        <div>
            {state.isVisible && <ThemeProvider theme={theme}>
                <List dense={true}>
                    {state.results.map((result) => (
                        <ListItem key={result}>
                            <ListItemIcon>
                                <InfoTwoToneIcon color='primary' />
                            </ListItemIcon>
                            <ListItemText primary={result} />
                        </ListItem>
                    ))}
                </List>
            </ThemeProvider>}
        </div>
    );
}

export default AlertsSetup;