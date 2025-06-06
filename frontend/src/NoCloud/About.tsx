import PaperContainer from "../components/PaperContainer";
import {Box} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {Info as AboutIcon} from "@mui/icons-material";
import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import style from "./About.module.css";
import {AboutText} from "./res/AboutText";
import {ReactComponent as Logo} from "../assets/icons/NoCloud_logo_with_name.svg";
import DetailPageHeaderRow from "../components/DetailPageHeaderRow";

const About = (): React.ReactElement => {
    return (
        <PaperContainer>
            <Grid container direction="row">
                <Box style={{width: "100%"}}>
                    <DetailPageHeaderRow
                        title="About NoCloud"
                        icon={<AboutIcon/>}
                    />

                    <Grid
                        style={{
                            padding: "1rem",
                            width: "80%",
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "1rem",
                            textAlign: "center"
                        }}
                    >
                        <Logo
                            style={{
                                width: "100%"
                            }}
                        />
                    </Grid>

                    <ReactMarkdown
                        remarkPlugins={[gfm]}
                        rehypePlugins={[rehypeRaw]}
                        className={style.reactMarkDown}
                    >
                        {AboutText}
                    </ReactMarkdown>
                </Box>
            </Grid>
        </PaperContainer>
    );
};

export default About;
