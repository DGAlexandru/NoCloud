import React from "react";
import { Capability } from "../api/types";
import {
    Air as MopDockMopAutoDryingIcon,
    Cable as ObstacleAvoidanceIcon,
    CleaningServices as CleanCarpetsFirstIcon,
    Explore as FloorMaterialDirectionAwareNavigationIcon,
    FlashlightOn as CameraLightIcon,
    Flood as MopTightPatternIcon,
    KeyboardDoubleArrowUp as CarpetModeIcon,
    Lock as KeyLockIcon,
    Pets as PetObstacleAvoidanceIcon,
    Photo as ObstacleImagesIcon,
    RoundaboutRight as CollisionAvoidantNavigationIcon,
    TableBar as MopExtensionFurnitureLegHandlingIcon,
} from "@mui/icons-material";
import {
    MopExtensionControlCapability as MopExtensionIcon,
    MopTwistControlCapabilityExtended as MopGapIcon,
} from "../components/CustomIcons";
interface SimpleToggleUIConfig {
    capability: Capability;
    primaryLabel: string;
    secondaryLabel: string;
    icon: React.ReactElement;
}
// Record of all Simple Toggle Capabilities UI settings.
export const SIMPLE_TOGGLE_UI_CONFIGS: Record<string, SimpleToggleUIConfig> = {
    cameraLight: {
        capability: Capability.CameraLightControl,
        primaryLabel: "Camera Light",
        secondaryLabel: "Illuminate the dark to improve the AI's image recognition for obstacle avoidance.",
        icon: <CameraLightIcon/>
    },
    carpetMode: {
        capability: Capability.CarpetModeControl,
        primaryLabel: "Carpet Mode",
        secondaryLabel: "When enabled, the robot will automatically recognize carpets and increase suction.",
        icon: <CarpetModeIcon/>
    },
    cleanCarpetsFirst: {
        capability: Capability.CleanCarpetsFirstControl,
        primaryLabel: "Clean Carpets First",
        secondaryLabel: "When enabled, the robot will first clean all carpet areas, then will continue with the rest of the cleanup.",
        icon: <CleanCarpetsFirstIcon/>
    },
    collisionAvoidantNavigation: {
        capability: Capability.CollisionAvoidantNavigation,
        primaryLabel: "Collision-avoidant Navigation",
        secondaryLabel: "Uses a more conservative route for collision-avoidant navigation, but may result in missed spots.",
        icon: <CollisionAvoidantNavigationIcon/>
    },
    floorMaterialDirectionAwareNavigation: {
        capability: Capability.FloorMaterialDirectionAwareNavigationControl,
        primaryLabel: "Material-aligned Navigation",
        secondaryLabel: "Clean along the direction of the configured/detected floor material (if applicable).",
        icon: <FloorMaterialDirectionAwareNavigationIcon/>
    },
    keyLock: {
        capability: Capability.KeyLock,
        primaryLabel: "Lock Keys",
        secondaryLabel: "Prevents the robot from being operated via its physical buttons.",
        icon: <KeyLockIcon/>
    },
    mopDockMopAutoDrying: {
        capability: Capability.MopDockMopAutoDryingControl,
        primaryLabel: "Mop Pads Auto-Drying",
        secondaryLabel: "Automatically dry the mop pads after a finished cleanup.",
        icon: <MopDockMopAutoDryingIcon/>
    },
    mopExtension: {
        capability: Capability.MopExtensionControl,
        primaryLabel: "Mop Extension",
        secondaryLabel: "Extend the mop outward to reach closer to walls and furniture.",
        icon: <MopExtensionIcon/>
    },
    mopExtensionFurnitureLegHandling: {
        capability: Capability.MopExtensionFurnitureLegHandlingControl,
        primaryLabel: "Extend Mop for Furniture Legs",
        secondaryLabel: "Use the extending mop to mop closer to furniture legs.",
        icon: <MopExtensionFurnitureLegHandlingIcon/>
    },
    mopGap: {
        capability: Capability.MopGapControl,
        primaryLabel: "Extend Mop when robot twists",
        secondaryLabel: "Extend the mop when the robot twists to further reach under furniture with overhangs.",
        icon: <MopGapIcon/>
    },
    mopTightPattern: {
        capability: Capability.MopTightPatternControl,
        primaryLabel: "Tight Mop Pattern",
        secondaryLabel: "Enabling this makes your robot move in a much tighter pattern when mopping.",
        icon: <MopTightPatternIcon/>
    },
    obstacleAvoidance: {
        capability: Capability.ObstacleAvoidanceControl,
        primaryLabel: "Obstacle Avoidance",
        secondaryLabel: "Avoid obstacles using sensors such as lasers or cameras. This may result in false positives.",
        icon: <ObstacleAvoidanceIcon/>
    },
    obstacleImages: {
        capability: Capability.ObstacleImages,
        primaryLabel: "Obstacle Images",
        secondaryLabel: "Take pictures of all obstacles encountered.",
        icon: <ObstacleImagesIcon/>
    },
    petObstacleAvoidance: {
        capability: Capability.PetObstacleAvoidanceControl,
        primaryLabel: "Pet Obstacle Avoidance",
        secondaryLabel: "Fine-tune obstacle avoidance to avoid pets and/or obstacles left by pets. This may increase the general false positive rate.",
        icon: <PetObstacleAvoidanceIcon/>
    },
};
