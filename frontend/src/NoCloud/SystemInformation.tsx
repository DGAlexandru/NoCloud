import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import {
    useRobotInformationQuery,
    useSystemHostInfoQuery,
    useSystemRuntimeInfoQuery,
    useNoCloudVersionQuery,
    useRobotPropertiesQuery,
    useNoCloudInformationQuery,
    CPUUsageType,
} from "../api";
import RatioBar from "../components/RatioBar";
import { convertSecondsToHumans } from "../utils";
import { useIsMobileView } from "../hooks";
import { useNoCloudColorsInverse } from "../hooks/useNoCloudColors";
import ReloadableCard from "../components/ReloadableCard";
import PaperContainer from "../components/PaperContainer";
import TextInformationGrid from "../components/TextInformationGrid";

// CPU helper
function cpuUsageToPartitions(
    usage: Record<CPUUsageType, number>,
    colors: Record<CPUUsageType, string>
) {
    return Object.entries(usage)
        .filter(([type]) => type !== CPUUsageType.IDLE)
        .map(([type, value]) => ({
            label: type,
            value: value,
            valueLabel: `${value} %`,
            color: colors[type as CPUUsageType],
        }));
}

// RAM helper
function memoryToPartitions(
    mem: { total: number; free: number; NoCloud_current: number; NoCloud_max: number; },
    colors: { system: string; nocloud: string; nocloudMax: string; }
) {
    return [
        {
            label: "System",
            value: mem.total - mem.free - mem.NoCloud_current,
            valueLabel: `${((mem.total - mem.free - mem.NoCloud_current) / 1024 / 1024).toFixed(2)} MiB`,
            color: colors.system,
        },
        {
            label: "NoCloud",
            value: mem.NoCloud_current,
            valueLabel: `${(mem.NoCloud_current / 1024 / 1024).toFixed(2)} MiB`,
            color: colors.nocloud,
        },
        {
            label: "NoCloud (Max)",
            value: mem.NoCloud_max - mem.NoCloud_current,
            valueLabel: `${((mem.NoCloud_max - mem.NoCloud_current) / 1024 / 1024).toFixed(2)} MiB`,
            color: colors.nocloudMax,
        },
    ];
}

// Grid + Typography helper
function InfoGridItem({ header, body }: { header: string; body: string }) {
    return (
        <Grid>
            <Typography variant="caption" color="textSecondary">
                {header}
            </Typography>
            <Typography variant="body2">{body}</Typography>
        </Grid>
    );
}

// --- SystemRuntimeInfo Component ---
const SystemRuntimeInfo = (): React.ReactElement => {
    const { data: systemRuntimeInfo, isPending: systemRuntimeInfoPending } = useSystemRuntimeInfoQuery();

    const [nodeDialogOpen, setNodeDialogOpen] = React.useState(false);
    const [envDialogOpen, setEnvDialogOpen] = React.useState(false);

    const mobileView = useIsMobileView();

    if (systemRuntimeInfoPending) { return <Skeleton height={"6rem"} />; }
    if (!systemRuntimeInfo) { return <Typography color="error">No runtime information</Typography>; }

    const topItems: Array<[string, string]> = [
        ["NoCloud uptime", convertSecondsToHumans(systemRuntimeInfo.uptime)],
        ["UID", String(systemRuntimeInfo.uid)],
        ["GID", String(systemRuntimeInfo.gid)],
        ["PID", String(systemRuntimeInfo.pid)],
        ["argv", systemRuntimeInfo.argv.join(" ")],
    ];

    const versionRows = Object.entries(systemRuntimeInfo.versions).map(([lib, version]) => (
        <TableRow key={lib} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">{lib}</TableCell>
            <TableCell align="right">{version}</TableCell>
        </TableRow>
    ));

    const environmentRows = Object.entries(systemRuntimeInfo.env)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => (
            <TableRow key={key} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">{key}</TableCell>
                <TableCell>{value}</TableCell>
            </TableRow>
        ));

    return (
        <Stack spacing={2}>
            <Grid container spacing={2}>
                {topItems.map(([header, body]) => (
                    <InfoGridItem key={header} header={header} body={body} />
                ))}
            </Grid>

            <ButtonGroup variant="outlined">
                <Button onClick={() => setNodeDialogOpen(true)}>Node</Button>
                <Button onClick={() => setEnvDialogOpen(true)}>Environment</Button>
            </ButtonGroup>

            <Dialog
                open={nodeDialogOpen}
                onClose={() => setNodeDialogOpen(false)}
                scroll="body"
                fullScreen={mobileView}
            >
                <DialogTitle>Node information</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <Grid container spacing={2}>
                            <InfoGridItem header="execPath" body={systemRuntimeInfo.execPath} />
                            <InfoGridItem header="execArgv" body={systemRuntimeInfo.execArgv.join(" ")} />
                        </Grid>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dependency</TableCell>
                                        <TableCell align="right">Version</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>{versionRows}</TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNodeDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={envDialogOpen}
                onClose={() => setEnvDialogOpen(false)}
                fullScreen={mobileView}
                maxWidth="xl"
                scroll="body"
            >
                <DialogTitle>Environment</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Key</TableCell>
                                    <TableCell>Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{environmentRows}</TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEnvDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

// --- SystemInformation Component ---
const SystemInformation = (): React.ReactElement => {
    const palette = useNoCloudColorsInverse();
    const cpuUsageTypeColors = React.useMemo(
        () => ({
            [CPUUsageType.USER]: palette.green,
            [CPUUsageType.NICE]: palette.teal,
            [CPUUsageType.SYS]: palette.red,
            [CPUUsageType.IRQ]: palette.purple,
            [CPUUsageType.IDLE]: "#000000",
        }),
        [palette]
    );
    const memoryColors = React.useMemo(
        () => ({
            system: palette.green,
            nocloud: palette.red,
            nocloudMax: palette.teal,
        }),
        [palette]
    );
    const { data: robotInformation, isPending: robotInformationPending } = useRobotInformationQuery();
    const { data: version, isPending: versionPending } = useNoCloudVersionQuery();
    const { data: NoCloudInformation, isPending: NoCloudInformationPending } = useNoCloudInformationQuery();
    const { data: systemHostInfo, isPending: systemHostInfoPending, isFetching: systemHostInfoFetching, refetch: fetchSystemHostInfo } = useSystemHostInfoQuery();
    const { data: robotProperties, isPending: robotPropertiesPending } = useRobotPropertiesQuery();

    const NoCloudInformationViewLoading = versionPending || NoCloudInformationPending;
    const robotInformationViewLoading = robotInformationPending || robotPropertiesPending;

    // --- Memoized static views ---
    const NoCloudInformationView = React.useMemo(() => {
        if (NoCloudInformationViewLoading) { return <Skeleton height={"4rem"} />; }
        if (!version && !NoCloudInformation) { return <Typography color="error">No NoCloud information</Typography>; }

        const items = [
            { header: "Release", body: version?.release },
            { header: "Commit", body: version?.commit },
            { header: "Embedded", body: NoCloudInformation?.embedded ? "true" : "false" },
            { header: "System ID", body: NoCloudInformation?.systemId },
        ].filter(item => item.body !== undefined) as Array<{ header: string; body: string }>;

        return <TextInformationGrid items={items} />;
    }, [NoCloudInformationViewLoading, version, NoCloudInformation]);

    const robotInformationView = React.useMemo(() => {
        if (robotInformationViewLoading) { return <Skeleton height={"4rem"} />; }
        if (!robotInformation && !robotProperties) { return <Typography color="error">No robot information</Typography>; }

        const items = [
            { header: "Manufacturer", body: robotInformation?.manufacturer },
            { header: "Model", body: robotInformation?.modelName },
            { header: "NoCloud Implementation", body: robotInformation?.implementation },
            { header: "Firmware Version", body: robotProperties?.firmwareVersion },
        ].filter(item => item.body !== undefined) as Array<{ header: string; body: string }>;

        return <TextInformationGrid items={items} />;
    }, [robotInformation, robotInformationViewLoading, robotProperties]);

    // --- System host info (CPU/RAM dynamic) ---
    const systemHostInformation = (() => {
        if (systemHostInfoPending) { return <Skeleton height={"12rem"} />; }
        if (!systemHostInfo) { return <Typography color="textSecondary">No system host information</Typography>; }

        const topItems: Array<[string, string]> = [
            ["Hostname", systemHostInfo.hostname],
            ["Arch", systemHostInfo.arch],
            ["Uptime", convertSecondsToHumans(systemHostInfo.uptime)],
        ];

        return (
            <Grid container spacing={2}>
                {topItems.map(([header, body]) => <InfoGridItem key={header} header={header} body={body} />)}

                <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="textSecondary">System Memory (RAM)</Typography>
                    <RatioBar
                        total={systemHostInfo.mem.total}
                        totalLabel={`${(systemHostInfo.mem.free / 1024 / 1024).toFixed(2)} MiB`}
                        partitions={memoryToPartitions(systemHostInfo.mem, memoryColors)}
                        noneLegendLabel="Free"
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="textSecondary">CPU Usage</Typography>
                    {systemHostInfo.cpus.map((cpu, i) => (
                        <RatioBar
                            key={`cpu_${i}`}
                            style={{ marginTop: "4px" }}
                            total={100}
                            partitions={cpuUsageToPartitions(cpu.usage, cpuUsageTypeColors)}
                            hideLegend={i !== systemHostInfo.cpus.length - 1}
                            noneLegendLabel="idle"
                        />
                    ))}
                </Grid>
            </Grid>
        );
    })();

    return (
        <PaperContainer>
            <Grid container spacing={2}>
                <Grid style={{ flexGrow: 1 }}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Robot</Typography>
                            <Divider />
                            {robotInformationView}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid style={{ flexGrow: 1 }}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>NoCloud</Typography>
                            <Divider />
                            {NoCloudInformationView}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid style={{ flexGrow: 1 }}>
                    <ReloadableCard title="System Host Information" loading={systemHostInfoFetching} boxShadow={3} onReload={fetchSystemHostInfo}>
                        {systemHostInformation}
                    </ReloadableCard>
                </Grid>

                <Grid style={{ flexGrow: 1 }}>
                    <SystemRuntimeInfo />
                </Grid>
            </Grid>
        </PaperContainer>
    );
};

export default SystemInformation;
