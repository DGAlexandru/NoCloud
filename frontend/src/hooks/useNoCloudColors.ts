import {useTheme} from "@mui/material";
import {darkPalette, lightPalette} from "../colors";

export const useNoCloudColors = () => {
    const theme = useTheme();
    return theme.palette.mode === "dark" ? darkPalette : lightPalette;
};

// Better contrast for text
export const useNoCloudColorsInverse = () => {
    const theme = useTheme();
    return theme.palette.mode === "dark" ? lightPalette : darkPalette;
};
