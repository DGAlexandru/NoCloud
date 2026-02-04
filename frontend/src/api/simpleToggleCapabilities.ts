import { Capability } from "./types";

export interface SimpleToggleConfig {
    capability: Capability;
    queryKey: string;
}

// Record of all Simple Toggle Capabilities.
export const SIMPLE_TOGGLE_CAPABILITIES: Record<string, SimpleToggleConfig> = {
    CameraLight: {
        capability: Capability.CameraLightControl,
        queryKey: "camera_light_control"
    },
    CarpetMode: {
        capability: Capability.CarpetModeControl,
        queryKey: "carpet_mode_control"
    },
    CleanCarpetsFirst: {
        capability: Capability.CleanCarpetsFirstControl,
        queryKey: "clean_carpets_first_control"
    },
    CollisionAvoidantNavigation: {
        capability: Capability.CollisionAvoidantNavigation,
        queryKey: "collision_avoidant_navigation"
    },
    FloorMaterialDirectionAwareNavigation: {
        capability: Capability.FloorMaterialDirectionAwareNavigationControl,
        queryKey: "floor_material_direction_aware_navigation_control"
    },
    KeyLock: {
        capability: Capability.KeyLock,
        queryKey: "key_lock"
    },
    MopDockMopAutoDrying: {
        capability: Capability.MopDockMopAutoDryingControl,
        queryKey: "mop_dock_mop_auto_drying_control"
    },
    MopExtension: {
        capability: Capability.MopExtensionControl,
        queryKey: "mop_extension_control"
    },
    MopExtensionFurnitureLegHandling: {
        capability: Capability.MopExtensionFurnitureLegHandlingControl,
        queryKey: "mop_extension_furniture_leg_handling_control"
    },
    MopGap: {
        capability: Capability.MopGapControl,
        queryKey: "mop_gap_control"
    },
    MopTightPattern: {
        capability: Capability.MopTightPatternControl,
        queryKey: "mop_tight_pattern_control"
    },
    ObstacleAvoidance: {
        capability: Capability.ObstacleAvoidanceControl,
        queryKey: "obstacle_avoidance_control"
    },
    ObstacleImages: {
        capability: Capability.ObstacleImages,
        queryKey: "obstacle_image"
    },
    PetObstacleAvoidance: {
        capability: Capability.PetObstacleAvoidanceControl,
        queryKey: "pet_obstacle_avoidance_control"
    },
};
