import {ReactComponent as SplashLogo} from "../assets/icons/NoCloud_splash.svg";
import {CircularProgress} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";

const NoCloudSplash = (): React.ReactElement => {

    return (
        <Grid
            container
            sx={{
                width: "90%",
                height: "50%",
                margin: "auto",
                marginTop: "25%",
                marginBottom: "25%",
                maxWidth: "600px",
                minHeight: "90%",
            }}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Grid
            >
                <SplashLogo
                    style={{
                        width: "90%",
                        marginLeft: "5%"
                    }}
                />
            </Grid>
            <Grid
                sx={{marginTop: "3em"}}
            >
                <CircularProgress/>
            </Grid>
        </Grid>
    );
};

export default NoCloudSplash;
