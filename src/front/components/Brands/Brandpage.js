import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getHome} from "../../actions/home_actions.js";
import {getProduct} from "../../actions/product_actions";
import Header from "../include/Header";
import Footer from "../include/Footer.js";
import {isMobileOnly} from "react-device-detect";

function Brandpage(props) {
    const home = useSelector((state) => state.home);
    const product = useSelector((state) => state.product)
    const dispatch = useDispatch();

    useEffect(() => {
        // run()
        dispatch(getHome());
        dispatch(getProduct())
    }, []);
    const {companyGold} = home;
    let {cards} = product;
    cards = Object.values(cards)
    const a = (id) => {
        let a = cards.filter((card) => card.companyId === id)
        return a.length
    }

    return (
        <React.Fragment>
            <Header location={props.location} history={props.history}/>
            <div
                style={{
                    width: "100%",
                    // backgroundColor: "#00FFEF",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "30px",
                    height: "80px",
                    alignItems: "center",
                }}
            >
                <h3 style={{color: "#333333"}}>БРЕНДҮҮД</h3>
            </div>
            <div
                style={{
                    display: isMobileOnly ? 'flex-wrap' : "flex",
                    justifyContent: "center",
                    marginLeft: "20px",
                    marginRight: "20px",
                    marginBottom: "50px",
                }}
            >
                {companyGold.map((brand, index) => (
                    <div key={index}
                         className="cardMain"
                         style={{
                             height: "350px",
                             backgroundColor: "white",
                             position: "relative",
                             display: 'flex',
                             justifyContent: 'center',
                             marginBottom: '20px'
                         }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                marginRight: "auto",
                                marginLeft: "auto",
                                width: "90px",
                                height: "90px",
                                zIndex: 11,
                                backgroundImage: `url(${brand.logo})`,
                                bottom: '60px',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                        </div>
                        <div
                            className="cardContainer"
                            style={{}}
                        >

                            <div
                                className="cardContainer"
                                style={{
                                    backgroundImage: `url(${brand.image})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >

                            </div>
                        </div>
                        <div style={{position: 'absolute', display: 'flex', justifyContent: 'center', bottom: "15px", textTransform: 'uppercase'}}>
                            <span style={{ fontWeight: '400', padding: "2px", fontSize: '1.2rem'}}>{brand.name}</span>
                        </div>
                        <div style={{position: 'absolute', display: 'flex', justifyContent: 'center', bottom: "0px", textTransform: 'uppercase'}}>
                            <span style={{ fontSize: '1rem', fontWeight: '600'}}> {a(brand._id)} <span style={{ fontSize: "0.8rem", fontWeight: '400'}}>бүтээгдэхүүн</span></span>
                        </div>

                    </div>
                ))}
            </div>
            <Footer/>
        </React.Fragment>
    );
}

export default Brandpage;
