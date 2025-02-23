import React from "react";
import {Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";

const TextInformationGrid: React.FunctionComponent<{ items: Array<{ header: string, body: string }> }> = ({
    items
}): React.ReactElement => {
    return (
        <Grid
            container
            spacing={2}
            style={{wordBreak: "break-all"}}
        >
            {items.map((item) => {
                return (
                    <Grid key={item.header}>
                        <Typography variant="caption" color="textSecondary">
                            {item.header}
                        </Typography>
                        <Typography variant="body2">{item.body}</Typography>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default TextInformationGrid;
