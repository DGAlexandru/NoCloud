// noinspection HtmlUnknownAttribute

import {useCapabilitiesSupported} from "../CapabilitiesProvider";
import {
    AutoEmptyDockAutoEmptyDuration,
    AutoEmptyDockAutoEmptyInterval,
    Capability,
    CarpetSensorMode,
    CleanRoute,
    MopDockMopDryingDuration,
    MopDockMopWashTemperature,
    MopTwistFrequency,
    useAutoEmptyDockAutoEmptyDurationControlPropertiesQuery,
    useAutoEmptyDockAutoEmptyDurationMutation,
    useAutoEmptyDockAutoEmptyDurationQuery,
    useAutoEmptyDockAutoEmptyIntervalMutation,
    useAutoEmptyDockAutoEmptyIntervalPropertiesQuery,
    useAutoEmptyDockAutoEmptyIntervalQuery,
    useCarpetSensorModeMutation,
    useCarpetSensorModePropertiesQuery,
    useCarpetSensorModeQuery,
    useCleanRouteControlPropertiesQuery,
    useCleanRouteQuery,
    useCleanRouteMutation,
    useLocateMutation,
    useMopDockMopDryingTimeControlPropertiesQuery,
    useMopDockMopDryingTimeMutation,
    useMopDockMopDryingTimeQuery,
    useMopDockMopWashTemperatureMutation,
    useMopDockMopWashTemperaturePropertiesQuery,
    useMopDockMopWashTemperatureQuery,
    useMopTwistFrequencyMutation,
    useMopTwistFrequencyPropertiesQuery,
    useMopTwistFrequencyQuery,
} from "../api";
import React from "react";
import {ListMenu} from "../components/list_menu/ListMenu";
import {SimpleToggleCapabilitySwitch} from "../components/SimpleToggleCapabilitySwitch";
import {SIMPLE_TOGGLE_UI_CONFIGS} from "./simpleToggleConfigs";
import {
    AutoDelete as AutoEmptyIntervalControlIcon,
    AvTimer as AutoEmptyDockAutoEmptyDurationControlIcon,
    AvTimer as MopDockMopDryingTimeControlIcon,
    DeviceThermostat as MopDockMopWashTemperatureControlIcon,
    MiscellaneousServices as SystemIcon,
    NotListedLocation as LocateIcon,
    Route as CleanRouteControlIcon,
    SatelliteAlt as PerceptionIcon,
    Schema as BehaviourIcon,
    Settings as GeneralIcon,
    Star as QuirksIcon,
    Troubleshoot as CarpetSensorModeIcon,
    Tune as MiscIcon,
    Villa as DockIcon,
} from "@mui/icons-material";
import {SpacerListMenuItem} from "../components/list_menu/SpacerListMenuItem";
import {LinkListMenuItem} from "../components/list_menu/LinkListMenuItem";
import PaperContainer from "../components/PaperContainer";
import {ButtonListMenuItem} from "../components/list_menu/ButtonListMenuItem";
import {SelectListMenuItem, SelectListMenuItemOption} from "../components/list_menu/SelectListMenuItem";
import {SubHeaderListMenuItem} from "../components/list_menu/SubHeaderListMenuItem";
import {
    MopTwistControlCapability as MopTwistFrequencyControlIcon,
} from "../components/CustomIcons";

const LocateButtonListMenuItem = (): React.ReactElement => {
    const {
        mutate: locate,
        isPending: locateIsExecuting
    } = useLocateMutation();

    return (
        <ButtonListMenuItem
            primaryLabel="Locate Robot"
            secondaryLabel="The robot will play a sound to announce its location."
            icon={<LocateIcon/>}
            buttonLabel="Go"
            action={() => {
                locate();
            }}
            actionLoading={locateIsExecuting}
        />
    );
};

const AutoEmptyDockAutoEmptyDurationControlCapabilitySelectListMenuItem = () => {
    const SORT_ORDER = {
        "auto": 1,
        "short": 2,
        "medium": 3,
        "long": 4
    };

    const {
        data: autoEmptyDurationProperties,
        isPending: autoEmptyDurationPropertiesPending,
        isError: autoEmptyDurationPropertiesError
    } = useAutoEmptyDockAutoEmptyDurationControlPropertiesQuery();

    const options: Array<SelectListMenuItemOption> = (
        autoEmptyDurationProperties?.supportedDurations ?? []
    ).sort((a, b) => {
        const aMapped = SORT_ORDER[a] ?? 10;
        const bMapped = SORT_ORDER[b] ?? 10;

        if (aMapped < bMapped) {
            return -1;
        } else if (bMapped < aMapped) {
            return 1;
        } else {
            return 0;
        }
    }).map((val: AutoEmptyDockAutoEmptyDuration) => {
        let label;

        switch (val) {
            case "auto":
                label = "Auto";
                break;
            case "short":
                label = "Short";
                break;
            case "medium":
                label = "Medium";
                break;
            case "long":
                label = "Long";
                break;
        }

        return {
            value: val,
            label: label
        };
    });

    const {
        data: data,
        isPending: isPending,
        isFetching: isFetching,
        isError: isError,
    } = useAutoEmptyDockAutoEmptyDurationQuery();

    const {mutate: mutate, isPending: isChanging} = useAutoEmptyDockAutoEmptyDurationMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    const currentValue = options.find(mode => {
        return mode.value === data;
    }) ?? {value: "", label: ""};


    return (
        <SelectListMenuItem
            options={options}
            currentValue={currentValue}
            setValue={(e) => {
                mutate(e.value as AutoEmptyDockAutoEmptyDuration);
            }}
            disabled={disabled}
            loadingOptions={autoEmptyDurationPropertiesPending || isPending}
            loadError={autoEmptyDurationPropertiesError}
            primaryLabel="Dock Auto-Empty Duration"
            secondaryLabel={"Configure the duration of the auto-empty cycle."}
            icon={<AutoEmptyDockAutoEmptyDurationControlIcon/>}
        />
    );
};

const AutoEmptyDockAutoEmptyIntervalControlCapabilitySelectListMenuItem = () => {
    const SORT_ORDER = {
        "frequent": 1,
        "normal": 2,
        "infrequent": 3,
        "off": 4
    };

    const {
        data: autoEmptyDockAutoEmptyIntervalProperties,
        isPending: autoEmptyDockAutoEmptyIntervalPropertiesPending,
        isError: autoEmptyDockAutoEmptyIntervalPropertiesError
    } = useAutoEmptyDockAutoEmptyIntervalPropertiesQuery();

    const options: Array<SelectListMenuItemOption> = (
        autoEmptyDockAutoEmptyIntervalProperties?.supportedIntervals ?? []
    ).sort((a, b) => {
        const aMapped = SORT_ORDER[a] ?? 10;
        const bMapped = SORT_ORDER[b] ?? 10;

        if (aMapped < bMapped) {
            return -1;
        } else if (bMapped < aMapped) {
            return 1;
        } else {
            return 0;
        }
    }).map((val: AutoEmptyDockAutoEmptyInterval) => {
        let label;

        switch (val) {
            case "frequent":
                label = "Frequent";
                break;
            case "normal":
                label = "Normal";
                break;
            case "infrequent":
                label = "Infrequent";
                break;
            case "off":
                label = "Off";
                break;
        }

        return {
            value: val,
            label: label
        };
    });


    const {
        data: data,
        isPending: isPending,
        isFetching: isFetching,
        isError: isError,
    } = useAutoEmptyDockAutoEmptyIntervalQuery();

    const {mutate: mutate, isPending: isChanging} = useAutoEmptyDockAutoEmptyIntervalMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    const currentValue = options.find(mode => {
        return mode.value === data;
    }) ?? {value: "", label: ""};


    return (
        <SelectListMenuItem
            options={options}
            currentValue={currentValue}
            setValue={(e) => {
                mutate(e.value as AutoEmptyDockAutoEmptyInterval);
            }}
            disabled={disabled}
            loadingOptions={autoEmptyDockAutoEmptyIntervalPropertiesPending || isPending}
            loadError={autoEmptyDockAutoEmptyIntervalPropertiesError}
            primaryLabel="Dock Auto-Empty"
            secondaryLabel="Select if and/or how often the dock should auto-empty the robot."
            icon={<AutoEmptyIntervalControlIcon/>}
        />
    );
};

const CarpetSensorModeControlCapabilitySelectListMenuItem = () => {
    const SORT_ORDER = {
        "off": 5,
        "detach": 4,
        "cross" : 3,
        "avoid": 2,
        "lift": 1
    };

    const {
        data: carpetSensorModeProperties,
        isPending: carpetSensorModePropertiesPending,
        isError: carpetSensorModePropertiesError
    } = useCarpetSensorModePropertiesQuery();

    const options: Array<SelectListMenuItemOption> = (
        carpetSensorModeProperties?.supportedModes ?? []
    ).sort((a, b) => {
        const aMapped = SORT_ORDER[a] ?? 10;
        const bMapped = SORT_ORDER[b] ?? 10;

        if (aMapped < bMapped) {
            return -1;
        } else if (bMapped < aMapped) {
            return 1;
        } else {
            return 0;
        }
    }).map((val: CarpetSensorMode) => {
        let label;

        switch (val) {
            case "off":
                label = "None";
                break;
            case "avoid":
                label = "Avoid Carpet";
                break;
            case "lift":
                label = "Lift Mop";
                break;
            case "detach":
                label = "Detach Mop";
                break;
            case "cross":
                label = "Cross Carpet";
                break;
        }

        return {
            value: val,
            label: label
        };
    });

    const {
        data: data,
        isPending: isPending,
        isFetching: isFetching,
        isError: isError,
    } = useCarpetSensorModeQuery();

    const {mutate: mutate, isPending: isChanging} = useCarpetSensorModeMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    const currentValue = options.find(mode => {
        return mode.value === data;
    }) ?? {value: "", label: ""};

    return (
        <SelectListMenuItem
            options={options}
            currentValue={currentValue}
            setValue={(e) => {
                mutate(e.value as CarpetSensorMode);
            }}
            disabled={disabled}
            loadingOptions={carpetSensorModePropertiesPending || isPending}
            loadError={carpetSensorModePropertiesError}
            primaryLabel="Carpet Sensor"
            secondaryLabel="Select what action the robot should take if it detects carpet while mopping."
            icon={<CarpetSensorModeIcon/>}
        />
    );
};

const CleanRouteControlCapabilitySelectListMenuItem = () => {
    const SORT_ORDER = {
        "quick": 1,
        "normal": 2,
        "intensive": 3,
        "deep": 4
    };

    const {
        data: cleanRouteControlProperties,
        isPending: cleanRouteControlPropertiesPending,
        isError: cleanRouteControlPropertiesError
    } = useCleanRouteControlPropertiesQuery();

    const options: Array<SelectListMenuItemOption> = (
        cleanRouteControlProperties?.supportedRoutes ?? []
    ).sort((a, b) => {
        const aMapped = SORT_ORDER[a] ?? 10;
        const bMapped = SORT_ORDER[b] ?? 10;

        if (aMapped < bMapped) {
            return -1;
        } else if (bMapped < aMapped) {
            return 1;
        } else {
            return 0;
        }
    }).map((val: CleanRoute) => {
        let label;

        switch (val) {
            case "quick":
                label = "Quick";
                break;
            case "normal":
                label = "Normal";
                break;
            case "intensive":
                label = "Intensive";
                break;
            case "deep":
                label = "Deep";
                break;
        }
        return {
            value: val,
            label: label
        };
    });

    const description = React.useMemo(() => {
        let desc = "Trade speed for thoroughness and vice-versa.";

        if (cleanRouteControlProperties) {
            if (cleanRouteControlProperties.mopOnly.length > 0) {
                const labels = cleanRouteControlProperties.mopOnly.map(route => {
                    const label = options.find(o => o.value === route)?.label ?? "unknown";
                    return `"${label}"`;
                });
                desc += ` ${labels.join(", ")} only ${labels.length > 1 ? "apply" : "applies"} when mopping.`;
            }
            if (cleanRouteControlProperties.oneTime.length > 0) {
                const labels = cleanRouteControlProperties.oneTime.map(route => {
                    const label = options.find(o => o.value === route)?.label ?? "unknown";
                    return `"${label}"`;
                });
                desc += ` ${labels.join(", ")} ${labels.length > 1 ? "are" : "is"} one-time only.`;
            }
        }
        return desc;
    }, [cleanRouteControlProperties, options]);

    const {
        data: data,
        isPending: isPending,
        isFetching: isFetching,
        isError: isError,
    } = useCleanRouteQuery();

    const {mutate: mutate, isPending: isChanging} = useCleanRouteMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    const currentValue = options.find(mode => {
        return mode.value === data;
    }) ?? {value: "", label: ""};

    return (
        <SelectListMenuItem
            options={options}
            currentValue={currentValue}
            setValue={(e) => {mutate(e.value as CleanRoute);}}
            disabled={disabled}
            loadingOptions={cleanRouteControlPropertiesPending || isPending}
            loadError={cleanRouteControlPropertiesError}
            primaryLabel="Clean Route"
            secondaryLabel={description}
            icon={<CleanRouteControlIcon/>}
        />
    );
};

const MopDockMopDryingTimeControlCapabilitySelectListMenuItem = () => {
    const SORT_ORDER = {
        "2h": 1,
        "1h": 2,
        "3h": 3,
        "4h": 4,
        "cold": 5
    };

    const {
        data: mopDryingTimeProperties,
        isPending: mopDryingTimePropertiesPending,
        isError: mopDryingTimePropertiesError
    } = useMopDockMopDryingTimeControlPropertiesQuery();

    const options: Array<SelectListMenuItemOption> = (
        mopDryingTimeProperties?.supportedDurations ?? []
    ).sort((a, b) => {
        const aMapped = SORT_ORDER[a] ?? 10;
        const bMapped = SORT_ORDER[b] ?? 10;

        if (aMapped < bMapped) {
            return -1;
        } else if (bMapped < aMapped) {
            return 1;
        } else {
            return 0;
        }
    }).map((val: MopDockMopDryingDuration) => {
        let label;

        switch (val) {
            case "1h":
                label = "1 Hour";
                break;
            case "2h":
                label = "2 Hours";
                break;
            case "3h":
                label = "3 Hours";
                break;
            case "4h":
                label = "4 Hours";
                break;
            case "cold":
                label = "Cold";
                break;
        }

        return {
            value: val,
            label: label
        };
    });

    const description = React.useMemo(() => {
        let desc = "Select how long the mop pads should be dried with hot air after a finished cleanup.";

        if (mopDryingTimeProperties?.supportedDurations?.includes("cold")) {
            desc += " \"Cold\" disables the heater but compensates with far longer ventilation time.";
        }

        return desc;
    }, [mopDryingTimeProperties]);


    const {
        data: data,
        isPending: isPending,
        isFetching: isFetching,
        isError: isError,
    } = useMopDockMopDryingTimeQuery();

    const {mutate: mutate, isPending: isChanging} = useMopDockMopDryingTimeMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    const currentValue = options.find(mode => {
        return mode.value === data;
    }) ?? {value: "", label: ""};

    return (
        <SelectListMenuItem
            options={options}
            currentValue={currentValue}
            setValue={(e) => {
                mutate(e.value as MopDockMopDryingDuration);
            }}
            disabled={disabled}
            loadingOptions={mopDryingTimePropertiesPending || isPending}
            loadError={mopDryingTimePropertiesError}
            primaryLabel="Mop Pads Drying Time"
            secondaryLabel={description}
            icon={<MopDockMopDryingTimeControlIcon/>}
        />
    );
};

const MopDockMopWashTemperatureControlCapabilitySelectListMenuItem = () => {
    const SORT_ORDER: Record<MopDockMopWashTemperature, number> = {
        "cold": 1,
        "warm": 2,
        "hot": 3,
        "scalding": 4,
        "boiling": 5,
    };

    const {
        data: mopDockMopWashTemperatureProperties,
        isPending: mopDockMopWashTemperaturePropertiesPending,
        isError: mopDockMopWashTemperaturePropertiesError
    } = useMopDockMopWashTemperaturePropertiesQuery();

    const options: Array<SelectListMenuItemOption> = (
        mopDockMopWashTemperatureProperties?.supportedTemperatures ?? []
    ).sort((a, b) => {
        const aMapped = SORT_ORDER[a] ?? 10;
        const bMapped = SORT_ORDER[b] ?? 10;

        return aMapped - bMapped;
    }).map((val: MopDockMopWashTemperature) => {
        let label;

        switch (val) {
            case "cold":
                label = "Cold";
                break;
            case "warm":
                label = "Warm";
                break;
            case "hot":
                label = "Hot";
                break;
            case "scalding":
                label = "Scalding";
                break;
            case "boiling":
                label = "Boiling";
                break;
        }

        return {
            value: val,
            label: label
        };
    });

    const {
        data: data,
        isPending: isPending,
        isFetching: isFetching,
        isError: isError,
    } = useMopDockMopWashTemperatureQuery();

    const {mutate: mutate, isPending: isChanging} = useMopDockMopWashTemperatureMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    const currentValue = options.find(mode => {
        return mode.value === data;
    }) ?? {value: "", label: ""};

    return (
        <SelectListMenuItem
            options={options}
            currentValue={currentValue}
            setValue={(e) => {
                mutate(e.value as MopDockMopWashTemperature);
            }}
            disabled={disabled}
            loadingOptions={mopDockMopWashTemperaturePropertiesPending || isPending}
            loadError={mopDockMopWashTemperaturePropertiesError}
            primaryLabel="Mop Pads Wash Temperature"
            secondaryLabel="Select if and/or how much the dock should heat the water used to rinse the mop pads."
            icon={<MopDockMopWashTemperatureControlIcon/>}
        />
    );
};

const MopTwistFrequencyControlCapabilitySelectListMenuItem = () => {
    const SORT_ORDER = {
        "every_7_days" : 7,
        "each_cleanup": 1,
        "off": -1
    };

    const {
        data: mopTwistFrequencyProperties,
        isPending: mopTwistFrequencyPropertiesPending,
        isError: mopTwistFrequencyPropertiesError
    } = useMopTwistFrequencyPropertiesQuery();

    const options: Array<SelectListMenuItemOption> = (
        mopTwistFrequencyProperties?.supportedMopTwists ?? []
    ).sort((a, b) => {
        const aMapped = SORT_ORDER[a] ?? 10;
        const bMapped = SORT_ORDER[b] ?? 10;

        if (aMapped < bMapped) {
            return -1;
        } else if (bMapped < aMapped) {
            return 1;
        } else {
            return 0;
        }
    }).map((val: MopTwistFrequency) => {
        let label;

        switch (val) {
            case "off":
                label = "Off";
                break;
            case "each_cleanup":
                label = "Each Cleanup";
                break;
            case "every_7_days":
                label = "Every 7 Days";
                break;
        }

        return {
            value: val,
            label: label
        };
    });

    const {
        data: data,
        isPending: isPending,
        isFetching: isFetching,
        isError: isError,
    } = useMopTwistFrequencyQuery();

    const {mutate: mutate, isPending: isChanging} = useMopTwistFrequencyMutation();
    const loading = isFetching || isChanging;
    const disabled = loading || isChanging || isError;

    const currentValue = options.find(mode => {
        return mode.value === data;
    }) ?? {value: "", label: ""};

    return (
        <SelectListMenuItem
            options={options}
            currentValue={currentValue}
            setValue={(e) => {mutate(e.value as MopTwistFrequency);}}
            disabled={disabled}
            loadingOptions={mopTwistFrequencyPropertiesPending || isPending}
            loadError={mopTwistFrequencyPropertiesError}
            primaryLabel="Twist robot when mopping"
            secondaryLabel="Select if and how frequently the robot should twist to mop closer to walls and furniture. This will increase the cleanup duration."
            icon={<MopTwistFrequencyControlIcon/>}
        />
    );
};

const RobotOptions = (): React.ReactElement => {
    const [
        autoEmptyDockAutoEmptyDurationControlCapabilitySupported,
        autoEmptyDockAutoEmptyIntervalControlCapabilitySupported,
        cameraLightControlSupported,
        carpetModeControlCapabilitySupported,
        carpetSensorModeControlCapabilitySupported,
        cleanCarpetsFirstControlSupported,
        cleanRouteControlSupported,
        collisionAvoidantNavigationControlCapabilitySupported,
        floorMaterialDirectionAwareNavigationControlSupported,
        doNotDisturbCapabilitySupported,
        keyLockControlCapabilitySupported,
        locateCapabilitySupported,
        mopDockMopAutoDryingControlSupported,
        mopDockMopDryingTimeControlSupported,
        mopDockMopWashTemperatureControlSupported,
        mopExtensionControlCapabilitySupported,
        mopExtensionFurnitureLegHandlingControlSupported,
        mopGapControlCapabilitySupported,
        mopTightPatternControlSupported,
        mopTwistFrequencyControlSupported,
        obstacleAvoidanceControlCapabilitySupported,
        obstacleImagesSupported,
        petObstacleAvoidanceControlCapabilitySupported,
        quirksCapabilitySupported,
        speakerTestCapabilitySupported,
        speakerVolumeControlCapabilitySupported,
        voicePackManagementCapabilitySupported,
    ] = useCapabilitiesSupported(
        Capability.AutoEmptyDockAutoEmptyDurationControl,
        Capability.AutoEmptyDockAutoEmptyIntervalControl,
        Capability.CameraLightControl,
        Capability.CarpetModeControl,
        Capability.CarpetSensorModeControl,
        Capability.CleanCarpetsFirstControl,
        Capability.CleanRouteControl,
        Capability.CollisionAvoidantNavigation,
        Capability.DoNotDisturb,
        Capability.FloorMaterialDirectionAwareNavigationControl,
        Capability.KeyLock,
        Capability.Locate,
        Capability.MopDockMopAutoDryingControl,
        Capability.MopDockMopDryingTimeControl,
        Capability.MopDockMopWashTemperatureControl,
        Capability.MopExtensionControl,
        Capability.MopExtensionFurnitureLegHandlingControl,
        Capability.MopGapControl,
        Capability.MopTightPatternControl,
        Capability.MopTwistFrequencyControl,
        Capability.ObstacleAvoidanceControl,
        Capability.ObstacleImages,
        Capability.PetObstacleAvoidanceControl,
        Capability.Quirks,
        Capability.SpeakerTest,
        Capability.SpeakerVolumeControl,
        Capability.VoicePackManagement,
    );

    const generalListItems = React.useMemo(() => {
        const items = [];

        if (locateCapabilitySupported) {
            items.push(<LocateButtonListMenuItem key={"locateAction"}/>);
        }

        if (keyLockControlCapabilitySupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"keyLock"} {...SIMPLE_TOGGLE_UI_CONFIGS.keyLock}/>);
        }

        return items;
    }, [
        locateCapabilitySupported,
        keyLockControlCapabilitySupported
    ]);

    const behaviorListItems = React.useMemo(() => {
        const items = [];
        // The order of the IFs generate the shown order of Capabilities in UI
        if (collisionAvoidantNavigationControlCapabilitySupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"collisionAvoidantNavigation"} {...SIMPLE_TOGGLE_UI_CONFIGS.collisionAvoidantNavigation}/>);
        }

        if (floorMaterialDirectionAwareNavigationControlSupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"floorMaterialDirectionAwareNavigation"} {...SIMPLE_TOGGLE_UI_CONFIGS.floorMaterialDirectionAwareNavigation}/>);
        }

        if (cleanRouteControlSupported) {
            items.push(<CleanRouteControlCapabilitySelectListMenuItem key={"cleanRouteControl"}/>);
        }

        if ([collisionAvoidantNavigationControlCapabilitySupported, floorMaterialDirectionAwareNavigationControlSupported,
            cleanRouteControlSupported].filter(Boolean).length > 1) {
            items.push(<SpacerListMenuItem key={"spacer-navigation"} halfHeight={true}/>);
        }

        if (carpetModeControlCapabilitySupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"carpetMode"} {...SIMPLE_TOGGLE_UI_CONFIGS.carpetMode}/>);
        }

        if (carpetSensorModeControlCapabilitySupported) {
            items.push(<CarpetSensorModeControlCapabilitySelectListMenuItem key={"carpetSensorModeControl"}/>);
        }

        if (cleanCarpetsFirstControlSupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"cleanCarpetsFirst"} {...SIMPLE_TOGGLE_UI_CONFIGS.cleanCarpetsFirst}/>);
        }

        if ([carpetModeControlCapabilitySupported, carpetSensorModeControlCapabilitySupported, cleanCarpetsFirstControlSupported].filter(Boolean).length > 1) {
            items.push(<SpacerListMenuItem key={"spacer-carpet"} halfHeight={true}/>);
        }

        if (mopExtensionControlCapabilitySupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"mopExtension"} {...SIMPLE_TOGGLE_UI_CONFIGS.mopExtension}/>);
        }

        if (mopExtensionFurnitureLegHandlingControlSupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"mopExtensionFurnitureLegHandling"} {...SIMPLE_TOGGLE_UI_CONFIGS.mopExtensionFurnitureLegHandling}/>);
        }

        if (mopGapControlCapabilitySupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"mopGap"} {...SIMPLE_TOGGLE_UI_CONFIGS.mopGap}/>);
        }

        if (mopTightPatternControlSupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"mopTightPattern"} {...SIMPLE_TOGGLE_UI_CONFIGS.mopTightPattern}/>);
        }

        if (mopTwistFrequencyControlSupported) {
            items.push(<MopTwistFrequencyControlCapabilitySelectListMenuItem key={"mopTwistFrequencyControl"}/>);
        }

        if (items.at(-1)?.type === SpacerListMenuItem) {
            items.pop();
        }

        return items;
    }, [
        carpetModeControlCapabilitySupported,
        carpetSensorModeControlCapabilitySupported,
        cleanCarpetsFirstControlSupported,
        cleanRouteControlSupported,
        collisionAvoidantNavigationControlCapabilitySupported,
        floorMaterialDirectionAwareNavigationControlSupported,
        mopExtensionControlCapabilitySupported,
        mopExtensionFurnitureLegHandlingControlSupported,
        mopGapControlCapabilitySupported,
        mopTightPatternControlSupported,
        mopTwistFrequencyControlSupported,
    ]);

    const navigationListItems = React.useMemo(() => {
        const items = [];
        // The order of the IFs generate the shown order of Capabilities in UI
        if (obstacleAvoidanceControlCapabilitySupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"obstacleAvoidance"} {...SIMPLE_TOGGLE_UI_CONFIGS.obstacleAvoidance}/>);
        }

        if (petObstacleAvoidanceControlCapabilitySupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"petObstacleAvoidance"} {...SIMPLE_TOGGLE_UI_CONFIGS.petObstacleAvoidance}/>);
        }

        if (obstacleImagesSupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"obstacleImages"} {...SIMPLE_TOGGLE_UI_CONFIGS.obstacleImages}/>);
        }

        if (cameraLightControlSupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"cameraLight"} {...SIMPLE_TOGGLE_UI_CONFIGS.cameraLight}/>);
        }

        return items;
    }, [
        cameraLightControlSupported,
        obstacleAvoidanceControlCapabilitySupported,
        obstacleImagesSupported,
        petObstacleAvoidanceControlCapabilitySupported,
    ]);

    const dockListItems = React.useMemo(() => {
        const items = [];
        // The order of the IFs generate the shown order of Capabilities in UI
        if (autoEmptyDockAutoEmptyIntervalControlCapabilitySupported) {
            items.push(
                <AutoEmptyDockAutoEmptyIntervalControlCapabilitySelectListMenuItem key={"autoEmptyDockAutoEmptyIntervalControl"}/>
            );
        }

        if (autoEmptyDockAutoEmptyDurationControlCapabilitySupported) {
            items.push(
                <AutoEmptyDockAutoEmptyDurationControlCapabilitySelectListMenuItem key={"autoEmptyDockAutoEmptyDurationControl"}/>
            );
        }

        if (autoEmptyDockAutoEmptyIntervalControlCapabilitySupported && autoEmptyDockAutoEmptyDurationControlCapabilitySupported) {
            items.push(<SpacerListMenuItem key={"spacer-auto-empty"} halfHeight={true}/>);
        }

        if (mopDockMopAutoDryingControlSupported) {
            items.push(<SimpleToggleCapabilitySwitch key={"mopDockMopAutoDrying"} {...SIMPLE_TOGGLE_UI_CONFIGS.mopDockMopAutoDrying}/>);
        }

        if (mopDockMopDryingTimeControlSupported) {
            items.push(<MopDockMopDryingTimeControlCapabilitySelectListMenuItem key={"mopDockMopDryingTimeControl"}/>);
        }

        if (mopDockMopWashTemperatureControlSupported) {
            items.push(
                <MopDockMopWashTemperatureControlCapabilitySelectListMenuItem key={"mopDockMopWashTemperatureControl"}/>
            );
        }

        return items;
    }, [
        autoEmptyDockAutoEmptyDurationControlCapabilitySupported,
        autoEmptyDockAutoEmptyIntervalControlCapabilitySupported,
        mopDockMopAutoDryingControlSupported,
        mopDockMopDryingTimeControlSupported,
        mopDockMopWashTemperatureControlSupported,
    ]);

    const miscListItems = React.useMemo(() => {
        const items = [];

        if (speakerVolumeControlCapabilitySupported || speakerTestCapabilitySupported ||
            voicePackManagementCapabilitySupported || doNotDisturbCapabilitySupported
        ) {
            const label = [];

            if (voicePackManagementCapabilitySupported) {
                label.push("Voice packs");
            }

            if (doNotDisturbCapabilitySupported) {
                label.push("Do not disturb");
            }

            if (speakerVolumeControlCapabilitySupported && speakerTestCapabilitySupported) {
                label.push("Speaker settings");
            }

            items.push(
                <LinkListMenuItem
                    key="systemRobotSettings"
                    url="/options/robot/system"
                    primaryLabel="System Options"
                    secondaryLabel={label.join(", ")}
                    icon={<SystemIcon/>}
                />
            );
        }

        if (quirksCapabilitySupported) {
            items.push(
                <LinkListMenuItem
                    key="quirks"
                    url="/options/robot/quirks"
                    primaryLabel="Quirks"
                    secondaryLabel="Configure firmware-specific quirks"
                    icon={<QuirksIcon/>}
                />
            );
        }

        return items;
    }, [
        speakerVolumeControlCapabilitySupported,
        speakerTestCapabilitySupported,
        voicePackManagementCapabilitySupported,
        doNotDisturbCapabilitySupported,

        quirksCapabilitySupported,
    ]);

    const listItems = React.useMemo(() => {
        const items: Array<React.ReactElement> = [];

        const addGroup = (groupItems: React.ReactElement[], title: string, icon: React.ReactElement) => {
            if (groupItems.length > 0) {
                items.push(
                    <SubHeaderListMenuItem
                        key={`header-${title}`}
                        primaryLabel={title}
                        icon={icon}
                    />
                );
                items.push(...groupItems);
                items.push(<SpacerListMenuItem key={`spacer-${title}`}/>);
            }
        };

        addGroup(generalListItems, "General", <GeneralIcon/>);
        addGroup(behaviorListItems, "Behavior", <BehaviourIcon/>);
        addGroup(navigationListItems, "Perception", <PerceptionIcon/>);
        addGroup(dockListItems, "Dock", <DockIcon/>);
        addGroup(miscListItems, "Misc", <MiscIcon/>);

        if (items.at(-1)?.type === SpacerListMenuItem) {
            items.pop();
        }

        return items;
    }, [
        behaviorListItems,
        dockListItems,
        generalListItems,
        miscListItems,
        navigationListItems,
    ]);

    return (
        <PaperContainer>
            <ListMenu
                primaryHeader={"Robot Options"}
                secondaryHeader={"Tunables and actions provided by the robot's firmware"}
                listItems={listItems}
            />
        </PaperContainer>
    );
};

export default RobotOptions;
