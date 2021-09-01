import React, { Component } from "react";
import GiftSlide from "../Slide/GiftSlide";

export class Cards extends Component {
    render() {
        return (
            <div className="" style={{ marginTop: "0px" }}>
                <div
                    style={{
                        width: "100%",
                        backgroundColor: "#00FFEF",
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "30px",
                        height: "auto",
                        alignItems: "center",
                    }}
                >
                </div>
                <div>
                    <GiftSlide voucher={this.props.voucher} users={this.props.user} />
                </div>
            </div>
        );
    }
}

export default Cards;
