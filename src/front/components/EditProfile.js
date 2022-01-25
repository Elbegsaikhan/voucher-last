import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { getRequests, setUser } from "../actions/profile_actions";
import Api from "../actions/api";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import config from "../config";
import Header from "./include/Header";
import Footer from "./include/Footer";

const reducer = ({ profile, main }) => ({ profile, main });

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: {
                password: false,
                newPassword: false,
                newPasswordRepeat: false,

                email: false,
                phone: false,
                birthday: false,
                first_name: false,
                last_name: false,
            },
            password: "",
            newPassword: "",
            newPasswordRepeat: "",

            email: "",
            phone: "",
            first_name: "",
            last_name: "",
            company: "",
            profession: "",
            birthday: "",
            more: "",

            submitLoading: false,
            passLoading: false,
        };
    }

    componentDidMount() {
        const {
            main: { user },
        } = this.props;
        window.scrollTo(0, 0);
        if (user && user._id) {
            window.scroll(0, 0);
            this.setState({
                email: user.email || "",
                phone: user.phone || "",
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                company: user.company || "",
                profession: user.profession || "",
                birthday: user.birthday || "",
                more: user.more || "",
            });
        } else {
            this.props.history.push("/");
        }
    }

    changePhone(e) {
        if (isNaN(e.target.value)) {
            this.setState({ phone: "" });
        } else {
            this.setState({ phone: parseInt(e.target.value, 10) });
        }
    }

    changeBday(e) {
        if (isNaN(e.target.value)) {
            this.setState({ birthday: "" });
        } else {
            this.setState({ birthday: parseInt(e.target.value, 10) });
        }
    }

    async handleSubmit(e) {
        const {
            main: { user },
        } = this.props;
        e.preventDefault();
        this.setState({ submitLoading: true });
        let errors = {};
        let noErr = {};
        if (this.state.email == null || this.state.email === "") {
            errors.email = true;
        } else {
            noErr.email = false;
        }
        if (this.state.first_name == null || this.state.first_name === "") {
            errors.first_name = true;
        } else {
            noErr.first_name = false;
        }
        if (this.state.last_name == null || this.state.last_name === "") {
            errors.last_name = true;
        } else {
            noErr.last_name = false;
        }
        if (
            this.state.birthday.toString() != null &&
            this.state.birthday.toString() !== "" &&
            !isNaN(this.state.birthday)
        ) {
            if (this.state.birthday.toString().length === 4) {
                noErr.birthday = false;
            } else {
                errors.birthday = true;
            }
        } else {
            errors.birthday = true;
        }
        if (this.state.phone.toString() != null && this.state.phone.toString() !== "" && !isNaN(this.state.phone)) {
            if (this.state.phone.toString().length === 8) {
                noErr.phone = false;
            } else {
                errors.phone = true;
            }
        } else {
            errors.phone = true;
        }
        if (Object.keys(errors).length === 0 && errors.constructor === Object) {
            this.setState({ error: { ...this.state.error, ...noErr } });
            let data = {
                email: this.state.email,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                birthday: this.state.birthday,
                company: this.state.company,
                profession: this.state.profession,
                more: this.state.more,
                phone: this.state.phone,
            };
            const response = await Api.login(`/api/change/info/${user._id}`, data);
            if (response.success === true) {
                config.get("emitter").emit("success", response.msg);
                this.setState({ submitLoading: false });
                this.props.setUser(response.user);
            } else {
                this.setState({ submitLoading: false });
                config.get("emitter").emit("warning", response.msg);
            }
        } else {
            this.setState({ submitLoading: false });
            this.setState({ error: { ...this.state.error, ...errors, ...noErr } });
        }
    }

    async handlePass(e) {
        const {
            main: { user },
        } = this.props;
        e.preventDefault();
        this.setState({ passLoading: true });
        let errors = {};
        let noErr = {};
        if (this.state.password == null || this.state.password === "") {
            errors.password = true;
        } else {
            noErr.password = false;
        }
        if (this.state.newPassword == null || this.state.newPassword === "") {
            errors.newPassword = true;
            errors.passwordNoValid = false;
        }
        if (this.state.newPasswordRepeat == null || this.state.newPasswordRepeat === "") {
            errors.newPasswordRepeat = true;
        } else {
            if (this.state.newPassword === this.state.newPasswordRepeat) {
                noErr.passwordNoMatch = false;
                noErr.newPasswordRepeat = false;
            } else {
                errors.passwordNoMatch = true;
                errors.newPasswordRepeat = true;
            }
        }
        if (Object.keys(errors).length === 0 && errors.constructor === Object) {
            this.setState({ error: { ...this.state.error, ...noErr } });
            let data = {
                password: this.state.password,
                newPassword: this.state.newPassword,
                newPasswordRepeat: this.state.newPasswordRepeat,
            };
            const response = await Api.login(`/api/change/pass/${user._id}`, data);
            if (response.success === true) {
                config.get("emitter").emit("success", response.msg);
                this.setState({ passLoading: false });
            } else {
                this.setState({ passLoading: false });
                config.get("emitter").emit("warning", response.msg);
            }
        } else {
            this.setState({ passLoading: false });
            this.setState({ error: { ...this.state.error, ...errors, ...noErr } });
        }
    }

    render() {
        const {
            main: { user, config },
        } = this.props;
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
                                                    <Link to={`/profile`}>
                                                        <Icon path={mdiChevronRight} size={0.7} color="#fe8005" />
                                                        <span>Миний худалдан авалтууд</span>
                                                    </Link>
                                                </li>
                                                <li className={"cate-item"}>
                                                    <Link to={`/profile/main`} className="active">
                                                        <Icon path={mdiChevronRight} size={0.7} color="#fe8005" />
                                                        <span>Бүртгэлийн мэдээл</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={9}>
                                <div className="requests" style={{ marginBottom: 60 }}>
                                    <h4 className="green-title">Бүртгэлийн мэдээлэл</h4>
                                    <div>
                                        <Form onSubmit={this.handleSubmit.bind(this)}>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Нэр *</Form.Label>
                                                        <Form.Control
                                                            onChange={(e) => this.setState({ first_name: e.target.value })}
                                                            value={this.state.first_name}
                                                            isInvalid={!!this.state.error.first_name}
                                                        />
                                                        <Form.Control.Feedback type="invalid">Нэр оруулна уу.</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Овог *</Form.Label>
                                                        <Form.Control
                                                            onChange={(e) => this.setState({ last_name: e.target.value })}
                                                            value={this.state.last_name}
                                                            isInvalid={!!this.state.error.last_name}
                                                        />
                                                        <Form.Control.Feedback type="invalid">Овог оруулна уу.</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label>Имэйл *</Form.Label>
                                                        <Form.Control
                                                            onChange={(e) => this.setState({ email: e.target.value })}
                                                            value={this.state.email}
                                                            isInvalid={!!this.state.error.email}
                                                        />
                                                        <Form.Control.Feedback type="invalid">Имэйл хаяг оруулна уу.</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label>Утасны дугаар</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                                                            onChange={(e) => this.changePhone(e)}
                                                            value={this.state.phone}
                                                            isInvalid={!!this.state.error.phone}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            Утасны бугаар буруу байна уу (8 оронтой).
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label>Төрсөн он</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                                                            onChange={(e) => this.changeBday(e)}
                                                            value={this.state.birthday}
                                                            isInvalid={!!this.state.error.birthday}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            Төрсөн он буруу байна уу (4 оронтой).
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Албан байгууллага</Form.Label>
                                                        <span
                                                            style={{
                                                                display: "block",
                                                                fontSize: 12,
                                                                color: "#ccc",
                                                                marginBottom: 5,
                                                                marginTop: -8,
                                                            }}
                                                        >
                                                            Хувь хүн бол хувь хүн гэж бичих
                                                        </span>
                                                        <Form.Control
                                                            onChange={(e) => this.setState({ company: e.target.value })}
                                                            value={this.state.company}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Албан тушаал</Form.Label>
                                                        <span
                                                            style={{
                                                                display: "block",
                                                                fontSize: 12,
                                                                color: "#ccc",
                                                                marginBottom: 5,
                                                                marginTop: -8,
                                                            }}
                                                        >
                                                            Хувь хүн бол хувь хүн гэж бичих
                                                        </span>
                                                        <Form.Control
                                                            onChange={(e) => this.setState({ profession: e.target.value })}
                                                            value={this.state.profession}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Group>
                                                        <Form.Label>Тэмдэглэл хэсэг</Form.Label>
                                                        <span
                                                            style={{
                                                                display: "block",
                                                                fontSize: 12,
                                                                color: "green",
                                                                marginBottom: 5,
                                                                marginTop: -8,
                                                            }}
                                                        >

                                                        </span>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={4}
                                                            style={{ width: "100%" }}
                                                            onChange={(e) => this.setState({ more: e.target.value })}
                                                            value={this.state.more}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <div style={{ textAlign: "right" }}>
                                                <Button type="submit">Хадгалах</Button>
                                            </div>
                                        </Form>
                                        <h4 style={{ marginTop: 40 }}>Нууц үг солих</h4>
                                        <Form onSubmit={this.handlePass.bind(this)}>
                                            <Row>
                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label>Хуучин нууц үг</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            onChange={(e) => this.setState({ password: e.target.value })}
                                                            placeholder="*************"
                                                            value={this.state.password}
                                                            isInvalid={!!this.state.error.password}
                                                        />
                                                        <Form.Control.Feedback type="invalid">Нууц үг оруулна уу.</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label>Шинэ нууц үг</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            onChange={(e) => this.setState({ newPassword: e.target.value })}
                                                            placeholder="*************"
                                                            value={this.state.newPassword}
                                                            isInvalid={!!this.state.error.newPassword}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {this.state.error.newPassword ? "Нууц үг зөрж байна" : "Нууц үг давтах оруулна уу."}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label>Шинэ нууц үг давтах</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            onChange={(e) => this.setState({ newPasswordRepeat: e.target.value })}
                                                            placeholder="*************"
                                                            value={this.state.newPasswordRepeat}
                                                            isInvalid={!!this.state.error.newPasswordRepeat}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {this.state.error.passwordNoMatch ? "Нууц үг зөрж байна" : "Нууц үг давтах оруулна уу."}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <div style={{ textAlign: "right" }}>
                                                <Button type="submit">Хадгалах</Button>
                                            </div>
                                        </Form>
                                    </div>
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
export default connect(reducer, { getRequests, setUser })(EditProfile);
