import {Divider, IconButton, styled, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, {FunctionComponent} from "react";
import {
    Help as HelpIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import HelpDialog from "./HelpDialog";

const TopRightRefreshButton = styled(LoadingButton)(({theme}) => {
    return {
        minWidth: 0
    };
});

interface DetailPageHeaderRowProps {
    title: string;
    icon: React.ReactElement;
    helpText?: string,
    onRefreshClick?: () => void,
    isRefreshing?: boolean
}

const DetailPageHeaderRow: FunctionComponent<DetailPageHeaderRowProps> = ({
    title,
    icon,
    helpText,
    onRefreshClick,
    isRefreshing
}): React.ReactElement => {
    const [helpDialogOpen, setHelpDialogOpen] = React.useState(false);

    return (
        <>
            <Grid container alignItems="center" spacing={1} justifyContent="space-between">
                <Grid style={{display:"flex"}}>
                    <Grid style={{paddingRight: "8px"}}>
                        {icon}
                    </Grid>
                    <Grid>
                        <Typography>{title}</Typography>
                    </Grid>
                </Grid>
                <Grid>
                    <Grid container>
                        {
                            helpText !== undefined &&
                            <>
                                <Grid
                                    style={{marginTop:"-0.125rem"}} //:(
                                >
                                    <IconButton
                                        onClick={() => {
                                            return setHelpDialogOpen(true);
                                        }}
                                        title="Help"
                                    >
                                        <HelpIcon/>
                                    </IconButton>
                                </Grid>

                                <HelpDialog
                                    dialogOpen={helpDialogOpen}
                                    setDialogOpen={(open: boolean) => {
                                        setHelpDialogOpen(open);
                                    }}
                                    helpText={helpText}
                                />
                            </>
                        }

                        {
                            onRefreshClick !== undefined &&
                            <Grid>
                                <TopRightRefreshButton
                                    loading={isRefreshing ?? false}
                                    onClick={onRefreshClick}
                                    title="Refresh"
                                >
                                    <RefreshIcon/>
                                </TopRightRefreshButton>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{mt: 1}}/>
        </>
    );
};

export default DetailPageHeaderRow;
