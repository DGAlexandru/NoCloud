import Grid from "@mui/material/Grid2";
import React from "react";
import SplashLogo from "../assets/icons/NoCloud_splash.svg?react";
import {CircularProgress} from "@mui/material";

const NoCloudSplash = (): React.ReactElement => {

    return (
        <Grid
            container
            sx={{
                width: "90%",
                height: "100vh",
                margin: "0 auto",
                maxWidth: "600px",
            }}
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            paddingTop="20vh"
        >
            <Grid
                sx={{
                    width: "90%",
                    maxWidth: "270px"
                }}
            >
                <SplashLogo
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block"
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
