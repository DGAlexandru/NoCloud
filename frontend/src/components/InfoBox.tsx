import React from "react";
import {Paper} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {Announcement} from "@mui/icons-material";

const InfoBox = (props: { boxShadow: number, style?: React.CSSProperties, children: React.ReactNode}): React.ReactElement => {

    return (
        <Paper
            style={props.style}
            sx={{ boxShadow: props.boxShadow }}
        >
            <Grid container direction="row" alignItems="center" style={{padding: "1rem"}}>
                <Grid
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                >
                    <Announcement fontSize={"large"} color={"info"}/>
                </Grid>
                <Grid
                    style={{
                        width: "90%",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                >
                    {props.children}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default InfoBox;
