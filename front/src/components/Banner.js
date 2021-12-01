import { Box, Container } from "@material-ui/core";
import React from "react";
import "../App.css";
import "../scripts/animation.css"
import banner from "../assets/better_banner_2.png";

function Banner() {
    return (
        
        <Container fixed
            style={{
                padding: 0,
            }}
        >
            <img src={banner} width='100%' height='auto' id='picture'/>
            {/* <div id='placeholder'
                className = 'hidden'
                style={{
                    height: 50,
                    backgroundColor: 'white'
                }}
            /> */}
        </Container>
        
        /* <Box
            style={{
                position: "relative",
                top: 0,
                width: "100%",
                /* height: pheight,
            }}
        >
            <Box
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${background})`,
                    filter: 'blur(12px)',
                    backgroundSize: 'cover',
                }}
            >
            </Box>

            

             <Box
                style={{
                    position: 'relative',
                    top: -pheight,
                    margin: 'auto',
                    width: props.width,
                    height: pheight,
                    backgroundImage: `url(${banner})`,
                    backgroundRepeat: "round",
                    margin: "auto",
                }}
            >
                <Box
                    color='primary.contrastText'
                    style={{
                        padding: 10,
                        textAlign: "right",
                    }}
                >
                    <p>+38(000)000-000</p>
                    <p>shyaldomrii@knu.ua</p>
                </Box>
            </Box>
        </Box> */
    );
}

export default Banner;
