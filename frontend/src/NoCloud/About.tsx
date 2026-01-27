import DetailPageHeaderRow from "../components/DetailPageHeaderRow";
import gfm from "remark-gfm";
import Grid from "@mui/material/Grid2";
import Logo from "../assets/icons/NoCloud_logo_with_name.svg?react";
import PaperContainer from "../components/PaperContainer";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import style from "./About.module.css";
import {AboutText} from "./res/AboutText";
import {Box} from "@mui/material";
import {Info as AboutIcon} from "@mui/icons-material";

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
