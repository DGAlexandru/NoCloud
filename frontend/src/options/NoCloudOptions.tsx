import React from "react";
import {
    RestartAlt as ConfigRestoreIcon,
    SystemUpdateAlt as UpdaterIcon,
    Badge as FriendlyNameIcon,
} from "@mui/icons-material";
import {ListMenu} from "../components/list_menu/ListMenu";
import PaperContainer from "../components/PaperContainer";
import {
    UpdaterConfiguration,
    useRestoreDefaultConfigurationMutation,
    useUpdaterConfigurationMutation,
    useUpdaterConfigurationQuery,
    useNoCloudCustomizationsMutation,
    useNoCloudCustomizationsQuery
} from "../api";
import {ButtonListMenuItem} from "../components/list_menu/ButtonListMenuItem";
import {SelectListMenuItem, SelectListMenuItemOption} from "../components/list_menu/SelectListMenuItem";
import {SpacerListMenuItem} from "../components/list_menu/SpacerListMenuItem";
import { TextEditModalListMenuItem } from "../components/list_menu/TextEditModalListMenuItem";


const ConfigRestoreButtonListMenuItem = (): React.ReactElement => {
    const {
        mutate: restoreDefaultConfiguration,
        isPending: restoreDefaultConfigurationIsExecuting
    } = useRestoreDefaultConfigurationMutation();

    return (
        <ButtonListMenuItem
            primaryLabel="Restore Default Configuration"
            secondaryLabel="This will only affect NoCloud"
            icon={<ConfigRestoreIcon/>}
            buttonLabel="Go"
            buttonColor={"error"}
            confirmationDialog={{
                title: "Restore default NoCloud configuration?",
                body: "Are you sure that you want to restore the default configuration? This will not affect Wi-Fi settings, Map data etc."
            }}
            action={() => {
                restoreDefaultConfiguration();
            }}
            actionLoading={restoreDefaultConfigurationIsExecuting}
        />
    );
};

const FriendlyNameEditModalListMenuItem = (): React.ReactElement => {
    const {
        data: NoCloudCustomizations,
        isPending: NoCloudCustomizationsPending,
    } = useNoCloudCustomizationsQuery();
    const {
        mutate: updateNoCloudCustomizations,
        isPending: NoCloudCustomizationsUpdating
    } = useNoCloudCustomizationsMutation();

    const description = "Set a custom friendly name for Network Advertisement, MQTT etc.";
    let secondaryLabel = description;

    if (NoCloudCustomizations && NoCloudCustomizations.friendlyName !== "") {
        secondaryLabel = NoCloudCustomizations.friendlyName;
    }

    return (
        <TextEditModalListMenuItem
            isLoading={NoCloudCustomizationsPending || NoCloudCustomizationsUpdating}
            value={NoCloudCustomizations?.friendlyName ?? ""}

            dialog={{
                title: "Custom Friendly Name",
                description: description,

                validatingTransformer: (newValue: string) => {
                    return newValue.replace(/[^a-zA-Z0-9 -]/g, "").slice(0,24);
                },
                onSave: (newValue: string) => {
                    updateNoCloudCustomizations({
                        friendlyName: newValue
                    });
                }
            }}

            icon={<FriendlyNameIcon/>}
            primaryLabel={"Custom Friendly Name"}
            secondaryLabel={secondaryLabel}
        />
    );
};

const updateProviders : Array<SelectListMenuItemOption> = [
    {
        value: "github",
        label: "Release"
    },
    {
        value: "github_nightly",
        label: "Nightly"
    }
];

const UpdateProviderSelectListMenuItem = (): React.ReactElement => {
    const {
        data: storedConfiguration,
        isPending: configurationPending,
        isError: configurationError,
    } = useUpdaterConfigurationQuery();

    const {mutate: updateConfiguration, isPending: configurationUpdating} = useUpdaterConfigurationMutation();

    const disabled = configurationPending || configurationUpdating || configurationError;

    const currentValue = updateProviders.find(provider => provider.value === storedConfiguration?.updateProvider) ?? {value: "", label: ""};

    return (
        <SelectListMenuItem
            options={updateProviders}
            currentValue={currentValue}
            setValue={(e) => {
                updateConfiguration({
                    updateProvider: e.value
                } as UpdaterConfiguration);
            }}
            disabled={disabled}
            loadingOptions={false}
            loadError={configurationError}
            primaryLabel="Update Channel"
            secondaryLabel="Select the channel used by the inbuilt updater"
            icon={<UpdaterIcon/>}
        />
    );
};

const NoCloudOptions = (): React.ReactElement => {
    const listItems = React.useMemo(() => {
        return [
            <ConfigRestoreButtonListMenuItem key={"configRestoreAction"}/>,
            <SpacerListMenuItem key={"spacer0"}/>,
            <FriendlyNameEditModalListMenuItem key={"friendlyName"}/>,
            <UpdateProviderSelectListMenuItem key={"updateProviderSelect"}/>,
        ];
    }, []);

    return (
        <PaperContainer>
            <ListMenu
                primaryHeader={"NoCloud Options"}
                secondaryHeader={"Tunables and actions provided by NoCloud"}
                listItems={listItems}
            />
        </PaperContainer>
    );
};

export default NoCloudOptions;
