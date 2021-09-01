import React, {Component} from "react";
import {connect} from "react-redux";
import {getHome} from "../actions/home_actions";
import {getProduct} from "../actions/product_actions";
import {getCart} from '../actions/cart_actions'
import ActivityContainer from "./include/ActivityContainer";
import Header from "./include/Header";
import Footer from "./include/Footer";
import Slider from "./Slide/Slider";
import Cards from "./Card/Cards";
import Brands from "./Brands/Brands";
import BannerSlide from "./Slide/BannerSlide";
import Category from "./include/Category";
import CateSlide from "./Slide/CateSlide";
import {isMobileOnly, isMobile} from "react-device-detect";
import {Link} from "react-router-dom";

const reducer = ({home, main, product, cart}) => ({home, main, product, cart});

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCate: false,
            cate: '',
            cateName: '',
            showModal: 'true',
            showSearch: false,
            searchTitle: ''
        };
        this.myRef = React.createRef()
        this.ref2 = React.createRef()
        this.cateRef = React.createRef()
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.getHome();
        this.props.getProduct();
        this.props.getCart();
        // this.setState({ showModal: })
    }

    render() {
        const {
            main: {config, user},
            home: {
                loading,
                cates,
                locations,
                sliders,
                companyGold,
                companyPlatinum,
            },
            product: {cards},
            cart: {items, all}
        } = this.props;
        let c = 0

        const datas = Object.values(cards);
        const sale = []
        const trend = []
        datas.map((d, i) => {
            if (d.torol === 'sale') {
                sale.push(d)
            } else if (d.torol === 'trend') {
                trend.push(d)
            }
        })

        const slide1 = [];
        const slide = [];

        const cArr = ['6129cd756965dc214c2772ad', '6129ce0c6965dc214c2772d9', '6129ce1c6965dc214c2772e0']
        sliders.map((item, index) => {
            if (item.position === 2) {
                slide1.push({
                    image: item.image,
                    color: item.description,
                    title: item.title,
                    c: cArr.pop()
                });
            }
            if(item.position === 1){
                slide.push({image: item.image})
            }
        });
        let sliders3 = (sliders || []).filter((aa) => aa.position === 3);
        let sliders4 = (sliders || []).filter((aa) => aa.position === 4);
        let sliders5 = (sliders || []).filter((aa) => aa.position === 5);
        let sliders6 = (sliders || []).filter((aa) => aa.position === 6);
        let sliders8 = []
        sliders.map((sm, inde) => {
            if (sm.position > 6) {
                sliders8.push(sm.image)
            }
        })

        let bannerArr = [sliders3, sliders4, sliders5, sliders6];
        const scrollWindow = (ref) => {
            if (ref === 'myRef') {
                this.myRef.current.scrollIntoView({behavior: "smooth",})
            } else if (ref === 'ref2') {
                this.ref2.current.scrollIntoView({behavior: "smooth",})
            }

        }
        const showCategory = (slug) => {

            this.setState({cate: slug[0]})
            this.setState({cateName: slug[1]})
            this.setState({showCate: true})
            this.setState({showSearch: false})
            this.cateRef.current.scrollIntoView({behavior: "smooth"})

        }
        let searchData = []
        const searchPro = (title) => {
            this.setState({searchTitle: title})
            this.setState({showSearch: true})
            this.setState({showCate: false})
            this.cateRef.current.scrollIntoView({behavior: "smooth"})

        }
        return (
            <React.Fragment>

                <Header
                    location={this.props.location}
                    history={this.props.history}
                    scroll={scrollWindow}
                    search={searchPro}
                />

                <ActivityContainer loading={loading}>
                    {/*Slide swiper*/}
                    <Slider
                        slides={slide}
                        pagi={true}
                        height="900px"
                        lott={true}
                    />
                    <div className="table center" style={{zIndex: 10}}>
                        <div className="monitor-wrapper center">
                            <div className="monitor center">
                                <p>Хүнээс аваагүй миний воучер хүнд өгөхгүй ганцхан миний воучер О. Дашбалбар</p>
                            </div>
                        </div>
                    </div>

                    {/*SLide 2*/}
                    <div>
                        {slide1.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    position: 'relative',
                                    backgroundColor: item.color,
                                    // padding: "40px",
                                    // borderRadius: "10px",
                                    width: "100%",
                                    marginBottom: "60px"
                                }}
                            >

                                <div
                                    style={{height: "auto", display: "flex", justifyContent: 'center'}}
                                >
                                    <img
                                        src={item.image}
                                        style={{
                                            margin: "10px",
                                            width: "100%",
                                            height: isMobile ? "300px" : "900px",
                                            backgroundSize: "cover",
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100px",
                                        zIndex: 9,
                                        textAlign: "center",
                                        bottom: "-40px",
                                        // top: 0
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignContent: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: "100px",
                                                width: isMobileOnly ? "200px" : "300px",
                                                backgroundColor: item.color,
                                                cursor: "pointer",
                                                borderRadius: "2px"
                                            }}
                                        >
                                            <Link to={`/cate/${item.c}`} style={{textDecoration: "none"}}>

                                                <div
                                                    style={{
                                                        color: "white",
                                                        fontWeight: 800,
                                                        fontSize: "24px",
                                                        marginTop: "20px",
                                                    }}
                                                >
                                                    {item.title}
                                                </div>


                                                <div
                                                    style={{
                                                        color: "white",
                                                        fontWeight: 600,
                                                        fontSize: "18px",
                                                    }}
                                                >
                                                    Shop Now
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/*Бэлгийн картнууд*/}
                    <div className="banner-image">
                        <img src={sliders8[0] && sliders8[0]} style={{width: "100%", backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}/>
                    </div>
                    <div ref={this.ref2}>
                        <Cards image="uploads/2021/08/ygodoo.jpg" voucher={sale} user={user}/>
                    </div>
                    {/*Тренд бэлгийн картнууд*/}
                    <div className="banner-image">
                        <img src={sliders8[1] && sliders8[1]} style={{width: "100%", backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}/>
                    </div>
                    <Cards
                        image="uploads/2021/08/sale.jpg"
                        voucher={trend}
                        user={user}
                    />

                    <div className="banner-image">
                        <img src={sliders8[2] && sliders8[2]} style={{width: "100%", backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}/>
                    </div>
                    {/*<CustomCard/>*/}
                    <Category show={showCategory}/>
                    <div ref={this.cateRef}/>
                    {
                        this.state.showCate ? (
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '90px',
                                    width: "100%",
                                    backgroundColor: '#00FFEF',
                                    color: '#000',
                                    marginBottom: '10px'
                                }}>
                                    <span style={{
                                        color: "#fff",
                                        fontSize: '2rem',
                                        fontWeight: '600',
                                        textTransform: 'lowercase'
                                    }}>{this.state.cateName.charAt(0).toUpperCase() }</span></div>
                                <CateSlide voucher={datas.filter((d) => d.category._id === this.state.cate)}/>
                            </div>
                        ) : null
                    }
                    {
                        this.state.showSearch ? (
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '90px',
                                    width: "100%",
                                    backgroundColor: '#00FFEF',
                                    color: '#000',
                                    marginBottom: '10px'
                                }}>
                                    <span
                                        style={{color: "#fff", fontSize: '2rem', fontWeight: '600', textTransform: 'lowercase'}}>Хайлтын илэрц</span>
                                </div>
                                <CateSlide voucher={datas.filter((d) => d.title === this.state.searchTitle)}/>
                            </div>
                        ) : null
                    }
                    {/*Брэнд буюу Компани байх хэсэг*/}
                    <Link to={"/brands"}>
                        <div className="banner-image">
                            <img src={sliders8[3] && sliders8[3]} style={{width: "100%", backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}/>
                        </div>
                    </Link>
                    <div ref={this.myRef}>
                        <Brands brands={companyGold}/>
                    </div>

                    <div className="banner-image">
                        <img src={sliders8[4] && sliders8[4]} style={{width: "100%", backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}/>
                    </div>
                    <div style={{}}>
                        {bannerArr
                            .filter((ban) => ban.length > 0)
                            .map((ban, index) => (
                                <BannerSlide slides={ban} height="500px"/>
                            ))}
                    </div>
                    {/*<div style={{ height: "30px" }}>/!*<h1>asd</h1>*!/</div>*/}
                </ActivityContainer>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default connect(reducer, {getHome, getProduct, getCart})(Home);
