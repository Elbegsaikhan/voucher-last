import React, {Component} from "react";
import {Link} from "react-router-dom";

export class GiftCard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="example-wrapper">
                <div className="gift-card">
                    <Link to={`/checkout/${this.props.item._id}`} style={{textDecoration: "none"}}>
                        <div
                            className="gift-card__image"
                            style={{
                                backgroundImage: `url(${this.props.item.image})`,
                            }}
                        >
                        </div>
                    </Link>
                </div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <h3> {this.props.item.title} </h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <h4> Үнэ {this.props.item.minprice}</h4>
                </div>
            </div>
        );
    }
}

export default GiftCard;
