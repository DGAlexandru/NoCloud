import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    MenuItem,
    Skeleton,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import {
    PushNotifClientStatus,
    SendPushNotifClientParams,
    sendPushNotifClientMessage,
    usePushNotifClientConfigurationMutation,
    usePushNotifClientConfigurationQuery,
    usePushNotifClientStatusQuery,
} from "../../api";
import { LoadingButton } from "@mui/lab";

import { PushNotifIcon } from "../../components/CustomIcons";
import {
    Sync as SyncEnabledIcon,
    SyncDisabled as SyncDisabledIcon,
    SyncLock as SyncSuccessfulIcon,
    SyncProblem as SyncErrorIcon,
} from "@mui/icons-material";

import InfoBox from "../../components/InfoBox";
import PaperContainer from "../../components/PaperContainer";
import DetailPageHeaderRow from "../../components/DetailPageHeaderRow";
import { extractHostFromUrl } from "../../utils";

// ---------------------------------------------------------
// Status Component
// ---------------------------------------------------------

const STATE_MAP: Record<
    string,
    {
        icon: React.ReactElement;
        content: (status: PushNotifClientStatus) => React.ReactElement;
    }
> = {
    NoCloudPushNotifClientEnabledState: {
        icon: <SyncEnabledIcon sx={{ fontSize: "4rem" }} />,
        content: () => <Typography variant="h5">Push notifications enabled</Typography>,
    },
    NoCloudPushNotifClientDisabledState: {
        icon: <SyncDisabledIcon sx={{ fontSize: "4rem" }} />,
        content: () => <Typography variant="h5">Push notifications disabled</Typography>,
    },
    NoCloudPushNotifClientSyncedState: {
        icon: <SyncSuccessfulIcon sx={{ fontSize: "4rem" }} />,
        content: (status) => (
            <>
                <Typography variant="h5">Push notifications successful</Typography>
                {status.state.lastTitle && <Typography>Title: {status.state.lastTitle}</Typography>}
                {status.state.lastMessage && <Typography>Message: {status.state.lastMessage}</Typography>}
                {status.state.lastPriority !== undefined && (
                    <Typography>Priority: {status.state.lastPriority}</Typography>
                )}
            </>
        ),
    },
    NoCloudPushNotifClientErrorState: {
        icon: <SyncErrorIcon sx={{ fontSize: "4rem" }} />,
        content: (status) => (
            <>
                <Typography variant="h5" color="error">
                    Error: {status.state.type}
                </Typography>
                <Typography color="error">{status.state.message}</Typography>
            </>
        ),
    },
};

const PushNotifClientStatusComponent: React.FC<{
    status: PushNotifClientStatus | undefined;
    statusLoading: boolean;
    stateError: boolean;
}> = ({ status, statusLoading, stateError }) => {
    if (statusLoading || !status) {
        return <Skeleton height={"8rem"} />;
    }

    if (stateError) {
        return <Typography color="error">Error loading PushNotifClient state</Typography>;
    }

    const stateDef = STATE_MAP[status.state.__class];

    return (
        <Grid container alignItems="center" direction="column" sx={{ paddingBottom: "1rem" }}>
            <Grid sx={{ marginTop: "1rem" }}>{stateDef?.icon}</Grid>
            <Grid
                sx={{
                    maxWidth: "100% !important",
                    wordWrap: "break-word",
                    textAlign: "center",
                    userSelect: "none",
                }}
            >
                {stateDef?.content(status)}
            </Grid>
            <Grid
                sx={{
                    maxWidth: "100% !important",
                    wordWrap: "break-word",
                    textAlign: "center",
                    userSelect: "none",
                    marginTop: "0.5rem",
                }}
            >
                Current robot time: {status.robotTime}
            </Grid>
        </Grid>
    );
};

// ---------------------------------------------------------
// Main Connectivity Component
// ---------------------------------------------------------

type PushNotifConfigState = {
    enabled: boolean;
    server: string;
    path: string;
    port: number;
    token: string;
    user: string;
    sound: string;
    priority: number;
    rateLimit: number;
    rateLimitTime: number;
    pushEvents: boolean;
    processEvents: boolean;
};

type TestNotifState = {
    title: string;
    message: string;
    priority: number;
    sound: string;
    retry: number;
    expire: number;
    sending: boolean;
    result: string | null;
};

const PushNotifConnectivity: React.FC<{
    statusQuery: ReturnType<typeof usePushNotifClientStatusQuery>;
}> = ({ statusQuery }) => {
    const {
        data: pushNotifClientStatus,
        isPending: pushNotifClientStatusPending,
        isError: pushNotifClientStatusError,
    } = statusQuery;

    const {
        data: pushNotifClientConfig,
        isPending: pushNotifClientConfigPending,
        isError: pushNotifClientConfigError,
    } = usePushNotifClientConfigurationQuery();

    const { mutate: updateConfiguration, isPending: configurationUpdating } =
        usePushNotifClientConfigurationMutation();

    // -----------------------------------------------------
    // Configuration state
    // -----------------------------------------------------

    const [config, setConfig] = React.useState<PushNotifConfigState>({
        enabled: false,
        server: "",
        path: "",
        port: 443,
        token: "",
        user: "",
        sound: "magic",
        priority: 0,
        rateLimit: 5,
        rateLimitTime: 30_000,
        pushEvents: false,
        processEvents: false
    });

    React.useEffect(() => {
        if (pushNotifClientConfig) {
            setConfig(pushNotifClientConfig);
        }
    }, [pushNotifClientConfig]);

    const updateConfig = React.useCallback(
        <K extends keyof PushNotifConfigState>(key: K, value: PushNotifConfigState[K]) => {
            setConfig((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const configurationModified = React.useMemo(() => {
        if (!pushNotifClientConfig) {
            return false;
        }
        return JSON.stringify(config) !== JSON.stringify(pushNotifClientConfig);
    }, [config, pushNotifClientConfig]);

    // -----------------------------------------------------
    // Test notification state
    // -----------------------------------------------------

    const [test, setTest] = React.useState<TestNotifState>({
        title: "Test notification",
        message: "This is a test push notification",
        priority: 0,
        sound: "magic",
        retry: 30,
        expire: 300,
        sending: false,
        result: null,
    });

    const isEmergency = React.useMemo(() => test.priority === 2, [test.priority]);

    const updateTest = React.useCallback(
        <K extends keyof TestNotifState>(key: K, value: TestNotifState[K]) => {
            setTest((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    // -----------------------------------------------------
    // Test push notification sender
    // -----------------------------------------------------

    const sendTestPushNotification = React.useCallback(async () => {
        updateTest("sending", true);
        updateTest("result", null);

        try {
            const params: SendPushNotifClientParams = {
                title: test.title || "Test Notification",
                message: test.message || "This is a test push notification from NoCloud",
                priority: test.priority,
                sound: test.sound,
            };
            // Include retry/expire input fields only if priority = 2 (Emergency)
            if (isEmergency) {
                params.retry = test.retry;
                params.expire = test.expire;
            }
            // Trigger the backend to send a push notification, just like a norm
            await sendPushNotifClientMessage(params);
            updateTest("result", "Test notification sent successfully!");
        } catch (err: any) {
            updateTest("result", `Failed to send test notification: ${err.message}`);
        } finally {
            updateTest("sending", false);
        }
    }, [test, isEmergency, updateTest]);

    // -----------------------------------------------------
    // Loading / error handling
    // -----------------------------------------------------

    if (pushNotifClientStatusPending || pushNotifClientConfigPending) {
        return <Skeleton height={"8rem"} />;
    }

    if (
        pushNotifClientStatusError || pushNotifClientConfigError ||
        !pushNotifClientStatus || !pushNotifClientConfig
    ) {
        return <Typography color="error">Error loading PushNotif Client configuration</Typography>;
    }

    // -----------------------------------------------------
    // Render
    // -----------------------------------------------------

    return (
        <>
            <InfoBox boxShadow={5} style={{ marginTop: "3rem", marginBottom: "2rem" }}>
                <Typography color="info">
                    Configure NoCloud with Pushover so you can receive Alerts as Notifications.
                </Typography>
            </InfoBox>

            <Divider sx={{ mt: 1, mb: 1 }} />

            {/* Configuration Section */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid size={{ xs: 6, sm: 6 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={config.enabled}
                                onChange={(e) => updateConfig("enabled", e.target.checked)}
                            />
                        }
                        label="PushNotif enabled"
                        sx={{ mb: 1 }}
                    />
                </Grid>
                <Grid container size={{ xs: 6, sm: 6 }} justifyContent="flex-end">
                    <LoadingButton
                        loading={configurationUpdating}
                        color="primary"
                        variant="outlined"
                        disabled={!configurationModified || configurationUpdating}
                        onClick={() => updateConfiguration(config)}
                    >
                        Save config
                    </LoadingButton>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid size={{ xs: 5, sm: 5 }}>
                    <TextField
                        label="Server"
                        value={config.server}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) =>
                            updateConfig("server", extractHostFromUrl(e.target.value))
                        }
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 2, sm: 2 }}>
                    <TextField
                        label="Port"
                        type="number"
                        value={config.port}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (!Number.isNaN(value)) {
                                updateConfig("port", value);
                            }
                        }}
                        slotProps={{ htmlInput: { min: 1, max: 65535 } }}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 5, sm: 5 }}>
                    <TextField
                        label="Path"
                        value={config.path}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => updateConfig("path", e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        label="Application API Token/Key"
                        value={config.token}
                        disabled={!config.enabled}
                        type="password"
                        variant="standard"
                        onChange={(e) => updateConfig("token", e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        label="User API Key"
                        value={config.user}
                        disabled={!config.enabled}
                        type="password"
                        variant="standard"
                        onChange={(e) => updateConfig("user", e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                        label="Def. Notification Sound"
                        value={config.sound}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => updateConfig("sound", e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                        label="Def. Notification Priority"
                        value={config.priority}
                        select
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => updateConfig("priority", Number(e.target.value))}
                        fullWidth
                    >
                        <MenuItem value={-2}>Silent (-2)</MenuItem>
                        <MenuItem value={-1}>Low (-1)</MenuItem>
                        <MenuItem value={0}>Normal (0)</MenuItem>
                        <MenuItem value={1}>High (1)</MenuItem>
                        <MenuItem value={2}>Emergency (2)</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                        label="RateLimit"
                        type="number"
                        value={config.rateLimit}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (!Number.isNaN(value)) {
                                updateConfig("rateLimit", value);
                            }
                        }}
                        slotProps={{ htmlInput: { min: 1, max: 20 } }}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                        label="RateLimitTimeMS"
                        type="number"
                        value={config.rateLimitTime}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (!Number.isNaN(value)) {
                                updateConfig("rateLimitTime", value);
                            }
                        }}
                        slotProps={{ htmlInput: { min: 1, max: 5*60_000 } }}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={config.pushEvents}
                                onChange={(e) => updateConfig("pushEvents", e.target.checked)}
                            />
                        }
                        label="Push Events"
                        sx={{ mb: 1 }}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={config.processEvents}
                                onChange={(e) => updateConfig("processEvents", e.target.checked)}
                            />
                        }
                        label="Acknowledge Events"
                        sx={{ mb: 1 }}
                    />
                </Grid>
            </Grid>
            <Divider sx={{ mt: 1, mb: 1 }} />

            {/* Status */}
            <PushNotifClientStatusComponent
                status={pushNotifClientStatus}
                statusLoading={pushNotifClientStatusPending}
                stateError={pushNotifClientStatusError}
            />

            {/* Test Notification Section */}
            <Divider sx={{ mt: 4, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
                Test Push Notification
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Title"
                        value={test.title}
                        onChange={(e) => updateTest("title", e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Message"
                        value={test.message}
                        onChange={(e) => updateTest("message", e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        select
                        label="Priority"
                        value={test.priority}
                        onChange={(e) => updateTest("priority", Number(e.target.value))}
                        fullWidth
                        variant="standard"
                    >
                        <MenuItem value={-2}>Silent (-2)</MenuItem>
                        <MenuItem value={-1}>Low (-1)</MenuItem>
                        <MenuItem value={0}>Normal (0)</MenuItem>
                        <MenuItem value={1}>High (1)</MenuItem>
                        <MenuItem value={2}>Emergency (2)</MenuItem>
                    </TextField>
                </Grid>

                {isEmergency && (
                    <>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                label="Retry (seconds)"
                                type="number"
                                value={test.retry}
                                onChange={(e) => updateTest("retry", Number(e.target.value))}
                                fullWidth
                                variant="standard"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                label="Expire (seconds)"
                                type="number"
                                value={test.expire}
                                onChange={(e) => updateTest("expire", Number(e.target.value))}
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                    </>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Sound"
                        value={test.sound}
                        onChange={(e) => updateTest("sound", e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "flex-end" }}>
                    <LoadingButton
                        loading={test.sending}
                        color="secondary"
                        variant="outlined"
                        disabled={!config.enabled}
                        onClick={sendTestPushNotification}
                    >
                        Try Test Notification
                    </LoadingButton>
                </Grid>

                {test.result && (
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "flex-end" }}>
                        <Typography
                            sx={{ mt: 1 }}
                            color={test.result.includes("Failed") ? "error" : "success.main"}
                        >
                            {test.result}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

// ---------------------------------------------------------
// Page Wrapper
// ---------------------------------------------------------

const PushNotifConnectivityPage = (): React.ReactElement => {
    const statusQuery = usePushNotifClientStatusQuery();

    return (
        <PaperContainer>
            <Grid container direction="row">
                <Box sx={{ width: "100%" }}>
                    <DetailPageHeaderRow
                        title="Push Notifications Connectivity"
                        icon={<PushNotifIcon />}
                        onRefreshClick={() => statusQuery.refetch().catch(() => { /* intentional */ })}
                        isRefreshing={statusQuery.isFetching}
                    />
                    <PushNotifConnectivity statusQuery={statusQuery} />
                </Box>
            </Grid>
        </PaperContainer>
    );
};

export default PushNotifConnectivityPage;
