import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../actions/cart_actions";
import Header from "./include/Header";
import Footer from './include/Footer'
import { getProduct } from "../actions/product_actions";
import ActivityContainer from "./include/ActivityContainer";
import Cards from "./Card/Cards";
import { useCart } from 'react-use-cart'

function Cart(props) {

	// const cart = useSelector((state) => state.cart)
	// const product = useSelector((state) => state.product)
	// const dispatch = useDispatch()
	// const stableDispatch = useCallback(dispatch, []);

	// useEffect(() => {
	// 	dispatch(getCart())
	// 	dispatch(getProduct())
	// }, [stableDispatch]);


	// const { cards } = product
	// let { items } = cart
	// items = items.filter((it) => it.type === 1)
	// items = localStorage.getItem('cart')
	// items = JSON.parse(items)
	// items = items[0]
	// const datas = Object.values(cards)
	// const its = Object.values(items)
	// let arr = []
	// for (let i in datas) {
	// 	for (let j in its) {
	// 		if (datas[i]._id === its[j].product) {
	// 			arr.push(datas[i])
	// 		}
	// 	}
	// }
	// console.log("Arrr", arr.length)
	const { items } = useCart()
	return (
		<React.Fragment>
			<Header
				location={props.location}
				history={props.history}
			/>
			<div>
				<ActivityContainer loading={false}>
					{
						items.length === 0 ? (
							<React.Fragment>

								<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
									<img src={"/uploads/2021/05/empty.png"} />
								</div>
								<p style={{ fontSize: '1.5rem', textAlign: 'center' }}>Таны сагс хоосон байна</p>
							</React.Fragment>
						) : (
							<div>
								<Cards voucher={items} />
							</div>
						)
					}
				</ActivityContainer>
			</div>
			<Footer />
		</React.Fragment>
	);
}

export default Cart;
