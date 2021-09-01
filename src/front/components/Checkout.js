import React, {useState, useEffect} from "react";
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

function Checkout(props) {
	const iniState = useSelector((state) => state.main);
	const product = useSelector((state) => state.product);
	const home = useSelector((state) => state.home);
	const cart = useSelector((state) => state.cart)
	const coupon = useSelector((state) => state.coupon)
	const dispatch = useDispatch();
	const {items, all} = cart


	useEffect(() => {
		// run()
		dispatch(getProduct());
		dispatch(getHome());
		dispatch(getCart())
		setItems2(items)

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

	const {cards, loading} = product;
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
	const vzsen = []
	if (user) {
		const iii = Object.values(items2)
		let cartItems = iii.filter((ite) => ite.type === 2 && ite.user === user._id)
		console.log("Items", cartItems)
		const svvld = []
		cartItems.map((ci) => {
			svvld.push(ci.product)
		})
		datas.map((d) => {
			for (let rr in svvld) {
				if (d._id === svvld[rr]) {
					vzsen.push(d)
				}
			}
		})
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

					<div
						className="banner-image"
						style={{backgroundColor: "#00FFEF", height: "110px", marginTop: '0'}}
					>
						<Link to={"/"}>
							<img
								src={"/uploads/2021/05/logo-white-nice2.png"}
								style={{height: "110px"}}
							/>
						</Link>
					</div>

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
									margin: "15px 30px",

								}}
							>
								<div className={isMobile ? "gift-card_mob" : "gift-card"}>
									<div className={isMobile ? "gift-card__image_mob" : "gift-card__image"}
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
										fontSize: "18px",
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

										<input type="text" placeholder="2%-ын coupon код оруулах"
										       onChange={(event) => setCode(event.target.value)}
										       style={{
											       width: "100%",
											       height: "90%",
											       display: "inline-flex",
											       justifyContent: "center",
											       alignItems: "center",
											       fontSize: '18px',
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
				{
					user ? (
						<React.Fragment>
							<Container>
								<div style={{marginTop: "20px", marginBottom: "20px"}}>
                            <span style={{
	                            fontWeight: "bold",
	                            padding: "10px 10px",
	                            marginTop: '20px'
                            }}>Сүүлд үзсэн бараанууд</span>
								</div>
							</Container>
							<GiftSlide voucher={vzsen} checkout={true}/>
						</React.Fragment>
					) : ''
				}

			</Container>
			<Footer/>
		</ActivityContainer>

	);
}

export default Checkout;
