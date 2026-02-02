import {
    alpha,
    Button,
    Autocomplete,
    FormControl,
    Grid2,
    InputBase,
    InputLabel,
    MenuItem,
    Select,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import {Refresh as RefreshIcon, FilterAlt as FilterAltIcon} from "@mui/icons-material";
import React from "react";
import styles from "./Log.module.css";
import {
    LogLevel,
    LogLine,
    ManualMIoTCommandAction,
    useLogLevelMutation,
    useLogLevelQuery,
    useManualMIoTCommandInteraction,
    useManualMIoTCommandPropertiesQuery,
    useNoCloudLogQuery
} from "../api";
import LogViewer from "../components/LogViewer";
import PaperContainer from "../components/PaperContainer";

const Search = styled("div")(({theme}) => {
    return {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: "100%",
        flexGrow: 1,
        [theme.breakpoints.up("sm")]: {
            width: "auto",
        },
    };
});

const SearchIconWrapper = styled("div")(({theme}) => {
    return {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
});

const StyledInputBase = styled(InputBase)(({theme}) => {
    return {
        color: "inherit",
        flexGrow: 1,
        display: "flex",
        "& .MuiInputBase-input": {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create("width"),
            width: "100%",
            flexGrow: 1,
            [theme.breakpoints.up("md")]: {
                width: "20ch",
            },
        },
    };
});

const StyledTextField = styled(TextField)(({ theme }) => ({
    color: "inherit",
    flexGrow: 1,
    display: "flex",
    "& .MuiInputBase-input": {
        //padding: theme.spacing(1, 1, 1, 0),
        //paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        flexGrow: 1,
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

const Log = (): React.ReactElement => {
    const [filter, setFilter] = React.useState("");

    const {
        data: logData,
        isFetching: logDataFetching,
        isError: logError,
        refetch: logRefetch,
    } = useNoCloudLogQuery();

    const {
        data: logLevel,
        isError: logLevelError,
        refetch: logLevelRefetch
    } = useLogLevelQuery();

    const {mutate: mutateLogLevel} = useLogLevelMutation();
    // Code for the menu that allows running manual MIoT commands
    const showManualMIoTCommandUI = true;
    const {mutate: execManualMIoTCommand, isPending: isHandleRunPending} = useManualMIoTCommandInteraction();
    // State for command selection
    const [miotCmd, setMiotCmd] = React.useState<ManualMIoTCommandAction>("get_properties");
    // Fetch supported actions from the robot
    const { data: manualMIoTProperties } = useManualMIoTCommandPropertiesQuery();
    const suppMiotCmd: string[] = React.useMemo(
        () => manualMIoTProperties?.supportedManualMIoTCommandActions ?? [],
        [manualMIoTProperties] // recompute only when the query data changes
    );
    const [siid, setSiid] = React.useState("1");
    const [piid, setPiid] = React.useState("5");
    const [Value, setValue] = React.useState("0");

    const handleRun = React.useCallback(() => {
        const finalValue = Value.trim() === "" ? undefined : Value;
        // eslint-disable-next-line no-console
        console.log("Running with values:", {miotcmd: `"${miotCmd}"`,
            siid: Number(siid), piid: Number(piid), value: finalValue}
        );
        execManualMIoTCommand({
            miotcmd: miotCmd,
            siid: siid,
            piid: piid,
            value: finalValue,
        });
    }, [miotCmd, siid, piid, Value, execManualMIoTCommand]);
    // Helper function to handle input changes
    const handleNumericInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setState: (value: string) => void, // create a dynamic setter function
        currentValue: string,
        maxDigits: number
    ) => {
        // Prevent non-numeric characters and allow max 'maxDigits' chars; allow it to be empty or 0, for editing reasons
        if (new RegExp(`^[0-9]{0,${maxDigits}}$`).test(e.target.value)) {
            setState(e.target.value);  // Dynamically call the setter function
        } else {
            // If input doesn't match, keep the current value
            setState(currentValue); // Ensures value doesn't change to invalid state
        }
    };

    const logLines = React.useMemo(() => {
        if (logError || logLevelError) {
            return <Typography color="error">Error loading log</Typography>;
        }

        const processedLog : Array<LogLine> = [];
        let filteredLog;

        if (logData) {
            // noinspection RegExpRedundantEscape
            const loglineRegex = /^\[(?<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)\] \[(?<level>[A-Z]+)\] (?<content>.*)$/;

            logData.split("\n").forEach(line => {
                const match = loglineRegex.exec(line);

                if (match && match.groups) {
                    processedLog.push({
                        timestamp: new Date(match.groups.timestamp),
                        level: match.groups.level.toLowerCase() as LogLevel,
                        content: match.groups.content
                    });
                } else if (processedLog[processedLog.length -1]) {
                    processedLog[processedLog.length -1].content += "\n" + line;
                }
            });
        }

        const lowerFilter = filter.toLowerCase();

        if (filter) {
            filteredLog = processedLog.filter(line => {
                return line.level.includes(lowerFilter) || line.content.toLowerCase().includes(lowerFilter);
            });
        } else {
            filteredLog = processedLog;
        }

        return (
            <Grid2 container>
                <Grid2
                    container
                    alignItems={"center"}
                    columnSpacing={1}
                    rowSpacing={2}
                    columns={{xs: 4, sm: 12}}
                    sx={{
                        mb: 2,
                        width: "100%",
                        userSelect: "none"
                    }}
                >
                    <Grid2 size={{xs: 4, sm: 9}}>
                        <Search>
                            <SearchIconWrapper>
                                <FilterAltIcon/>
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Filter…"
                                inputProps={{
                                    "aria-label": "filter",
                                    value: filter,
                                    onChange: (e: any) => {
                                        setFilter((e.target as HTMLInputElement).value);
                                    }
                                }}
                            />
                        </Search>
                    </Grid2>
                    <Grid2 size={{xs: 3, sm:2}}>
                        <FormControl fullWidth>
                            <InputLabel id="log-level-selector">Current Level</InputLabel>
                            <Select
                                labelId="log-level-selector"
                                value={logLevel?.current || "info"}
                                label="Current Level"
                                onChange={(e) => {
                                    mutateLogLevel({
                                        level: e.target.value as LogLevel
                                    });
                                }}
                            >
                                {logLevel?.presets.map(preset => {
                                    return <MenuItem key={preset} value={preset}>{preset}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{xs: 1, sm: 1}}>
                        <Button
                            loading={logDataFetching}
                            onClick={() => {
                                logLevelRefetch().catch(err => {
                                    // eslint-disable-next-line no-console
                                    console.error(err);
                                });
                                logRefetch().catch(err => {
                                    // eslint-disable-next-line no-console
                                    console.error(err);
                                });
                            }}
                            title="Refresh"
                        >
                            <RefreshIcon/>
                        </Button>
                    </Grid2>
                </Grid2>
                <Grid2
                    sx={{
                        width: "100%"
                    }}
                >
                    <LogViewer
                        className={styles.logViewer}
                        style={{
                            width: "100%"
                        }}
                        logLines={filteredLog}
                    />
                </Grid2>
                {/* UI for the menu that allows running manual MIoT commands */}
                {showManualMIoTCommandUI && (
                    <Grid2 container spacing={1} alignItems="center" columns={{ xs: 7, sm: 16 }}
                        justifyContent="space-evenly" className={styles.logInputLine}
                    >
                        <Grid2 size={{ xs: 3, sm: 4 }} className={styles.logInputItem} component="div">
                            <Typography variant="caption" component="label" htmlFor="miotcmd-input">
                                Command
                            </Typography>
                            <Autocomplete
                                freeSolo // allow typing custom values
                                options={suppMiotCmd}
                                value={miotCmd}
                                onInputChange={(event, newInputValue) => setMiotCmd(newInputValue)}
                                renderInput={(params) => ( <StyledTextField {...params} id="miotcmd-input" variant="outlined" size="small" /> )}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 2, sm: 2 }} className={styles.logInputItem} component="div">
                            <Typography variant="caption" component="label" htmlFor="siid-input">
                                SIID
                            </Typography>
                            <Search>
                                <StyledInputBase
                                    sx={{ "& .MuiInputBase-input": { paddingLeft: "1em" }, }} // override left padding
                                    id="siid-input"
                                    type="number"
                                    value={siid} // React-controlled value
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInputChange(e, setSiid, siid, 5) }
                                    // Ensure the input isn't empty or 0 when the user leaves the field - we allowed it to be empty or 0 for editing reasons
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => { if ((e.target.value === "") || (e.target.value === "0")) { setSiid("1"); } }}
                                    inputProps={{ min: 1, max: 99999, step: 1 }}
                                />
                            </Search>
                        </Grid2>
                        <Grid2 size={{ xs: 1, sm: 2 }} className={styles.logInputItem} component="div">
                            <Typography variant="caption" component="label" htmlFor="piid-input">
                                PIID
                            </Typography>
                            <Search>
                                <StyledInputBase
                                    sx={{ "& .MuiInputBase-input": { paddingLeft: 1 }, }} // override left padding
                                    id="piid-input"
                                    type="number"
                                    value={piid} // React-controlled value
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericInputChange(e, setPiid, piid, 4) }
                                    // Ensure the input isn't empty or 0 when the user leaves the field - we allowed it to be empty or 0 for editing reasons
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => { if ((e.target.value === "") || (e.target.value === "0")) { setSiid("1"); } }}
                                    inputProps={{ min: 1, max: 9999, step: 1 }}
                                />
                            </Search>
                        </Grid2>
                        <Grid2 size={{ xs: 1, sm: 1 }} component="div" sx={{ order: { xs: 4, sm: 5 } }}>
                            <Typography variant="caption" component="label" sx={{ visibility: "hidden" }}>
                                Run
                            </Typography>
                            <Button id="run-button-xs" variant="contained" fullWidth
                                onClick={handleRun}
                                disabled={isHandleRunPending}
                                loading={isHandleRunPending}
                            >
                                Run
                            </Button>
                        </Grid2>
                        <Grid2 size={{ xs: 7, sm: 7 }} className={styles.logInputItem} component="div"
                            sx={{ order: { xs: 5, sm: 4 } }}
                        >
                            <Typography variant="caption" component="label" htmlFor="value-input">
                                Value
                            </Typography>
                            <Search>
                                <StyledInputBase
                                    sx={{ "& .MuiInputBase-input": { paddingLeft: 1 }, }} // override left padding
                                    id="value-input"
                                    value={Value}  // Directly passing React-controlled value
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setValue(e.target.value); }} // Handle state update for Value
                                    // Ensure the input isn't empty when the user leaves the field - we allowed it to be empty for editing reasons
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => { if (e.target.value === "") { setValue("0"); } }}
                                />
                            </Search>
                        </Grid2>
                    </Grid2>
                )}

            </Grid2>
        );
    }, [
        logData, logDataFetching, logError, logRefetch,
        logLevel, logLevelError, logLevelRefetch, mutateLogLevel,
        filter, setFilter,
        showManualMIoTCommandUI, miotCmd, siid, piid, Value, suppMiotCmd, handleRun, isHandleRunPending
    ]);

    return (
        <PaperContainer>
            {logLines}
        </PaperContainer>
    );
};

export default Log;
