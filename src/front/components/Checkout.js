import React, {useState, useEffect, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {Container, Button, Row, Col} from "react-bootstrap";
import {isMobile, isMobileOnly} from "react-device-detect";
import {getProduct} from "../actions/product_actions.js";
import {getHome} from "../actions/home_actions.js";
import {saveWithdraw} from "../actions/withdraw_actions.js";
import {saveCart, getCart} from "../actions/cart_actions";
import {deleteCoupon} from "../actions/cupon_actions";
import Icon from "@mdi/react";
import ActivityContainer from "./include/ActivityContainer";
import {mdiPlusCircleOutline, mdiMinusCircleOutline} from "@mdi/js";
import Address from "./Second/Address";
import VerifModal from "./Second/VerifModal";
import GiftSlide from "./Slide/GiftSlide";
import Footer from './include/Footer'
import Header from "./include/Header";
import SvvldVzsenSlidde from "./Slide/SvvldVzsenSlidde";

function Checkout(props) {
	const iniState = useSelector((state) => state.main);
	const product = useSelector((state) => state.product);
	const home = useSelector((state) => state.home);
	const coupon = useSelector((state) => state.coupon)
	const dispatch = useDispatch();
	// const {items, all} = cart;


	useEffect(() => {
		// run()

		dispatch(getProduct());
		dispatch(getHome());
		dispatch(getCart())
		// setItems2(items)
	}, []);

	const {user, config} = iniState;
	const {companyGold} = home;
	const [total, setTotal] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [idx, setIdx] = useState(0);
	const [code, setCode] = useState(0)
	const [items2, setItems2] = useState({})

	const openModal = () => {
		if (!user) {
		} else {
			setShowModal((prev) => !prev);
			saveDraw()
		}
	};
	const sags = (id, id2) => {
		dispatch(saveCart({_id: 0, user: id, product: id2, type: 1}))
	};

	let localProduct = localStorage.getItem('productLocal')
	const cards = JSON.parse(localProduct)
	const {loading} = product;

	let card = {};
	// const items2 = Object.values(items)
	const datas = Object.values(cards);
	// niit cardnaasaa idgaar shvvj hudaldaj avah card olno
	datas.map((c, index) => {
		if (c._id === props.match.params.id) {
			card = c;
		}
	});
	const add = () => {
		if (idx < card.price.length - 1) {
			setIdx(idx + 1)
		}
	};
	const hasah = () => {
		if (idx > 0) {
			setIdx(idx - 1)
		}
	};

	/// Tostei baraanuud
	let filteredPro = datas.filter((d) => d.category._id === card.category._id && d._id !== card._id);
	// console.log('aa' + filteredPro)
	let vzsen = localStorage.getItem('svvld')
	vzsen = JSON.parse(vzsen)
	let svvldVzsen = []

	for(let i in vzsen){
		for(let j in cards){
			// console.log("Vzsen", vzsen[i].product)
			// console.log("Svvld", cards[j]._id)
			if(vzsen[i].product === cards[j]._id){
				svvldVzsen.push(cards[j])
			}
		}
	}

	let address = card.address && card.address.split("/");
	address = address && Object.values(address);
	let company = "";
	companyGold.map((com, index) => {
		if (com._id === card.companyId) {
			company = com;
		}
	});
	const saveDraw = () => {
		const item = {
			id: 0,
			companyID: company._id,
			userID: user._id,
			amount: total + card.minprice,
			productID: card._id,
			sku: user.first_name
		}
		dispatch(saveWithdraw(item))
	}
	const couponClick = (code) => {
		if (code) {
			dispatch(deleteCoupon(code))
		} else {
		}

	}
	let shuffleData = datas.filter((d) => d.category._id !== card.category._id);

	return (
		<ActivityContainer loading={loading}>
			<Container
				fluid
				style={{
					padding: "0px",
					backgroundColor: "white",
					position: "relative",
				}}
			>
				{/* <Product /> */}
				<div>
					<Header
						location={props.location}
						history={props.history}
					/>

					<VerifModal
						showModal={showModal}
						setShowModal={setShowModal}
						company={company}
						total={coupon.success === "true" ? card.price[idx] - (card.price[idx] * 0.2) : card.price[idx]}
					/>
					<Container>
						<div
							className={
								isMobile ? "mobile-checkout" : "checkout"
							}
						>
							<div
								className={isMobile ? "" : "example-wrapper2"}
								style={{
									margin: "10px 20px",

								}}
							>
								<div className={isMobile ? "gift-card_mob" : "gift-card"}>
									<div className={isMobile ? "gift-card__image_mob1" : "gift-card__image"}
									     style={{backgroundImage: `url(${card.image})`,}}/>
								</div>
							</div>

							<div
								className={isMobile ? "" : "description"}
								style={{}}
							>
								<div
									style={{
										display: "flex flex-wrap",
										justifyContent: "space-between",
										alignItems: "center",
										width: "auto",
									}}
								>

									<p className={isMobile ? 'mob-flex' : null} style={{
										fontSize: "16px",
										textTransform: "uppercase",
										fontWeight: '500'
									}}>
										Бэлгийн картын үнийн дүнг сонгох
									</p>
									<p style={{padding: "5px 15px"}} className={isMobile ? 'mob-flex' : null}>
										Хязгаар: {card.price[0]}₮ -{" "}
										{card.price[card.price.length - 1]}₮
									</p>
									<div className={isMobile ? "mob-flex" : null}
									     style={{
										     display: 'flex',
										     margin: "10px 10px",
										     alignItems: "baseline",
									     }}
									>
										<div style={{cursor: "pointer"}}>
											<Icon
												onClick={hasah}
												path={mdiMinusCircleOutline}
												size={2}
												color="#ebab34"
											/>
										</div>
										<div
											style={{
												width: "200px",
												height: "80px",
												border: "2px solid #948d8d",
												borderRadius: "5px",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												margin: "5px",
											}}
										>
                                            <span
	                                            style={{
		                                            fontSize: "24px",
		                                            color: "#ebab34",
		                                            fontWeight: "bold",
	                                            }}
                                            >
                                                {card.price[idx]} ₮
                                            </span>
										</div>
										<div style={{cursor: "pointer"}}>
											<Icon
												onClick={add}
												path={mdiPlusCircleOutline}
												size={2}
												color="#ebab34"
											/>
										</div>
									</div>
									<div
										style={{
											width: "",
											height: "60px",
											display: "flex",
											justifyContent: "center",
											maxWidth: "400px",
										}}
									>
										<div style={{display: 'flex'}}>
											<input type="text" placeholder="2%-ын coupon код оруулах"
											       onChange={(event) => setCode(event.target.value)}
											       style={{
												       width: "100%",
												       height: "90%",
												       display: "inline-flex",
												       justifyContent: "center",
												       alignItems: "center",
												       fontSize: '16px',
												       color: "#000",

											       }}/>
											<button
												onClick={() => couponClick(code)}
												style={{
													backgroundColor: "#00FFEF",
													width: "",
													height: "90%",
												}}
											>
												ЭНД ДАР
											</button>
										</div>
									</div>
									<div
										style={{
											display: "flex",
											justifyContent: "flex-end",
											maxWidth: "400px",
										}}
									>
                                        <span style={{margin: "10px"}}>
                                            Нийт үнийн дүн: {coupon.success === "true" ? card.price[idx] - (card.price[idx] * 0.2) : card.price[idx]} ₮
                                        </span>
									</div>
									<div
										style={{
											display: "flex",
											justifyContent: "space-around",
											maxWidth: "400px",
										}}
									>
										{user && user ? (
											<Button
												variant="outline-secondary"
												style={{backgroundColor: ""}}
												onClick={() => sags(user._id, props.match.params.id)}
											>
												Сагсанд нэмэх
											</Button>
										) : (
											<Link
												to={`/login/${props.match.params.id}`}
											>
												<Button
													variant="outline-secondary"
												>
													Сагсанд нэмэх
												</Button>
											</Link>
										)}

										{user && user ? (
											<Button
												onClick={user ? openModal : ""}
												variant="danger"
												style={{
													backgroundColor: "#f56c73",
												}}
											>
												Худалдан авах
											</Button>
										) : (
											<Link
												to={`/login/${props.match.params.id}`}
											>
												<Button
													variant="danger"
													style={{
														backgroundColor:
															"#f56c73",
													}}
													// onClick={historyPush}
												>
													Худалдан авах
												</Button>
											</Link>
										)}
									</div>
								</div>
							</div>
						</div>
					</Container>
					<Container>
						<div
							style={{
								backgroundColor: "",
								width: "100%",
								height: "",
								display: "block",
								marginTop: "20px",
							}}
						>
							<div>
                                <span
	                                style={{
		                                fontWeight: "bold",
		                                padding: "10px 10px",
	                                }}
                                >
                                    Нэмэлт мэдээлэл
                                </span>
							</div>
							<p
								style={{
									padding: "10px 10px",
									textAlign: "justify",
									fontSize: "14px",
								}}
							>
								{card.desc}
								{/*Бэлгийн картны үнийн дүнд Эрүүлмаа төвөөс санал*/}
								{/*болгодог жүүс, хоргүйжүүлэх хөтөлбөр , халуун иог*/}
								{/*болон дасгал, орлох бүтээгдэхүүн гээд өөрийн хүссэн*/}
								{/*бүтээгдэхүүн, үйлчиллүүлэх боломжтой.*/}
							</p>
							<div style={{margin: "20px"}}>
								<p style={{fontSize: "14px"}}>
									Эрхийн бичгээрээ худалдан авах боломжтой бүх
									барааг{" "}
									<a href={company.facebook && company.facebook}>
                                        <span
	                                        style={{
		                                        color: "#00FFEF",
		                                        cursor: "pointer",
	                                        }}
                                        >
                                            энд
                                        </span>{" "}
									</a>
									дарж харна уу
								</p>
							</div>
						</div>
						<div
							style={{
								backgroundColor: "",
								width: "100%",
								height: "",
								display: "block",
								marginTop: "20px",
							}}
						>
							<div style={{}}>
                                <span
	                                style={{
		                                fontWeight: "bold",
		                                padding: "10px 10px",
	                                }}
                                >
                                    Дэлгүүрийн байршил
                                </span>
							</div>

							<Address
								name="Максмолл"
								phone={address && address.pop()}
								addre={address && address.pop()}
							/>

						</div>
						<div style={{marginTop: "20px", marginBottom: "20px"}}>
                            <span style={{
	                            fontWeight: "bold",
	                            padding: "10px 10px",
	                            marginTop: '20px'
                            }}>Төстэй бараанууд</span>
						</div>
					</Container>
				</div>
				<GiftSlide voucher={filteredPro} checkout={true}/>
				<Container>
					<div style={{marginTop: "20px", marginBottom: "20px"}}>
                            <span style={{
	                            fontWeight: "bold",
	                            padding: "10px 10px",
	                            marginTop: '20px'
                            }}>Таньд санал болгох бараа</span>
					</div>
				</Container>
				<GiftSlide voucher={shuffleData} checkout={true} tandSanal={true}/>


				<Container>
					<div style={{marginTop: "20px", marginBottom: "20px"}}>
                            <span style={{
	                            fontWeight: "bold",
	                            padding: "10px 10px",
	                            marginTop: '20px'
                            }}>Сүүлд үзсэн бараанууд</span>
					</div>
				</Container>
				<SvvldVzsenSlidde voucher={svvldVzsen} checkout={true}/>
			</Container>
			<Footer/>
		</ActivityContainer>

	);
}

export default Checkout;
