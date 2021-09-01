import React, {Component} from "react";
import {Container, Row, Col} from "react-bootstrap";
import {isMobile} from "react-device-detect";
import {connect} from "react-redux";
import {getList, allList} from "../../actions/cates_actions.js";
import ActivityContainer from "../include/ActivityContainer.js";

const reducer = ({cates}) => ({cates});

class Category extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.allList();
    }

    render() {
        let {
            cates: {cates, loading},
        } = this.props;
        // console.log("Category.js ", cates)
        let arr = Object.values(cates);

        const rows = arr.reduce(function (rows, key, index) {
            const a = isMobile ? 3 : 5;
            return (
                (index % a === 0
                    ? rows.push([key])
                    : rows[rows.length - 1].push(key)) && rows
            );
        }, []);

        const onClick = (slug) => {

            this.props.show(slug)
        }
        return (
            <ActivityContainer loading={loading}>
                <Container fluid>
                    {
                        isMobile ? (
                            rows.map((r, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div onClick={() => onClick([r[0]._id, r[0].title])} style={{cursor: 'pointer'}}>
                                        <img
                                            src={r[0].image}
                                            width={"130px"}
                                            height={"150px"}
                                        />
                                    </div>
                                    <div onClick={() => onClick([r[1]._id, r[1].title])} style={{cursor: 'pointer'}}>
                                        <img
                                            src={r[1].image}
                                            width={"130px"}
                                            height={"150px"}
                                        />
                                    </div>
                                    <div onClick={() => onClick([r[2]._id, r[2].title])} style={{cursor: 'pointer'}}>
                                        <img
                                            src={r[2] && r[2].image}
                                            width={"130px"}
                                            height={"150px"}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (

                            rows.map((r, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div onClick={() => onClick([r[0]._id, r[0].title])} style={{cursor: 'pointer'}}>
                                        <img
                                            src={r[0].image}
                                            width={"253px"}
                                            height={"274px"}
                                        />
                                    </div>
                                    <div onClick={() => onClick([r[1]._id, r[1].title])} style={{cursor: 'pointer'}}>
                                        <img
                                            src={r[1].image}
                                            width={"253px"}
                                            height={"274px"}
                                        />
                                    </div>
                                    <div onClick={() => onClick([r[2]._id, r[2].title])} style={{cursor: 'pointer'}}>
                                        <img
                                            src={r[2].image}
                                            width={"253px"}
                                            height={"274px"}
                                        />
                                    </div>
                                    <div onClick={() => onClick([r[3]._id, r[3].title])} style={{cursor: 'pointer'}}>
                                        <img
                                            src={r[3].image}
                                            width={"253px"}
                                            height={"274px"}
                                        />
                                    </div>
                                    <div onClick={() => onClick([r[4]._id, r[4].title])} style={{cursor: 'pointer'}}>
                                        <img
                                            src={r[4].image}
                                            width={"253px"}
                                            height={"274px"}
                                        />
                                    </div>
                                </div>
                            ))

                        )
                    }

                </Container>
            </ActivityContainer>
        );
    }
}

export default connect(reducer, {allList})(Category);
