import React from "react";
import {PaletteMode} from "@mui/material";
import {Capability, useNoCloudInformationQuery, useWifiStatusQuery} from "./api";
import {useCapabilitiesSupported} from "./CapabilitiesProvider";
import ProvisioningPage from "./ProvisioningPage";
import NoCloudSplash from "./components/NoCloudSplash";
import {MainApp} from "./MainApp";

//This is either just an artifact of how React works or I'm doing something wrong
const RouterChoiceStageTwo: React.FunctionComponent<{
    paletteMode: PaletteMode,
    setPaletteMode: (newMode: PaletteMode) => void,
    setBypassProvisioning: (bypassProvisioning: boolean) => void
}> = ({
    paletteMode,
    setPaletteMode,
    setBypassProvisioning
}): React.ReactElement => {
    const {
        data: wifiConfiguration,
        isPending: wifiConfigurationPending,
    } = useWifiStatusQuery();

    React.useEffect(() => {
        if (wifiConfiguration?.state === "connected") {
            //This skips rendering any of this next time the wifiConfiguration is refreshed
            setBypassProvisioning(true);
        }
    }, [setBypassProvisioning, wifiConfiguration]);

    if (wifiConfigurationPending) {
        return <NoCloudSplash/>;
    }

    if (wifiConfiguration && wifiConfiguration.state === "not_connected") {
        return <ProvisioningPage/>;
    }

    return (
        <MainApp paletteMode={paletteMode} setPaletteMode={setPaletteMode}/>
    );
};

const RouterChoice: React.FunctionComponent<{
    paletteMode: PaletteMode,
    setPaletteMode: (newMode: PaletteMode) => void
}> = ({
    paletteMode,
    setPaletteMode
}): React.ReactElement => {
    const [bypassProvisioning, setBypassProvisioning] = React.useState(false);
    const [wifiConfigSupported] = useCapabilitiesSupported(Capability.WifiConfiguration);
    const {
        data: NoCloudInformation,
        isPending: NoCloudInformationPending
    } = useNoCloudInformationQuery();

    if (NoCloudInformationPending || !NoCloudInformation) {
        return <NoCloudSplash/>;
    }

    if (!bypassProvisioning && wifiConfigSupported) {
        if (NoCloudInformation.embedded) {
            return <RouterChoiceStageTwo
                paletteMode={paletteMode}
                setPaletteMode={setPaletteMode}
                setBypassProvisioning={setBypassProvisioning}
            />;
        }
    }

    return (
        <MainApp paletteMode={paletteMode} setPaletteMode={setPaletteMode}/>
    );
};

export default RouterChoice;
