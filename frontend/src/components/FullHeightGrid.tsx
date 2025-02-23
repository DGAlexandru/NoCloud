import {styled} from "@mui/material";
import Grid from "@mui/material/Grid2";

export const FullHeightGrid = styled(Grid)(({ theme }) => {
    return {
        height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
        width: "100%",
        flexWrap: "nowrap",
        overflow: "hidden" //TODO: Fixme :(
    };
});
