import React, {Fragment} from "react";
import ReactDOM from "react-dom";
import {Layout, Menu, Icon, message, Row} from "antd";

const {Header, Content, Sider} = Layout;
const rootElement = document.getElementById("social");
import withRouter from "react-router/es/withRouter";
import config from "./config";
import {Router, Route, Switch, Link} from "react-router-dom";
import configureStore from "./store";
import {Provider} from "react-redux";
import {createBrowserHistory as createHistory} from "history";

let history = createHistory();
let main = window.__INITIAL_STATE__;
const store = configureStore(main);

import Login from "./components/Login";
import Home from "./components/Home";
import Slider from "./components/Slider";
import About from "./components/About";
import Categories from "./components/Categories";
import Locations from "./components/Locations";
import NotFound from "./components/include/NotFound";
import Pages from "./components/Pages";
import Tutions from "./components/Tutions";
import Companies from "./components/Companies";
import Requests from "./components/Requests";
import News from "./components/News";
import GroupNames from "./components/GroupNames";
import Product from "./components/Product"
import Withdraw from './components/Withdraw'
import Banner from './components/BannerImg'
import Cuponcode from "./components/Cuponcode";

class ReactIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: false,
		};
	}

	componentDidMount() {
		this.onSuccessField = config
			.get("emitter")
			.addListener("success", function (text) {
				message.success(text);
			});
		this.onErrorField = config
			.get("emitter")
			.addListener("error", function (text) {
				message.warning(text);
			});
	}

	componentWillUnmount() {
		this.onErrorField.remove();
		this.onSuccessField.remove();
	}

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	render() {
		let user = main.main.user;
		if (user === null || user === undefined || user === "") {
			return (
				<Fragment>
					<Route exact path={"/admin"} component={Login}/>
				</Fragment>
			);
		} else {
			return (
				<Layout>
					<Sider
						trigger={null}
						// width={240}
						collapsible
						collapsed={this.state.collapsed}
					>
						<div className="logo" style={{textAlign: "center"}}>
							<Link to="/dashboard">
								<h3
									style={{
										color: "#fff",
										padding: "20px 0 10px 0px",
									}}
								>
									Vouchers
								</h3>
							</Link>
						</div>
						{user.role === "company" ? (
							<Menu
								theme={"dark"}
								defaultSelectedKeys={["companies"]}
								mode="inline"
							>
								<Menu.Item key="companies">
									<Link to="/dashboard/companies">
										<Icon type="read"/>
										<span>Байгууллага</span>
									</Link>
								</Menu.Item>
								<Menu.Item key="product" disabled={user.status !== "active"}>
									<Link to="/dashboard/product">
										<Icon type="file-image"/>
										<span>Voucher нэмэх</span>
									</Link>
								</Menu.Item>
								<Menu.Item key="coupon">
									<Link to="/dashboard/coupon">
										<Icon type="dashboard"/>
										<span>Купон</span>
									</Link>
								</Menu.Item>

								<Menu.Item key="requests">
									<Link to="/dashboard/withdraw">
										<Icon type="dollar"/>
										<span>Авалтууд</span>
									</Link>
								</Menu.Item>

							</Menu>
						) : (
							<Menu
								theme={"dark"}
								defaultSelectedKeys={["home"]}
								mode="inline"
							>
								<Menu.Item key="home">
									<Link to="/dashboard">
										<Icon type="dashboard"/>
										<span>Хянах самбар</span>
									</Link>
								</Menu.Item>
								<Menu.SubMenu
									key="newsA"
									title={
										<span>
                                            <Icon type="read"/>
                                            <span>Байгууллага</span>
                                        </span>
									}
								>
									<Menu.Item key="companies">
										<Link to="/dashboard/companies">
											<Icon type="read"/>
											<span>Байгууллагууд</span>
										</Link>
									</Menu.Item>
									<Menu.Item key="cat">
										<Link to="/dashboard/categories">
											<Icon type="fork"/>
											<span>Ангилал</span>
										</Link>
									</Menu.Item>

								</Menu.SubMenu>
								<Menu.Item key="slider">
									<Link to="/dashboard/slider">
										<Icon type="file-image"/>
										<span>Слайдер</span>
									</Link>
								</Menu.Item>
								<Menu.Item key="banner">
									<Link to="/dashboard/banners">
										<Icon type="picture"/>
										<span>Баннер</span>
									</Link>
								</Menu.Item>
								<Menu.Item key="product">
									<Link to="/dashboard/product">
										<Icon type="file-image"/>
										<span>Voucher нэмэх</span>
									</Link>
								</Menu.Item>
								<Menu.Item key="about">
									<Link to="/dashboard/about">
										<Icon type="container"/>
										<span>Тохиргоо</span>
									</Link>
								</Menu.Item>
							</Menu>
						)}
					</Sider>

					<Layout>
						<Header style={{background: "#fff"}}>
							<Row
								align="middle"
								type="flex"
								justify="space-between"
							>
								<Icon
									className="trigger"
									type={
										this.state.collapsed
											? "menu-unfold"
											: "menu-fold"
									}
									onClick={this.toggle}
								/>
								<a href="/api/logout" style={{fontSize: 14}}>
									<Icon
										type="logout"
										style={{marginRight: 5}}
									/>{" "}
									Гарах
								</a>
							</Row>
						</Header>
						<Content
							style={{
								margin: "24px 16px",
								background: "#fff",
								minHeight: "calc(100vh - 112px)",
							}}
						>
							{user.role === "company" ? (
								<Switch>
									<Route
										exact
										path="/dashboard/"
										component={withRouter(Companies)}
									/>
									<Route
										exact
										path="/dashboard/tutions"
										component={withRouter(Tutions)}
									/>
									<Route
										exact
										path="/dashboard/coupon"
										component={withRouter(Cuponcode)}
									/>
									<Route
										exact
										path="/dashboard/companies"
										component={withRouter(Companies)}
									/>
									<Route
										exact
										path="/dashboard/product"
										component={withRouter(Product)}
									/>
									<Route
										exact
										path="/dashboard/news"
										component={withRouter(News)}
									/>
									<Route
										exact
										path="/dashboard/requests"
										component={withRouter(Requests)}
									/>
									<Route
										exact
										path="/dashboard/withdraw"
										component={withRouter(Withdraw)}
									/>

									<Route
										exact
										path={"*"}
										component={withRouter(NotFound)}
									/>
								</Switch>
							) : (
								<Switch>
									<Route
										exact
										path="/dashboard"
										component={withRouter(Home)}
									/>
									<Route
										exact
										path="/dashboard/slider"
										component={withRouter(Slider)}
									/>
									<Route
										exact
										path="/dashboard/about"
										component={withRouter(About)}
									/>
									<Route
										exact
										path="/dashboard/categories"
										component={withRouter(Categories)}
									/>
									<Route
										exact
										path="/dashboard/banners"
										component={withRouter(Banner)}
									/>
									<Route
										exact
										path="/dashboard/locations"
										component={withRouter(Locations)}
									/>
									<Route
										exact
										path="/dashboard/pages"
										component={withRouter(Pages)}
									/>
									<Route
										exact
										path="/dashboard/companies"
										component={withRouter(Companies)}
									/>
									<Route
										exact
										path="/dashboard/product"
										component={withRouter(Product)}
									/>
									<Route
										exact
										path="/dashboard/groupnames"
										component={withRouter(GroupNames)}
									/>
									<Route
										exact
										path={"*"}
										component={withRouter(NotFound)}
									/>
								</Switch>
							)}
						</Content>
					</Layout>
				</Layout>
			);
		}
	}
}

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<ReactIndex/>
		</Router>
	</Provider>,
	rootElement
);
