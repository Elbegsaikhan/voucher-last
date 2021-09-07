import React, {Component} from "react";
import Swiper from "react-id-swiper";
import {isMobile, isMobileOnly} from "react-device-detect";
import {Link} from "react-router-dom";
import {saveCart} from "../../actions/cart_actions";
import {connect} from 'react-redux';


class SvvldVzsenSlidde extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arr: [],
		};
	}

	saveMe = (id2) => {
		try {
			const id = user && this.props.users._id
			this.props.saveCart({_id: 0, user: id, product: id2, type: 2})
		} catch (error) {
			this.props.saveCart({_id: 0, product: id2, type: 2})
			console.error(error);
		}

	}

	render() {
		const params = this.props.checkout ? {
			slidesPerView: 8,
			spaceBetween: 0,
			containerClass: "swiper-container mainSlider",
			centeredSlides: false,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			breakpoints: {
				768: {
					slidesPerView: 7,
					spaceBetween: 0
				},
				640: {
					slidesPerView: 3,
					spaceBetween: 0
				},
				320: {
					slidesPerView: 2,
					spaceBetween: 0
				},
			},
		} : {
			slidesPerView: 4,
			slidesPerColumn: 2,
			spaceBetween: 0,
			containerClass: "swiper-container mainSlider",
			centeredSlides: false,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			breakpoints: {
				1024: {
					slidesPerView: 4,
					slidesPerColumn: 2,
					spaceBetween: 0
				},
				768: {
					slidesPerView: 2,
					slidesPerColumn: 3,
					spaceBetween: 0
				},
				640: {
					slidesPerView: 2,
					spaceBetween: 0
				},
				320: {
					slidesPerView: 2,
					slidesPerColumn: 3,
					spaceBetween: 0
				},
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
				dynamicBullets: true

			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			shouldSwiperUpdate: true
		}
		const arr = []
		const self = this
		this.props.voucher.map((item, index) => {
			const ht = <div key={index} style={{display: "flex", justifyContent: 'space-around'}}>
				<div className="example-wrapper">
					<div className={isMobile ? "gift-card-mob" : "gift-card1"} onClick={() => self.saveMe(item._id)}>
						<Link to={`/checkout/${item._id}`} style={{textDecoration: "none"}}>
							<div
								className={isMobile ? "gift-card__image_mob" : "gift-card__image"}
								style={{
									backgroundImage: `url(${item.image})`,
								}}
							>
							</div>
						</Link>
					</div>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<span style={{
							fontWeight: 500,
							fontSize: isMobile ? '0.8rem' : '1.5rem',
							color: '#222222',
							textTransform: 'uppercase'
						}}> {item.title} </span>
					</div>
					<div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline'}}>
						<span style={{
							fontWeight: 'bold',
							fontSize: isMobile ? '0.6' : "1.2rem"
						}}>{item.price[0].toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}₮ </span>
						{" "}
						<span style={{
							fontSize: isMobile ? '0.6' : "1.2rem", paddingLeft: '5px'
						}}>{item.category.title.toLowerCase()}</span>
					</div>
				</div>
			</div>

			arr.push(ht)
		})
		return (
			<Swiper {...params}>
				{
					arr
				}
			</Swiper>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		saveCart: (data) => dispatch(saveCart(data))
	}
};
export default connect(null, mapDispatchToProps)(SvvldVzsenSlidde)

