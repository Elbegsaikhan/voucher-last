import React, {useEffect, useState} from 'react';
import {useSpring, animated} from "react-spring";
import {Image} from "react-bootstrap";
import {isMobile} from "react-device-detect";

function WindowScroll(props) {
	const [show, setShow] = useState(false)
	useEffect(() => {
		window.addEventListener("scroll", handleScroll, {passive: true});

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	const handleScroll = () => {
		const position = window.pageYOffset;
		position > 500 ? setShow(true) : setShow(false)
	};
	const scroll = () => {
		window.scrollTo({top: 0, left: 0, behavior: "smooth"})
	}
	const animation = useSpring({
		to: {opacity: 1},
		from: {opacity: 0},

	})
	return (
		<React.Fragment>
			{
				show ? (
					<animated.div style={animation}>
						<div className="scrollBack" style={{backgroundColor: '#FFf', color: "#00FFEF"}} onClick={scroll}>
							{/*👆*/}
							<img src='/uploads/2021/05/hand.png' style={{
								backgroundSize: "cover",
								backgroundRepeat: 'no-repeat',
								width: '30px',
								height: '30px'
							}}/>
						</div>
					</animated.div>
				) : null
			}
		</React.Fragment>
	);
}

export default WindowScroll;
