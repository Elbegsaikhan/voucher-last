import React, { Component } from "react";
import Swiper from "react-id-swiper";
import { isMobile } from "react-device-detect";

class MyComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {}

    componentDidMount() {}

    render() {
        const params1 = {
            spaceBetween: 0,
            containerClass: "swiper-container mainSlider",
            centeredSlides: false,
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        };
        return (
            <React.Fragment>
                <Swiper {...params1}>
                    {this.props.slides.map((item, index) => (
                        <div key={index}>
                            <div
                                className="mainSlider-cont"
                                style={{ width: "100%", height: "auto" }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        height: "400px",
                                        position: "absolute",
                                        zIndex: 999,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                </div>
                                <img
                                    src={item.image}
                                    width="100%"
                                    style={{
                                        width: "100%",
                                        height: "420px",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </Swiper>
            </React.Fragment>
        );
    }
}

export default MyComponent;
