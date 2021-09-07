import React, {Component} from 'react';
import Header from "./include/Header";
import Footer from './include/Footer'
import {getProduct} from "../actions/product_actions";
import {connect} from "react-redux";
import ActivityContainer from "./include/ActivityContainer";
import Cards from './Card/Cards.js'

const reducer = ({product}) => ({product});

class MenWomen extends Component {
    constructor(props) {
        super(props);
        console.log("Const" ,props)
    }

    render() {
        // let {product: {cards}} = this.props
        // const datas = Object.values(cards)
        let datas = localStorage.getItem('productLocal')
        datas = JSON.parse(datas)
        return (
            <React.Fragment>
                <Header
                    location={this.props.location}
                    history={this.props.history}
                />
                <ActivityContainer loading={false}>
                    <Cards voucher={datas.filter((d) => d.category._id === this.props.match.params.cate)}/>
                </ActivityContainer>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default connect(reducer, {getProduct})(MenWomen);
