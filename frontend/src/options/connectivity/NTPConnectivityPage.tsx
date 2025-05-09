import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Skeleton,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import {
    NTPClientStatus,
    useNTPClientConfigurationMutation,
    useNTPClientConfigurationQuery,
    useNTPClientStatusQuery
} from "../../api";
import {LoadingButton} from "@mui/lab";

import {
    AccessTime as NTPIcon,
    Sync as SyncEnabledIcon,
    SyncDisabled as SyncDisabledIcon,
    SyncLock as SyncSuccessfulIcon,
    SyncProblem as SyncErrorIcon
} from "@mui/icons-material";
import InfoBox from "../../components/InfoBox";
import PaperContainer from "../../components/PaperContainer";
import DetailPageHeaderRow from "../../components/DetailPageHeaderRow";
import {extractHostFromUrl} from "../../utils";

const NTPClientStatusComponent: React.FunctionComponent<{
    status: NTPClientStatus | undefined,
    statusLoading: boolean,
    stateError: boolean
}> = ({
    status,
    statusLoading,
    stateError
}) => {
    if (statusLoading || !status) {
        return (
            <Skeleton height={"8rem"}/>
        );
    }

    if (stateError) {
        return <Typography color="error">Error loading NTPClient state</Typography>;
    }

    const getIconForState = (): React.ReactElement => {
        switch (status.state.__class) {
            case "NoCloudNTPClientEnabledState":
                return <SyncEnabledIcon sx={{fontSize: "4rem"}}/>;
            case "NoCloudNTPClientDisabledState":
                return <SyncDisabledIcon sx={{fontSize: "4rem"}}/>;
            case "NoCloudNTPClientSyncedState":
                return <SyncSuccessfulIcon sx={{fontSize: "4rem"}}/>;
            case "NoCloudNTPClientErrorState":
                return <SyncErrorIcon sx={{fontSize: "4rem"}}/>;
        }
    };

    const getContentForState = (): React.ReactElement | undefined => {
        switch (status.state.__class) {
            case "NoCloudNTPClientErrorState":
                return (
                    <>
                        <Typography variant="h5" color="red">Error: {status.state.type}</Typography>
                        <Typography color="red">{status.state.message}</Typography>
                    </>
                );
            case "NoCloudNTPClientEnabledState":
                return (
                    <Typography variant="h5">Time sync enabled</Typography>
                );
            case "NoCloudNTPClientDisabledState":
                return (
                    <Typography variant="h5">Time sync disabled</Typography>
                );
            case "NoCloudNTPClientSyncedState":
                return (
                    <>
                        <Typography variant="h5">Time sync successful</Typography>
                        <Typography>Offset: {status.state.offset} ms</Typography>
                    </>
                );
        }
    };


    return (
        <Grid container alignItems="center" direction="column" style={{paddingBottom: "1rem"}}>
            <Grid style={{marginTop: "1rem"}}>
                {getIconForState()}
            </Grid>
            <Grid
                sx={{
                    maxWidth: "100% !important", //Why, MUI? Why?
                    wordWrap: "break-word",
                    textAlign: "center",
                    userSelect: "none"
                }}
            >
                {getContentForState()}
            </Grid>
            <Grid
                sx={{
                    maxWidth: "100% !important", //Why, MUI? Why?
                    wordWrap: "break-word",
                    textAlign: "center",
                    userSelect: "none",
                    marginTop: "0.5rem"
                }}
            >
                Current robot time: {status.robotTime}
            </Grid>
        </Grid>
    );
};

const NTPConnectivity = (): React.ReactElement => {
    const {
        data: ntpClientStatus,
        isPending: ntpClientStatusPending,
        isError: ntpClientStatusError,
    } = useNTPClientStatusQuery();

    const {
        data: ntpClientConfig,
        isPending: ntpClientConfigPending,
        isError: ntpClientConfigError,
    } = useNTPClientConfigurationQuery();

    const {mutate: updateConfiguration, isPending: configurationUpdating} = useNTPClientConfigurationMutation();

    const [enabled, setEnabled] = React.useState(false);
    const [server, setServer] = React.useState("");
    const [port, setPort] = React.useState(0);
    const [ntpInterval, setNtpInterval] = React.useState(0);
    const [ntpTimeout, setNtpTimeout] = React.useState(0);

    const [configurationModified, setConfigurationModified] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (ntpClientConfig) {
            setEnabled(ntpClientConfig.enabled);
            setServer(ntpClientConfig.server);
            setPort(ntpClientConfig.port);
            setNtpInterval(ntpClientConfig.interval);
            setNtpTimeout(ntpClientConfig.timeout);
        }
    }, [ntpClientConfig]);

    if (ntpClientStatusPending || ntpClientConfigPending) {
        return (
            <Skeleton height={"8rem"}/>
        );
    }

    if (ntpClientStatusError || ntpClientConfigError || !ntpClientStatus || !ntpClientConfig) {
        return <Typography color="error">Error loading NTP Client configuration</Typography>;
    }

    return (
        <>
            <NTPClientStatusComponent
                status={ntpClientStatus}
                statusLoading={ntpClientStatusPending}
                stateError={ntpClientStatusError}
            />
            <Divider sx={{mt: 1}} style={{marginBottom: "1rem"}}/>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={enabled}
                        onChange={e => {
                            setEnabled(e.target.checked);
                            setConfigurationModified(true);
                        }}
                    />
                }
                label="NTP enabled"
                sx={{mb: 1}}
            />
            <Grid container spacing={1} sx={{mb: 2}}>
                <Grid style={{flexGrow: 1}}>
                    <TextField
                        style={{width: "100%"}}
                        label="Server"
                        value={server}
                        disabled={!enabled}
                        variant="standard"
                        onChange={e => {
                            setServer(extractHostFromUrl(e.target.value));
                            setConfigurationModified(true);
                        }}
                    />
                </Grid>
                <Grid style={{flexGrow: 1}}>
                    <TextField
                        style={{width: "100%"}}
                        label="Port"
                        value={port}
                        disabled={!enabled}
                        type="number"
                        inputProps={{min: 1, max: 65535}}
                        variant="standard"
                        onChange={e => {
                            setPort(parseInt(e.target.value));
                            setConfigurationModified(true);
                        }}
                    />
                </Grid>
                <Grid style={{flexGrow: 1}}>
                    <TextField
                        style={{width: "100%"}}
                        label="Interval (hours)"
                        value={ntpInterval / 3_600_000}
                        sx={{minWidth: 100}}
                        disabled={!enabled}
                        type="number"
                        inputProps={{min: 1, max: 24}}
                        variant="standard"
                        onChange={e => {
                            setNtpInterval(3_600_000 * parseInt(e.target.value));
                            setConfigurationModified(true);
                        }}
                    />
                </Grid>
                <Grid style={{flexGrow: 1}}>
                    <TextField
                        style={{width: "100%"}}
                        label="Timeout (seconds)"
                        value={ntpTimeout / 1000}
                        sx={{minWidth: 150}}
                        disabled={!enabled}
                        type="number"
                        inputProps={{min: 5, max: 60}}
                        variant="standard"
                        onChange={e => {
                            setNtpTimeout(1000 * parseInt(e.target.value));
                            setConfigurationModified(true);
                        }}
                    />
                </Grid>
            </Grid>

            <InfoBox
                boxShadow={5}
                style={{
                    marginTop: "3rem",
                    marginBottom: "2rem"
                }}
            >
                <Typography color="info">
                    NoCloud needs a synchronized clock for timers to work and the log timestamps to make sense.
                    Furthermore, the integrated updater may not work if the clock is set wrongly due to TLS
                    certificates usually only being valid within a particular period of time.
                </Typography>
            </InfoBox>

            <Divider sx={{mt: 1}} style={{marginBottom: "1rem"}}/>
            <Grid container>
                <Grid style={{marginLeft: "auto"}}>
                    <LoadingButton
                        loading={configurationUpdating}
                        color="primary"
                        variant="outlined"
                        disabled={!configurationModified}
                        onClick={() => {
                            updateConfiguration({
                                enabled: enabled,
                                server: server,
                                port: port,
                                interval: ntpInterval,
                                timeout: ntpTimeout
                            });
                            setConfigurationModified(false);
                        }}
                    >
                        Save configuration
                    </LoadingButton>
                </Grid>
            </Grid>
        </>
    );
};

const NTPConnectivityPage = (): React.ReactElement => {
    const {
        isFetching: ntpClientStatusFetching,
        refetch: refetchNtpClientState
    } = useNTPClientStatusQuery();

    return (
        <PaperContainer>
            <Grid container direction="row">
                <Box style={{width: "100%"}}>
                    <DetailPageHeaderRow
                        title="NTP Connectivity"
                        icon={<NTPIcon/>}
                        onRefreshClick={() => {
                            refetchNtpClientState().catch(() => {
                                /* intentional */
                            });
                        }}
                        isRefreshing={ntpClientStatusFetching}
                    />

                    <NTPConnectivity/>
                </Box>
            </Grid>
        </PaperContainer>
    );
};

export default NTPConnectivityPage;
