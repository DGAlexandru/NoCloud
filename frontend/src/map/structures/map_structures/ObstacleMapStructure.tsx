import MapStructure from "./MapStructure";
import bathroomScaleIconSVG from "../icons/obstacles/bathroom-scale.svg";
import cableIconSVG from "../icons/obstacles/cable.svg";
import defaultIconSVG from "../icons/obstacles/default.svg";
import fabricIconSVG from "../icons/obstacles/fabric.svg";
import furnitureIconSVG from "../icons/obstacles/furniture.svg";
import obstacleIconSVG from "../icons/obstacles/obstacle.svg";
import powerStripIconSVG from "../icons/obstacles/power-strip.svg";
import shoesIconSVG from "../icons/obstacles/shoes.svg";
import {Canvas2DContextTrackingWrapper} from "../../utils/Canvas2DContextTrackingWrapper";
import {calculateBoxAroundPoint, considerHiDPI, isInsideBox} from "../../utils/helpers";
import {PointCoordinates} from "../../utils/types";
import {StructureInterceptionHandlerResult} from "../Structure";
import ObstacleImage from "../../../components/ObstacleImage";
import {Typography} from "@mui/material";

function newImg(src: string) : HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
}

type ObstacleIcons = {
    [key: string]: HTMLImageElement
}

const defaultImg = newImg(defaultIconSVG);
const obstacleIcons: ObstacleIcons = {
    "bathroom scale": newImg(bathroomScaleIconSVG),
    cable: newImg(cableIconSVG),
    fabric: newImg(fabricIconSVG),
    furniture: newImg(furnitureIconSVG),
    obstacle: newImg(obstacleIconSVG),
    "power strip": newImg(powerStripIconSVG),
    shoes: newImg(shoesIconSVG),
};

class ObstacleMapStructure extends MapStructure {
    public static readonly TYPE = "ObstacleMapStructure";
    private label: string | undefined;
    private id: string | undefined;
    private img: HTMLImageElement;

    constructor(x0: number, y0: number, label?: string, id?: string) {
        super(x0, y0);

        this.label = label;
        this.id = id;

        const name = (this.label ?? "").split(" (")[0];
        this.img = obstacleIcons[name.toLowerCase().trim()] ?? defaultImg;
    }

    private getIconSize(scaleFactor: number): { width: number; height: number } {
        // If the browser hasn't calculated SVG dimensions yet, fallback to a custom size (e.g., 24px)
        return {
            width: considerHiDPI(this.img.width || 24) / (considerHiDPI(8) / scaleFactor),
            height: considerHiDPI(this.img.height || 24) / (considerHiDPI(8) / scaleFactor)
        };
    }

    draw(ctxWrapper: Canvas2DContextTrackingWrapper, transformationMatrixToScreenSpace: DOMMatrixInit, scaleFactor: number): void {
        const ctx = ctxWrapper.getContext();
        const p0 = new DOMPoint(this.x0, this.y0).matrixTransform(transformationMatrixToScreenSpace);

        const { width, height } = this.getIconSize(scaleFactor);

        const halfIconW = width / 2;
        const halfIconH = height / 2;

        ctx.drawImage(
            this.getOptimizedImage(this.img, width, height),
            p0.x - halfIconW,
            p0.y - halfIconH,
            width,
            height
        );

        if (this.label && scaleFactor >= considerHiDPI(28)) {
            ctxWrapper.save();

            const fontSize = 0.8 * scaleFactor;
            const textPadding = 0.25 * scaleFactor;

            const textY = p0.y + halfIconH + textPadding;

            this.drawPill(
                ctx,
                p0.x,
                textY,
                [{ text: this.label, fontSize: fontSize }],
                { baseline: "top" }
            );

            ctxWrapper.restore();
        }
    }

    tap(tappedPoint : PointCoordinates, transformationMatrixToScreenSpace: DOMMatrixInit, scaleFactor: number) : StructureInterceptionHandlerResult {
        const p0 = new DOMPoint(this.x0, this.y0).matrixTransform(transformationMatrixToScreenSpace);

        const { width } = this.getIconSize(scaleFactor);
        const iconHitbox = calculateBoxAroundPoint(p0, width / 2);

        if (isInsideBox(tappedPoint, iconHitbox) && scaleFactor >= considerHiDPI(6)) {
            return {
                stopPropagation: true,
                openDialog: {
                    title: "Obstacle Information",
                    body: (
                        <>
                            {
                                this.id &&
                                <ObstacleImage id={this.id} />
                            }
                            <Typography sx={{marginTop: this.id ? "0.5rem" : undefined}}>
                                {this.label}
                            </Typography>
                        </>
                    )
                }
            };
        }

        return {
            stopPropagation: false
        };
    }
}

export default ObstacleMapStructure;
