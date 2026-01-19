export interface RawMapData {
    metaData: RawMapDataMetaData;
    size: {
        x: number;
        y: number;
    };
    pixelSize: number;
    layers: RawMapLayer[];
    entities: RawMapEntity[];
}

export interface RawMapEntity {
    metaData: RawMapEntityMetaData;
    points: number[];
    type: RawMapEntityType;
}

export interface RawMapEntityMetaData {
    angle?: number;
    label?: string;
    id?: string;
}

export interface RawMapLayer {
    metaData: RawMapLayerMetaData;
    type: RawMapLayerType;
    pixels: number[];
    compressedPixels?: number[];
    dimensions: {
        x: RawMapLayerDimension;
        y: RawMapLayerDimension;
        pixelCount: number;
    };
}

export interface RawMapLayerDimension {
    min: number;
    max: number;
    mid: number;
    avg: number;
}

export interface RawMapLayerMetaData {
    area: number;
    segmentId?: string;
    name?: string;
    active?: boolean;
    material?: RawMapLayerMaterial
}

export enum RawMapLayerType {
    Floor = "floor",
    Segment = "segment",
    Wall = "wall",
}

export enum RawMapLayerMaterial {
    Carpet = "carpet",
    Generic = "generic",
    LowPileCarpet = "low_pile_carpet",
    MediumPileCarpet = "medium_pile_carpet",
    Tile = "tile",
    Wood = "wood",
    WoodHorizontal = "wood_horizontal",
    WoodVertical = "wood_vertical"
}

export enum RawMapEntityType {
    ActiveZone = "active_zone",
    ChargerLocation = "charger_location",
    Carpet = "carpet",
    GoToTarget = "go_to_target",
    NoGoArea = "no_go_area",
    NoMopArea = "no_mop_area",
    Obstacle = "obstacle",
    Path = "path",
    PredictedPath = "predicted_path",
    RobotPosition = "robot_position",
    VirtualWall = "virtual_wall",
}

export interface RawMapDataMetaData {
    version: number;
    nonce: string;
}
