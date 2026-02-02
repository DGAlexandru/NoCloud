import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid2,
    MenuItem,
    Skeleton,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import {
    PushNotifClientStatus,
    SendPushNotifClientParams,
    sendPushNotifClientMessage,
    usePushNotifClientConfigurationMutation,
    usePushNotifClientConfigurationQuery,
    usePushNotifClientStatusQuery,
} from "../../api";

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
        <Grid2 container alignItems="center" direction="column" sx={{ paddingBottom: "1rem" }}>
            <Grid2 sx={{ marginTop: "1rem" }}>{stateDef?.icon}</Grid2>
            <Grid2
                sx={{
                    maxWidth: "100% !important",
                    wordWrap: "break-word",
                    textAlign: "center",
                    userSelect: "none",
                }}
            >
                {stateDef?.content(status)}
            </Grid2>
            <Grid2
                sx={{
                    maxWidth: "100% !important",
                    wordWrap: "break-word",
                    textAlign: "center",
                    userSelect: "none",
                    marginTop: "0.5rem",
                }}
            >
                Current robot time: {status.robotTime}
            </Grid2>
        </Grid2>
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
    retry: number;
    expire: number;
    titleID: string;
    url: string;
    rateLimit: number;
    rateLimitTime: number;
    pushEvents: boolean;
    processEvents: boolean;
};

type TestNotifState = {
    title: string;
    message: string;
    sound: string;
    priority: number;
    retry: number;
    expire: number;
    sending: boolean;
    result: string | null;
};

const priorities = [
    { value: -2, label: "Silent (-2)" },
    { value: -1, label: "Low (-1)" },
    { value: 0, label: "Normal (0)" },
    { value: 1, label: "High (1)" },
    { value: 2, label: "Emergency (2)" }
];

const sounds = [
    { value: "none", label: "None (silent)" },
    { value: "alien", label: "Alien Alarm (long)" },
    { value: "bike", label: "Bike" },
    { value: "bugle", label: "Bugle" },
    { value: "cashregister", label: "Cash Register" },
    { value: "classical", label: "Classical" },
    { value: "climb", label: "Climb (long)" },
    { value: "cosmic", label: "Cosmic" },
    { value: "echo", label: "Pushover Echo (long)" },
    { value: "falling", label: "Falling" },
    { value: "gamelan", label: "Gamelan" },
    { value: "incoming", label: "Incoming" },
    { value: "intermission", label: "Intermission" },
    { value: "magic", label: "Magic" },
    { value: "mechanical", label: "Mechanical" },
    { value: "persistent", label: "Persistent (long)" },
    { value: "pianobar", label: "Piano Bar" },
    { value: "pushover", label: "Pushover (default)" },
    { value: "siren", label: "Siren" },
    { value: "spacealarm", label: "Space Alarm" },
    { value: "tugboat", label: "Tug Boat" },
    { value: "updown", label: "Up Down (long)" },
    { value: "vibrate", label: "Vibrate Only" }
];

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
        retry: 30,
        expire: 600,
        titleID: "Robot1",
        url: "http://127.0.0.1/",
        rateLimit: 5,
        rateLimitTime: 60_000,
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
        title: "Robot1 - Test Push Notification",
        message: "This is a NoCloud push notification test.",
        sound: "siren",
        priority: 0,
        retry: 30,
        expire: 600,
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
                title: test.title || "Robot1 - Test Push Notification",
                message: test.message || "This is a NoCloud push notification test.",
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
            <Grid2 container spacing={1} sx={{ mb: 1 }}>
                <Grid2 size={{ xs: 5, sm: 5 }}>
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
                </Grid2>
                <Grid2 size={{ xs: 3, sm: 3 }}>
                    <TextField
                        label="Robot Name"
                        value={config.titleID}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => updateConfig("titleID", e.target.value)}
                        fullWidth
                    />
                </Grid2>
                <Grid2 container size={{ xs: 4, sm: 4 }} justifyContent="flex-end">
                    <Button
                        loading={configurationUpdating}
                        color="primary"
                        variant="outlined"
                        disabled={!configurationModified || configurationUpdating}
                        onClick={() => updateConfiguration(config)}
                    >
                        Save config
                    </Button>
                </Grid2>
            </Grid2>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <Grid2 container spacing={1} sx={{ mb: 1 }}>
                <Grid2 size={{ xs: 5, sm: 5 }}>
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
                </Grid2>
                <Grid2 size={{ xs: 2, sm: 2 }}>
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
                </Grid2>
                <Grid2 size={{ xs: 5, sm: 5 }}>
                    <TextField
                        label="Path"
                        value={config.path}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => updateConfig("path", e.target.value)}
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                    <TextField
                        label="Application API Token/Key"
                        value={config.token}
                        disabled={!config.enabled}
                        type="password"
                        variant="standard"
                        onChange={(e) => updateConfig("token", e.target.value)}
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                    <TextField
                        label="User API Key"
                        value={config.user}
                        disabled={!config.enabled}
                        type="password"
                        variant="standard"
                        onChange={(e) => updateConfig("user", e.target.value)}
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                    <TextField
                        label="NoCloud URL"
                        value={config.url}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => updateConfig("url", e.target.value)}
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 2 }}>
                    <TextField
                        label="Notification Sound"
                        value={config.sound}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => updateConfig("sound", e.target.value)}
                        fullWidth
                        select
                    >
                        {sounds.map((sound) => (
                            <MenuItem key={sound.value} value={sound.value}>
                                {sound.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 2 }}>
                    <TextField
                        label="Notification Priority"
                        value={config.priority}
                        disabled={!config.enabled}
                        variant="standard"
                        onChange={(e) => updateConfig("priority", Number(e.target.value))}
                        fullWidth
                        select
                    >
                        {priorities.map((p) => (
                            <MenuItem key={p.value} value={p.value}>
                                {p.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid2>
                {(config.priority === 2) && (
                    <>
                        <Grid2 size={{ xs: 6, sm: 2 }}>
                            <TextField
                                label="Sec. between retries"
                                type="number"
                                value={config.retry}
                                disabled={!config.enabled}
                                variant="standard"
                                onChange={(e) => updateConfig("retry", Number(e.target.value))}
                                slotProps={{ htmlInput: { min: 30, max: 10*60 } }}
                                fullWidth
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 6, sm: 2 }}>
                            <TextField
                                label="Expiration (sec)"
                                type="number"
                                value={config.expire}
                                disabled={!config.enabled}
                                variant="standard"
                                onChange={(e) => updateConfig("expire", Number(e.target.value))}
                                slotProps={{ htmlInput: { min: 10*60, max: 3*60*60 } }}
                                fullWidth
                            />
                        </Grid2>
                    </>
                )}
                <Grid2 size={{ xs: 6, sm: 2 }}>
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
                        slotProps={{ htmlInput: { min: 1, max: 50 } }}
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 2 }}>
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
                        slotProps={{ htmlInput: { min: 30_000, max: 5*60_000 } }}
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 2 }}>
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
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 2 }}>
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
                </Grid2>
            </Grid2>
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
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Title"
                        value={test.title}
                        variant="standard"
                        onChange={(e) => updateTest("title", e.target.value)}
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Message"
                        value={test.message}
                        variant="standard"
                        onChange={(e) => updateTest("message", e.target.value)}
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                    <TextField
                        label="Priority"
                        value={test.priority}
                        variant="standard"
                        onChange={(e) => updateTest("priority", Number(e.target.value))}
                        fullWidth
                        select
                    >
                        {priorities.map((p) => (
                            <MenuItem key={p.value} value={p.value}>
                                {p.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid2>
                {isEmergency && (
                    <>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <TextField
                                label="Sec. between retries"
                                type="number"
                                value={test.retry}
                                variant="standard"
                                onChange={(e) => updateTest("retry", Number(e.target.value))}
                                slotProps={{ htmlInput: { min: 30, max: 10*60 } }}
                                fullWidth
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <TextField
                                label="Expiration (sec)"
                                type="number"
                                value={test.expire}
                                variant="standard"
                                onChange={(e) => updateTest("expire", Number(e.target.value))}
                                slotProps={{ htmlInput: { min: 10*60, max: 3*60*60 } }}
                                fullWidth
                            />
                        </Grid2>
                    </>
                )}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Notif Test Sound"
                        value={test.sound}
                        variant="standard"
                        onChange={(e) => updateTest("sound", e.target.value)}
                        fullWidth
                        select
                    >
                        {sounds.map((sound) => (
                            <MenuItem key={sound.value} value={sound.value}>
                                {sound.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "flex-end" }}>
                    <Button
                        loading={test.sending}
                        color="secondary"
                        variant="outlined"
                        disabled={!config.enabled}
                        onClick={sendTestPushNotification}
                    >
                        Try Test Notification
                    </Button>
                </Grid2>
                {test.result && (
                    <Grid2 size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "flex-end" }}>
                        <Typography
                            sx={{ mt: 1 }}
                            color={test.result.includes("Failed") ? "error" : "success.main"}
                        >
                            {test.result}
                        </Typography>
                    </Grid2>
                )}
            </Grid2>
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
            <Grid2 container direction="row">
                <Box sx={{ width: "100%" }}>
                    <DetailPageHeaderRow
                        title="Push Notifications Connectivity"
                        icon={<PushNotifIcon />}
                        onRefreshClick={() => statusQuery.refetch().catch(() => { /* intentional */ })}
                        isRefreshing={statusQuery.isFetching}
                    />
                    <PushNotifConnectivity statusQuery={statusQuery} />
                </Box>
            </Grid2>
        </PaperContainer>
    );
};

export default PushNotifConnectivityPage;
