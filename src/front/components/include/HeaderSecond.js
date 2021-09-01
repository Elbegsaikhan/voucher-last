import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {isMobile} from "react-device-detect";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiMenu, mdiClose, mdiMagnify, mdiChevronDown, mdiChevronRight} from "@mdi/js";
import {getCart} from "../../actions/cart_actions";

function HeaderTail(props) {
	const cart = useSelector((state) => state.cart)
	const [sideBar, setSidebar] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [showMenu2, setShowMenu2] = useState(false);
	const [showMenu3, setShowMenu3] = useState(false);
	const [search, setSearch] = useState("");

	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(getCart())

		window.addEventListener("scroll", handleScroll, {passive: true});
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const handleScroll = () => {

		setSidebar(false);
	};

	const showSiderBar = () => {
		setSidebar(!sideBar);
	};
	const menuHandle = () => {
		setShowMenu(!showMenu);
		setShowMenu2(false);
	};
	const menuHandle2 = () => {
		setShowMenu2(!showMenu2);
		setShowMenu(false);
	};
	const menuHandle3 = () => {
		setShowMenu3(!showMenu3);
		setShowMenu(false);
	};
	const searchSub = (para) => {
	};
	const {items, all} = cart

	return (
		<div>
			<div
				style={{
					width: "100%",
					height: "120px",
					backgroundColor: "#00FFEF",
					display: "flex",
					justifyContent: "space-around",
					alignItems: "baseline",
				}}
			>
				<div className="">
					{/* <Link to="/"> */}
					<Icon
						onClick={showSiderBar}
						path={sideBar ? mdiClose : mdiMenu}
						size={1}
						color="#fff"
						style={{cursor: "pointer"}}
					/>
					{/* </Link> */}
				</div>
				<Link to="/">
					<img src={props.config.logo} alt="vouchers.mn" width={isMobile ? "180px" : "300px"} height={isMobile ? "75px" : "101px"}/>
				</Link>
				<div className="shop-icon">
					<Link to={"/cart"}>
						<img src={" /images/svgexport-1.png"} alt="icon"/>
						<span className="shop-icon__badge" style={{fontWeight: "400", fontSize: "12px"}}>
                        {all & all}
                    </span>
					</Link>
				</div>
			</div>

			{sideBar ? (
				<div>
					<nav className={sideBar ? "nav-menu active" : "nav-menu"} style={{visibility: ""}}>
						{props.user ? (
							props.user.role === "company" || props.user.role === "admin" ? (
								<React.Fragment>
									<ul className="nav-menu-items">
										<li className="nav-text nav-title">
											<a href="/dashboard">Удирдах хэсэг</a>
										</li>
										<li className="nav-text nav-title">
											<a href="/api/logout">
												<span>Гарах</span>
											</a>
										</li>
									</ul>
								</React.Fragment>
							) : (
								<React.Fragment>
									<ul className="nav-menu-items">
										<li className="nav-text nav-title">
											<Link to="/profile">
												<span>Миний хуудас</span>
											</Link>
										</li>
										<li className="nav-text nav-title">
											<a href="/api/logout">Гарах</a>
										</li>
									</ul>
								</React.Fragment>
							)
						) : (
							<ul className="nav-menu-items">
								<li className="nav-text searching">
									<input
										type="text"
										className=""
										placeholder="түүнд төгс тохирох бэлгийн картыг хайж олоорой "
										style={{
											width: "70%",
											marginTop: "5px",
											fontSize: "12px",
											marginLeft: "20px",
											padding: "5px 5px",
										}}
										value={search}
										onChange={(event) => setSearch(event.target.value)}
									/>
									<button onClick={() => props.search(search)} className="btn">
										<Icon path={mdiMagnify} size={1} color="#000"/>
									</button>
								</li>
								<li className="nav-text nav-title">
                                    <span
	                                    onClick={menuHandle}
	                                    className="nav-text"
	                                    style={{display: "flex", justifyContent: "space-between"}}
                                    >
                                        Ангилалууд
                                        <Icon
	                                        path={showMenu ? mdiChevronDown : mdiChevronRight}
	                                        size={1}
	                                        color="#909090"
                                        />
                                    </span>
									{showMenu ? (
										<ul>
											<li>
												<Link to="/">
													<span className="nav-text2">Эмэгтэйчүүд</span>
												</Link>
											</li>
											<li>
												<Link to="/">
													<span className="nav-text2">Эрэгтэйчүүд</span>
												</Link>
											</li>
										</ul>
									) : (
										""
									)}
								</li>
								<li className="nav-text nav-title">
                                    <span
	                                    className="nav-text"
	                                    style={{display: "flex", justifyContent: "space-between"}}
	                                    onClick={() => props.scroll("myRef")}
                                    >
                                        Брэндүүд
                                    </span>
								</li>
								<li className="nav-text nav-title">
                                    <span
	                                    onClick={() => props.scroll("ref2")}
	                                    className="nav-text"
	                                    style={{display: "flex", justifyContent: "space-between", color: "#00FFEF"}}
                                    >
                                        Яг одоо трэнд болж байгаа
                                        <Icon
	                                        path={showMenu ? mdiChevronDown : mdiChevronRight}
	                                        size={1}
	                                        color="#909090"
                                        />
                                    </span>
									{showMenu3 ? (
										<ul>
											<li>
												<Link to="/">
													<span className="nav-text2">Бүсгүйчүүд</span>
												</Link>
											</li>
											<li>
												<Link to="/">
													<span className="nav-text2">Эрчүүд</span>
												</Link>
											</li>
											<li>
												<Link to="/">
													<span className="nav-text2">Хүүхдүүдэд</span>
												</Link>
											</li>
										</ul>
									) : (
										""
									)}
								</li>
								<li className="nav-text nav-title">
                                    <span
	                                    onClick={menuHandle2}
	                                    className="nav-text"
	                                    style={{display: "flex", justifyContent: "space-between"}}
                                    >
                                        Хямдралтай
                                        <Icon
	                                        path={showMenu ? mdiChevronDown : mdiChevronRight}
	                                        size={1}
	                                        color="#909090"
                                        />
                                    </span>
									{showMenu2 ? (
										<ul>
											<li>
												<Link to="/">
													<span className="nav-text2">Бүсгүйчүүд</span>
												</Link>
											</li>
											<li>
												<Link to="/">
													<span className="nav-text2">Эрчүүд</span>
												</Link>
											</li>
											<li>
												<Link to="/">
													<span className="nav-text2">Хүүхдүүдэд</span>
												</Link>
											</li>
										</ul>
									) : (
										""
									)}
								</li>
								<li className="nav-text nav-title">
									<Link to="/login">
                                        <span
	                                        className=" "
	                                        style={{
		                                        display: "flex",
		                                        justifyContent: "space-between",
	                                        }}
                                        >
                                            Нэвтрэх
                                        </span>
									</Link>
								</li>
								<li className="nav-text nav-title">
									<Link to="/register">
										<span className="">Бүртгүүлэх</span>
									</Link>
								</li>
							</ul>
						)}
					</nav>
				</div>
			) : (
				""
			)}
		</div>
	);
}

export default HeaderTail;
