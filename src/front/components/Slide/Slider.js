import React, {useState} from "react";
import Swiper from "react-id-swiper";
import {isMobile, isMobileOnly} from "react-device-detect";

const Autoplay = (props) => {

    const params1 = props.pagi
        ? {
            spaceBetween: 0,
            containerClass: "swiper-container mainSlider",
            centeredSlides: false,
            effect: props.border ? "fade" : null,
            loop: true,
            autoplay: {
                delay: props.border ? 2500 : 1500,
                disableOnInteraction: false,
            },

            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        }
        : {
            spaceBetween: 0,
            containerClass: "swiper-container mainSlider",
            centeredSlides: false,
            effect: 'fade',
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },

            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        };
    const [isStopped, setIsStopped] = useState(false);
    const [isPaused, serIsPause] = useState(false);
    return (
        <div style={{position: ""}}>

            <Swiper {...params1}>
                {props.slides.map((item, index) => (
                    <div
                        key={index}
                        style={
                            props.border
                                ? {
                                    backgroundColor: item.color,
                                    padding: "40px",
                                    borderRadius: "10px",
                                }
                                : {}
                        }
                    >
                        {props.border && props.border ? (
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100px",
                                    zIndex: 999,
                                    textAlign: "center",
                                    bottom: "0",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignContent: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "200px",
                                            width: isMobileOnly ? "200px" : "300px",
                                            backgroundColor: item.color,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: "white",
                                                fontWeight: 800,
                                                fontSize: "20px",
                                                marginTop: "20px",
                                            }}
                                        >
                                            {item.title}
                                        </div>
                                        <div
                                            style={{
                                                color: "white",
                                                fontWeight: 600,
                                                fontSize: "18px",
                                            }}
                                        >
                                            Shop Now
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <div
                            className="mainSlider-cont"
                            style={{width: "100%", height: "auto"}}
                        >
                            <img
                                src={props.border ? item.image : item.image}
                                width="100%"
                                style={{
                                    width: "100%",
                                    height: isMobileOnly ? "320px" : props.height,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </Swiper>
        </div>
    );
};
export default Autoplay;
