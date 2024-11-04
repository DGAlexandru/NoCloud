import React from "react";
import {PaletteMode} from "@mui/material";
import AppRouter from "./AppRouter";
import WelcomeDialog from "./components/WelcomeDialog";
import {useNoCloudInformationQuery} from "./api";
import NoCloudSplash from "./components/NoCloudSplash";

export const MainApp: React.FunctionComponent<{
    paletteMode: PaletteMode,
    setPaletteMode: (newMode: PaletteMode) => void
}> = ({
    paletteMode,
    setPaletteMode
}): React.ReactElement => {
    const {
        data: NoCloudInformation,
        isPending: NoCloudInformationPending
    } = useNoCloudInformationQuery();
    const [hideWelcomeDialog, setHideWelcomeDialog] = React.useState(false);

    if (NoCloudInformationPending || !NoCloudInformation) {
        return <NoCloudSplash/>;
    }

    return (
        <>
            <AppRouter paletteMode={paletteMode} setPaletteMode={setPaletteMode}/>
            {
                !NoCloudInformation.welcomeDialogDismissed &&
                <WelcomeDialog
                    open={!(NoCloudInformation.welcomeDialogDismissed || hideWelcomeDialog)}
                    hide={() => setHideWelcomeDialog(true)}
                />
            }
        </>
    );
};
