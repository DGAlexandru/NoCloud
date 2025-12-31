import React, { FunctionComponent, useMemo, memo } from "react";
import styles from "./RatioBar.module.css";
import { darken, lighten, useTheme } from "@mui/material";

type RatioBarPartition = {
    label: string;
    valueLabel?: string;
    value: number;
    color: NonNullable<React.CSSProperties["color"]>;
};

type RatioBarProps = {
    style?: React.CSSProperties;
    total: number;
    totalLabel?: string;
    partitions: Array<RatioBarPartition>;
    hideLegend?: boolean;
    noneLegendLabel?: string;
};

type LegendItem = {
    label: string;
    color: React.CSSProperties["color"];
};

// Mostly adapted from the Material-UI LinearProgress bar https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/LinearProgress/LinearProgress.js
const RatioBar: FunctionComponent<RatioBarProps> = (props) => {
    const theme = useTheme();
    const { total, partitions } = props;
    const safeTotal = total > 0 ? total : 1;

    const mappedPartitions = useMemo(() => {
        let runningTotal = 0;

        return partitions.map((p) => {
            const percent = (p.value / safeTotal) * 100;
            runningTotal += percent;

            return {
                label: p.label,
                valueLabel: p.valueLabel,
                color: p.color,
                percent: percent,
                totalPercent: runningTotal,
            };
        });
    }, [partitions, safeTotal]);

    const reversedPartitions = useMemo(
        () => [...mappedPartitions].reverse(),
        [mappedPartitions]
    );

    // See https://github.com/mui-org/material-ui/blob/v5.0.1/packages/mui-material/src/LinearProgress/LinearProgress.js#L93
    const progressBackgroundColor = useMemo(() => {
        return theme.palette.mode === "light" ?
            lighten(theme.palette.primary.main, 0.62) :
            darken(theme.palette.primary.main, 0.5);
    }, [theme.palette.mode, theme.palette.primary.main]);

    const legendItems: LegendItem[] = useMemo(() => {
        const base: LegendItem[] = reversedPartitions.map((p) => ({
            label: p.label,
            color: p.color,
        }));

        if (props.noneLegendLabel) {
            base.push({
                label: props.noneLegendLabel,
                color: progressBackgroundColor,
            });
        }

        return base;
    }, [reversedPartitions, props.noneLegendLabel, progressBackgroundColor]);


    return (
        <>
            <span
                className={styles.ratioBarBase}
                style={{
                    backgroundColor: progressBackgroundColor,
                    ...props.style
                }}
                title={props.totalLabel}
            >
                {reversedPartitions.map((mp, i) => (
                    <span
                        key={`bar.${i}`}
                        className={styles.ratioBarContent}
                        style={{
                            transform: `translateX(${-100 + mp.totalPercent}%)`,
                            backgroundColor: mp.color,
                        }}
                        title={mp.valueLabel}
                    />
                ))}
            </span>

            {props.hideLegend !== true && (
                <span>
                    {legendItems.map((mp, i) => (
                        <span
                            key={`legend.${i}`}
                            style={{
                                paddingRight: "5px",
                                fontSize: "0.75rem",
                                color: theme.palette.text.secondary,
                            }}
                        >
                            <span style={{ color: mp.color }}>●</span> {mp.label}
                        </span>
                    ))}
                </span>
            )}
        </>
    );
};

export default memo(RatioBar);
