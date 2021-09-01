import React, {Component} from "react";
import Swiper from "react-id-swiper";
import GiftCard from "../Card/GiftCard";
import {isMobile, isMobileOnly} from "react-device-detect";
import {Link} from "react-router-dom";

class CateSlide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: [],
        };
    }

    render() {
        const params =
            {
                slidesPerView: 4,
                spaceBetween: 0,
                containerClass: "swiper-container mainSlider",
                centeredSlides: false,
                grabCursor: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,

                },

                breakpoints: {
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 0
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 0
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 0
                    },
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 0
                    },
                },
                // rebuildOnUpdate: true,
                shouldSwiperUpdate: true
            }

        return (
            <Swiper {...params}>
                {this.props.voucher.map((item, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: 'space-around'}}>
                        {/*<GiftCard item={item}/>*/}
                        <div className="example-wrapper">
                            <div className="gift-card">
                                <Link to={`/checkout/${item._id}`} style={{textDecoration: "none"}}>
                                    <div
                                        className="gift-card__image"
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                        }}
                                    >
                                    </div>
                                </Link>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <h3> {item.title} </h3>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline'}}>
                                <span style={{ fontWeight: 'bold', fontSize: "1.2rem"}}>{item.price[0].toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}₮ </span>
                                {/*<span style={{ textTransform: 'lowercase', marginLeft: '2px'}}>{item.category.title}</span>*/}
                            </div>
                        </div>
                    </div>
                ))}
            </Swiper>
        );
    }
}

export default CateSlide;
