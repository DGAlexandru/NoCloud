import EditMap, { mode } from "./EditMap";
import React from "react";
import {Box, Button, CircularProgress, styled, Typography, useTheme} from "@mui/material";
import {Capability, useRobotMapQuery, useRobotStatusQuery} from "../api";
import {MapAnnotationsHelp} from "./res/MapAnnotationsHelp";
import {SegmentEditHelp} from "./res/SegmentEditHelp";
import {VirtualRestrictionEditHelp} from "./res/VirtualRestrictionEditHelp";
import {useCapabilitiesSupported} from "../CapabilitiesProvider";
import {useSnackbar} from "notistack";


const Container = styled(Box)({
    flex: "1",
    height: "100%",
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center",
});

const EditMapPage = (props: {
    mode: mode;
}): React.ReactElement => {
    const {
        data: mapData,
        isPending: mapIsPending,
        isError: mapLoadError,
        refetch: refetchMap
    } = useRobotMapQuery();
    const {
        data: robotStatus,
        isPending: robotStatusPending
    } = useRobotStatusQuery();

    const [
        combinedVirtualRestrictionsCapabilitySupported,

        mapSegmentEditCapabilitySupported,
        mapSegmentMaterialControlCapabilitySupported,
        mapSegmentRenameCapabilitySupported,

        mapAnnotationsCapabilitySupported,
    ] = useCapabilitiesSupported(
        Capability.CombinedVirtualRestrictions,

        Capability.MapSegmentEdit,
        Capability.MapSegmentMaterialControl,
        Capability.MapSegmentRename,

        Capability.MapAnnotations
    );

    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();

    let helpText = "";

    if (props.mode === "segments") {
        helpText = SegmentEditHelp;
    } else if (props.mode === "virtual_restrictions") {
        helpText = VirtualRestrictionEditHelp;
    } else if (props.mode === "annotations") {
        helpText = MapAnnotationsHelp;
    }

    if (mapLoadError) {
        return (
            <Container>
                <Typography color="error">Error loading map data</Typography>
                <Box m={1}/>
                <Button color="primary" variant="contained" onClick={() => {
                    return refetchMap();
                }}>
                    Retry
                </Button>
            </Container>
        );
    }

    if ((!mapData && mapIsPending) || (!robotStatus && robotStatusPending)) {
        return (
            <Container>
                <CircularProgress/>
            </Container>
        );
    }

    if (!mapData) {
        return (
            <Container>
                <Typography align="center">No map data</Typography>;
            </Container>
        );
    }

    if (!robotStatus) {
        return (
            <Container>
                <Typography align="center">No robot status</Typography>;
            </Container>
        );
    }

    return <EditMap
        rawMap={mapData}
        paletteMode={theme.palette.mode}
        mode={props.mode}
        helpText={helpText}
        robotStatus={robotStatus}
        enqueueSnackbar={enqueueSnackbar}

        supportedCapabilities={{
            [Capability.CombinedVirtualRestrictions]: combinedVirtualRestrictionsCapabilitySupported,

            [Capability.MapSegmentEdit]: mapSegmentEditCapabilitySupported,
            [Capability.MapSegmentMaterialControl]: mapSegmentMaterialControlCapabilitySupported,
            [Capability.MapSegmentRename]: mapSegmentRenameCapabilitySupported,

            [Capability.MapAnnotations]: mapAnnotationsCapabilitySupported,
        }}
    />;
};

export default EditMapPage;
