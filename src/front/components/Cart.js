import React, {useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {getCart} from "../actions/cart_actions";
import Header from "./include/Header";
import Footer from './include/Footer'
import {getProduct} from "../actions/product_actions";
import ActivityContainer from "./include/ActivityContainer";
import Cards from "./Card/Cards";

function Cart(props) {

	const cart = useSelector((state) => state.cart)
	const product = useSelector((state) => state.product)
	const dispatch = useDispatch()
	const stableDispatch = useCallback(dispatch, []);

	useEffect(() => {
		dispatch(getCart())
		dispatch(getProduct())
	}, [stableDispatch]);


	const {cards} = product
	let {items} = cart
	items = items.filter((it) => it.type === 1)
	const datas = Object.values(cards)
	const its = Object.values(items)
	let arr = []
	for(let i in datas){
		for(let j in its){
			if(datas[i]._id === its[j].product){
				arr.push(datas[i])
			}
		}
	}
	console.log("Arrr", arr)
	return (
		<React.Fragment>
			<Header
				location={props.location}
				history={props.history}
			/>
			<div>
				<ActivityContainer loading={false}>
					<Cards voucher={arr}/>
				</ActivityContainer>
			</div>
			<Footer/>
		</React.Fragment>
	);
}

export default Cart;
