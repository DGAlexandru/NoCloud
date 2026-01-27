import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    PaletteMode,
    Switch,
    Toolbar,
    Typography
} from "@mui/material";
import React from "react";
import {
    AccessTime as TimeIcon,
    ArrowBack as BackIcon,
    Article as LogIcon,
    DarkMode as DarkModeIcon,
    Equalizer as StatisticsIcon,
    Help as HelpIcon,
    Home as HomeIcon,
    Hub as ConnectivityIcon,
    Info as AboutIcon,
    Map as MapManagementIcon,
    Menu as MenuIcon,
    PendingActions as PendingActionsIcon,
    SettingsRemote as SettingsRemoteIcon,
    SvgIconComponent,
    SystemUpdateAlt as UpdaterIcon,
    Wysiwyg as SystemInformationIcon,
} from "@mui/icons-material";
import {Link, useLocation} from "react-router-dom";
import NoCloudEvents from "./NoCloudEvents";
import {Capability} from "../api";
import {useCapabilitiesSupported} from "../CapabilitiesProvider";
import {
    NoCloudMonochromeIcon,
    RobotMonochromeIcon,
    SwaggerUIIcon,
} from "./CustomIcons";

interface MenuEntry {
    kind: "MenuEntry";
    route: string;
    title: string;
    menuIcon: SvgIconComponent;
    menuText: string;
    requiredCapabilities?: {
        capabilities: Capability[];
        type: "allof" | "anyof"
    };
}

interface MenuSubEntry {
    kind: "MenuSubEntry",
    route: string,
    title: string,
    parentRoute: string
}

interface MenuSubheader {
    kind: "Subheader";
    title: string;
    requiredCapabilities?: {
        capabilities: Capability[];
        type: "allof" | "anyof"
    };
}
//Note that order is important here
const menuTree: Array<MenuEntry | MenuSubEntry | MenuSubheader> = [
    {
        kind: "MenuEntry",
        route: "/",
        title: "Home",
        menuIcon: HomeIcon,
        menuText: "Home"
    },
    {
        kind: "Subheader",
        title: "Robot",
        requiredCapabilities: {
            capabilities: [
                Capability.ConsumableMonitoring,
                Capability.ManualControl,
                Capability.HighResolutionManualControl,
                Capability.TotalStatistics
            ],
            type: "anyof"
        }
    },
    {
        kind: "MenuEntry",
        route: "/robot/consumables",
        title: "Consumables",
        menuIcon: PendingActionsIcon,
        menuText: "Consumables",
        requiredCapabilities: {
            capabilities: [Capability.ConsumableMonitoring],
            type: "allof"
        }
    },
    {
        kind: "MenuEntry",
        route: "/robot/manual_control",
        title: "Manual control",
        menuIcon: SettingsRemoteIcon,
        menuText: "Manual control",
        requiredCapabilities: {
            capabilities: [Capability.ManualControl, Capability.HighResolutionManualControl],
            type: "anyof"
        }
    },
    {
        kind: "MenuEntry",
        route: "/robot/total_statistics",
        title: "Statistics",
        menuIcon: StatisticsIcon,
        menuText: "Statistics",
        requiredCapabilities: {
            capabilities: [Capability.TotalStatistics],
            type: "allof"
        }
    },
    {
        kind: "Subheader",
        title: "Options"
    },
    {
        kind: "MenuEntry",
        route: "/options/map_management",
        title: "Map Options",
        menuIcon: MapManagementIcon,
        menuText: "Map",
        requiredCapabilities: {
            capabilities: [
                Capability.PersistentMapControl,
                Capability.MappingPass,
                Capability.MapReset,
                Capability.MapSegmentEdit,
                Capability.MapSegmentRename,
                Capability.CombinedVirtualRestrictions
            ],
            type: "anyof"
        }
    },
    {
        kind: "MenuSubEntry",
        route: "/options/map_management/segments",
        title: "Segment Management",
        parentRoute: "/options/map_management"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/map_management/virtual_restrictions",
        title: "Virtual Restriction Management",
        parentRoute: "/options/map_management"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/map_management/robot_coverage",
        title: "Robot Coverage Map",
        parentRoute: "/options/map_management"
    },
    {
        kind: "MenuEntry",
        route: "/options/connectivity",
        title: "Connectivity Options",
        menuIcon: ConnectivityIcon,
        menuText: "Connectivity"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/connectivity/auth",
        title: "Auth Settings",
        parentRoute: "/options/connectivity"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/connectivity/mqtt",
        title: "MQTT Connectivity",
        parentRoute: "/options/connectivity"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/connectivity/pushnotif",
        title: "Push Notifications Connectivity",
        parentRoute: "/options/connectivity"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/connectivity/networkadvertisement",
        title: "Network Advertisement",
        parentRoute: "/options/connectivity"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/connectivity/ntp",
        title: "NTP Connectivity",
        parentRoute: "/options/connectivity"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/connectivity/wifi",
        title: "Wi-Fi Connectivity",
        parentRoute: "/options/connectivity"
    },
    {
        kind: "MenuEntry",
        route: "/options/robot",
        title: "Robot Options",
        menuIcon: RobotMonochromeIcon,
        menuText: "Robot"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/robot/system",
        title: "System Options",
        parentRoute: "/options/robot"
    },
    {
        kind: "MenuSubEntry",
        route: "/options/robot/quirks",
        title: "Quirks",
        parentRoute: "/options/robot"
    },
    {
        kind: "MenuEntry",
        route: "/options/NoCloud",
        title: "NoCloud Options",
        menuIcon: NoCloudMonochromeIcon,
        menuText: "NoCloud"
    },
    {
        kind: "Subheader",
        title: "Misc"
    },
    {
        kind: "MenuEntry",
        route: "/NoCloud/timers",
        title: "Timers",
        menuIcon: TimeIcon,
        menuText: "Timers"
    },
    {
        kind: "MenuEntry",
        route: "/NoCloud/log",
        title: "Log",
        menuIcon: LogIcon,
        menuText: "Log"
    },
    {
        kind: "MenuEntry",
        route: "/NoCloud/updater",
        title: "Update NoCloud",
        menuIcon: UpdaterIcon,
        menuText: "Update NoCloud"
    },
    {
        kind: "MenuEntry",
        route: "/NoCloud/system_information",
        title: "System Information",
        menuIcon: SystemInformationIcon,
        menuText: "System Information"
    },
    {
        kind: "MenuEntry",
        route: "/NoCloud/help",
        title: "General Help",
        menuIcon: HelpIcon,
        menuText: "General Help"
    },
    {
        kind: "MenuEntry",
        route: "/NoCloud/about",
        title: "About NoCloud",
        menuIcon: AboutIcon,
        menuText: "About NoCloud"
    },
];

function hasRoute(
    item: MenuEntry | MenuSubEntry | MenuSubheader
): item is MenuEntry | MenuSubEntry {
    return "route" in item;
}

function hasRequiredCapabilities(
    required: {
        capabilities: Capability[];
        type: "allof" | "anyof";
    } | undefined,
    supported: boolean[],
    capabilityList: Capability[]
): boolean {
    if (!required) {
        return true;
    }

    const indices = required.capabilities.map(
        cap => capabilityList.indexOf(cap)
    );

    return required.type === "allof" ?
        indices.every(i => supported[i]) :
        indices.some(i => supported[i]);
}

const NoCloudAppBar: React.FunctionComponent<{ paletteMode: PaletteMode, setPaletteMode: (newMode: PaletteMode) => void }> = ({
    paletteMode,
    setPaletteMode
}): React.ReactElement => {
    const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
    const currentLocation = useLocation()?.pathname;
    const robotCapabilities = useCapabilitiesSupported(...Object.values(Capability));
    const capabilityList = React.useMemo(() => Object.values(Capability), []);

    const currentMenuEntry = menuTree.find(item => hasRoute(item) && item.route === currentLocation) ?? menuTree[0];

    const pageTitle = React.useMemo(() => {
        const titles = menuTree
            .filter((item): item is MenuEntry | MenuSubEntry =>
                hasRoute(item) &&
                item.route !== "/" &&
                currentLocation.startsWith(item.route)
            )
            .map(item => item.title);

        document.title = titles.length ?
            `NoCloud - ${titles.join(" - ")}` :
            "NoCloud";

        return currentMenuEntry.title;
    }, [currentLocation, currentMenuEntry]);

    const visibleMenuItems = React.useMemo(() => {
        return menuTree.filter(item =>
            item.kind !== "MenuSubEntry" &&
            hasRequiredCapabilities(item.requiredCapabilities, robotCapabilities, capabilityList)
        );
    }, [robotCapabilities, capabilityList]);

    const drawerContent = React.useMemo(() => {
        return (
            <Box
                sx={{width: 250}}
                role="presentation"
                onClick={() => {setDrawerOpen(false);}}
                onKeyDown={() => {setDrawerOpen(false);}}
                style={{
                    scrollbarWidth: "thin",
                    overflowX: "hidden"
                }}
            >
                <List>
                    <ListItem onClick={(e) => e.stopPropagation()} sx={{userSelect: "none"}}>
                        <ListItemIcon>
                            <DarkModeIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Dark mode"/>
                        <Switch
                            edge="end"
                            onChange={(e) => {
                                setPaletteMode(e.target.checked ? "dark" : "light");
                                setTimeout(() => {setDrawerOpen(false);}, 400); // 0.4 seconds
                            }}
                            checked={paletteMode === "dark"}
                        />
                    </ListItem>
                    <Divider/>
                    {visibleMenuItems.map((value, idx) => {
                        switch (value.kind) {
                            case "Subheader":
                                return (
                                    <ListSubheader
                                        key={`${idx}`}
                                        sx={{background: "transparent", userSelect: "none"}}
                                        disableSticky={true}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {value.title}
                                    </ListSubheader>
                                );

                            case "MenuEntry": {
                                const ItemIcon = value.menuIcon;

                                return (
                                    <ListItemButton
                                        key={value.route}
                                        selected={value.route === currentLocation}
                                        component={Link}
                                        to={value.route}
                                    >
                                        <ListItemIcon>
                                            <ItemIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={value.menuText}/>
                                    </ListItemButton>
                                );
                            }
                        }
                    })}
                    <Divider/>
                    <ListSubheader
                        sx={{background: "transparent", userSelect: "none"}}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Links
                    </ListSubheader>
                    <ListItemButton
                        component="a"
                        href="./swagger/"
                        target="_blank"
                        rel="noopener"
                    >
                        <ListItemIcon>
                            <SwaggerUIIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Swagger UI"/>
                    </ListItemButton>
                    <Divider/>
                </List>
            </Box>
        );
    }, [currentLocation, paletteMode, setPaletteMode, visibleMenuItems]);

    const toolbarContent = React.useMemo(() => {
        switch (currentMenuEntry.kind) {
            case "MenuEntry":
                return (
                    <>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                            onClick={() => {setDrawerOpen(true);}}
                            title="Menu"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            {pageTitle}
                        </Typography>
                    </>
                );
            case "MenuSubEntry":
                return (
                    <>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="back"
                            sx={{mr: 2}}
                            component={Link}
                            to={currentMenuEntry.parentRoute}
                        >
                            <BackIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            {pageTitle}
                        </Typography>
                    </>
                );
            case "Subheader":
                //This can never happen
                return (<></>);
        }
    }, [currentMenuEntry, setDrawerOpen, pageTitle]);

    return (
        <Box sx={{userSelect: "none"}}>
            <AppBar position="fixed">
                <Toolbar>
                    {toolbarContent}
                    <div>
                        <NoCloudEvents/>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            {
                currentMenuEntry.kind !== "MenuSubEntry" &&
                <Drawer
                    anchor={"left"}
                    open={drawerOpen}
                    onClose={() => {setDrawerOpen(false);}}
                >
                    {drawerContent}
                </Drawer>
            }
        </Box>
    );
};

export default NoCloudAppBar;
