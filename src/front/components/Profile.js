import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Button, Row, Col, Form, Table } from "react-bootstrap";
// import Accordion from "react-bootstrap/Accordion";
import { getWithdraw } from "../actions/withdraw_actions.js";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import Header from "./include/Header";
import Footer from "./include/Footer";

const reducer = ({ profile, main, withdraw }) => ({ profile, main, withdraw });

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    const {
      main: { user },
    } = this.props;
    const { products } = this.props;
    window.scrollTo(0, 0);
    this.props.getWithdraw(0);

  }

  render() {
    console.log("props profile ", this.props);
    const {
      main: { user, config },
      withdraw: { loading, items },
    } = this.props;
    const handleClose = () => this.setState({ show: !this.state.show });
    const handleShow = () => this.setState({ show: !this.state.show });
    console.log('Items ', items)
    return (
      <React.Fragment>
        <Header location={this.props.location} history={this.props.history} />
        <div className="page-header" style={{ backgroundImage: `url("${config.background}")` }}>
          <div className="overlay"></div>
          <div className="header-text">
            <div className="container">
              <h2 className="h2">Миний хуудас</h2>
            </div>
          </div>
        </div>
        <div style={{ minHeight: "calc(100vh - 500px)", marginTop: 60 }}>
          <Container>
            <Row>
              <Col md={3}>
                <div className="list-sidebar">
                  <div className="list-sidebar-items">
                    <div className="side-item">
                      <ul className="cate">
                        <li className={"cate-item"}>
                          <Link to={`/profile`} className="active">
                            <Icon path={mdiChevronRight} size={0.7} color="#fe8005" />
                            <span>Миний худалдан авалт</span>
                          </Link>
                        </li>
                        <li className={"cate-item"}>
                          <Link to={`/profile/main`}>
                            <Icon path={mdiChevronRight} size={0.7} color="#fe8005" />
                            <span>Бүртгэлийн мэдээлэл</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={9}>
                <div className="requests">
                  <h4 className="green-title">Худалдаж авсан бэлгийн карт</h4>
                  {/* <ul> */}
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Үнэ</th>
                        <th>Тайлбар</th>
                        <th>Төлбөр</th>
                        <th>Хүргэлт</th>
                        {/* <th>Хүргэлт</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {items && items.length > 0 ? (
                        items.map((item, index) => (
                          <tr>
                            <td>
                              <span>
                                <strong
                                  style={{
                                    marginRight: 10,
                                  }}
                                >
                                  {item.amount}
                                </strong>
                              </span>
                            </td>
                            <td>
                              <span >
                                {item.info}
                              </span>
                            </td>
                            <td>
                              <span className="req-right">
                                {item.status === "pending"
                                  ? "Төлбөр хүлээгдэж байна"
                                  : item.status === "active"
                                    ? "Төлбөр амжилттай төлөгдсөн"
                                    : ""}{" "}
                              </span>
                            </td>
                            <td>
                              <span >
                                {item.delivery === "hvleegdej"
                                  ? "Хүлээгдэж байгаа"
                                  : item.delivery === "hvrgej"
                                    ? "Хүргэхээр замдаа гарсан"
                                    : item.delivery === "hvrgsen"
                                      ? "Амжилттай хүргэгдсэн"
                                      : ""}
                              </span>
                            </td>
                          </tr>

                        ))
                      ) : (
                        <p>Одоогоор худалдан авалт хийгдээгүй байна.</p>
                      )}
                    </tbody>
                  </Table>
                  {/* </ul> */}
                </div>
              </Col>
            </Row>

          </Container>

        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default connect(reducer, { getWithdraw })(Profile);
