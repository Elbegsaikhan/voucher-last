import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Button, Modal, Form } from "react-bootstrap";
import {
    changeValue,
    submitLogin,
    switchType,
    submitRegister,
    uploadImage,
    chagneType,
    getCates,
} from "../actions/auth_actions";
import Api from "../actions/api";
import config from "../config";
import Header from "./include/Header";
import Footer from "./include/Footer";

const reducer = ({ auth, main }) => ({ auth, main });

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: {
                passResetNoMatch: false,
                passResetNoValid: false,
                passReset: false,
                passResetRepeat: false,
            },
            terms: false,
            showReset: false,
            showResetForm: false,
            resetLoading: false,
            passResetLoading: false,
            email_reset: "",
            passReset: "",
            passResetRepeat: "",
            passResetUser: {},
            passResetToken: "",
        };
        this.dropzone = null;
    }

    componentDidMount() {
        const {
            main: { userReset, token, user },
            history,
        } = this.props;
        this.props.getCates();
        if (userReset) {
            this.setState(
                {
                    showResetForm: true,
                    showReset: true,
                    passResetUser: userReset,
                    passResetToken: token,
                },
                () => this.props.switchType("login")
            );
        }
        window.scrollTo(0, 0);
        if (user) {
            this.props.history.push('/')
        } else {
            if ((this.props.location || {}).pathname === "/register") {
                this.props.switchType("register");
                if (((this.props.location || {}).state || {}).isCompany) {
                    this.props.chagneType(true);
                }
            } else {
                this.props.switchType("login");
            }
        }
    }

    onChangeInput(e, value) {
        if (typeof e === "string" || e instanceof String) {
            this.props.changeValue({ [e]: value }, "login");
        } else {
            this.props.changeValue(
                { [e.target.name]: e.target.value },
                "login"
            );
        }
    }

    onChangeInputReg(e, value) {
        if (typeof e === "string" || e instanceof String) {
            this.props.changeValue({ [e]: value }, "register");
        } else {
            this.props.changeValue(
                { [e.target.name]: e.target.value },
                "register"
            );
        }
    }

    handleSubmit(e) {
        const {
            auth: { login },
        } = this.props;
        e.preventDefault();
        this.props.submitLogin(login);
    }

    async handleSubmitReset(e) {
        e.preventDefault();
        this.setState({ passResetLoading: true });
        let errors = {};
        let noErr = {};

        if (this.state.passReset == null || this.state.passReset === "") {
            errors.passReset = true;
            errors.passResetNoValid = false;
        } else {
            if (this.state.passReset.length < 6) {
                errors.passReset = true;
                errors.passResetNoValid = true;
            } else {
                noErr.passReset = false;
                noErr.passResetNoValid = false;
            }
        }
        if (
            this.state.passResetRepeat == null ||
            this.state.passResetRepeat === ""
        ) {
            errors.passwordRepeatRegister = true;
        } else {
            if (this.state.passReset === this.state.passResetRepeat) {
                noErr.passResetNoMatch = false;
                noErr.passResetRepeat = false;
            } else {
                errors.passResetNoMatch = true;
                errors.passResetRepeat = true;
            }
        }
        if (Object.keys(errors).length === 0 && errors.constructor === Object) {
            this.setState({ error: { ...this.state.error, ...noErr } });
            let data = {
                token: this.state.passResetToken,
                newPassword: this.state.passReset,
                newPasswordRepeat: this.state.passResetRepeat,
            };
            const response = await Api.login(
                `/api/reset/passwordSave/${this.state.passResetUser._id}`,
                data
            );
            if (response.success === true) {
                config
                    .get("emitter")
                    .emit("success", "Амжилттай солигдлоо, нэвтэрж орно уу");
                this.setState({
                    showReset: false,
                    showResetForm: false,
                    resetLoading: false,
                    passResetLoading: false,
                    email_reset: "",
                    passReset: "",
                    passResetRepeat: "",
                    passResetUser: {},
                    passResetToken: "",
                });
            } else {
                this.setState({ passResetLoading: false });
                config.get("emitter").emit("warning", response.message);
            }
        } else {
            this.setState({ passResetLoading: false });
            this.setState({
                error: { ...this.state.error, ...errors, ...noErr },
            });
        }
    }
    handleSubmitRegister(e) {
        const {
            auth: { register, isCompany },
        } = this.props;
        e.preventDefault();
        if (this.state.terms) {
            this.props.submitRegister({ isCompany, ...register });
        } else {
            config
                .get("emitter")
                .emit("warning", "Үйлчилгээний нөхцөл зөвшөөрөгүй байна");
        }
    }

    switchType(type) {
        this.props.history.push(`/${type}`);
    }
    changeType(isCompany) {
        this.props.chagneType(isCompany);
    }
    async ResetSubmit(event) {
        event.preventDefault();
        this.setState({ resetLoading: true });
        var cc = {
            email: this.state.email_reset,
        };
        if (this.state.email_reset == null || this.state.email_reset === "") {
            config.get("emitter").emit("warning", "Имэйл хаяг оруулна уу");
            this.setState({ resetLoading: false });
        } else {
            const response = await Api.login(`/api/password/reset`, cc);
            if (response.success === true) {
                this.setState({ resetLoading: false });
                config.get("emitter").emit("success", response.message);
            } else {
                this.setState({ resetLoading: false });
                config.get("emitter").emit("warning", response.message);
            }
        }
    }

    render() {
        const {
            main: { config },
            auth: {
                isRegister,
                login,
                register,
                imageLoading,
                isCompany,
                cates,
                location,
            },
        } = this.props;
        login.link = this.props.match.params.id;
        return (
            <React.Fragment>
                <Header
                    location={this.props.location}
                    history={this.props.history}
                />
                <div
                    className="page-header"
                    style={{
                        backgroundImage: `url("${
                            isRegister ? config.homeImage : config.background
                        }")`,
                    }}
                >
                    <div className="overlay"></div>
                    <div className="header-text">
                        <div className="container">
                            <h2 className="h2">
                                {isRegister ? "Бүртгүүлэх" : "Нэвтрэх"}
                            </h2>
                        </div>
                    </div>
                </div>
                <Container>
                    {isRegister ? (
                        <div>
                            <div style={{ textAlign: "center", marginTop: 40 }}>
                                <span
                                    onClick={() => this.changeType(false)}
                                    className={`type-reg ${
                                        isCompany ? "" : "active"
                                    }`}
                                >
                                    Хувь хүн
                                </span>
                                <span
                                  onClick={() => this.changeType(true)}
                                  className={`type-reg ${isCompany ? "active" : ""}`}
                                >
                                  Байгууллага
                                </span>
                            </div>
                            <div
                                style={{
                                    maxWidth: 380,
                                    with: "100%",
                                    margin: "100px auto",
                                }}
                            >
                                <div className="auth register">
                                    <Form
                                        onSubmit={(e) =>
                                            this.handleSubmitRegister(e)
                                        }
                                    >
                                        <div className="form-auth">
                                            <Form.Group>
                                                <Form.Label>
                                                    Имэйл хаяг{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </span>
                                                    :{" "}
                                                </Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={register.email}
                                                    onChange={(e) =>
                                                        this.onChangeInputReg(e)
                                                    }
                                                    maxlength="255"
                                                />
                                            </Form.Group>
                                            {isCompany ? (
                                                <React.Fragment>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            Байгууллагн нэр{" "}
                                                            <span
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            >
                                                                *
                                                            </span>
                                                            :{" "}
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="name"
                                                            value={
                                                                register.name
                                                            }
                                                            onChange={(e) =>
                                                                this.onChangeInputReg(
                                                                    e
                                                                )
                                                            }
                                                            maxlength="255"
                                                        />
                                                    </Form.Group>
                                                </React.Fragment>
                                            ) : null}
                                            <Form.Group>
                                                <Form.Label>
                                                    Утасны дугаар{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </span>
                                                    :{" "}
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="phone"
                                                    value={register.phone}
                                                    onChange={(e) =>
                                                        this.onChangeInputReg(e)
                                                    }
                                                    maxlength="255"
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>
                                                    Нууц үг{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </span>
                                                    :{" "}
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder="************"
                                                    value={register.password}
                                                    onChange={(e) =>
                                                        this.onChangeInputReg(e)
                                                    }
                                                    maxlength="255"
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>
                                                    Нууц үг давтах{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </span>
                                                    :{" "}
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="passwordRepeat"
                                                    placeholder="************"
                                                    value={
                                                        register.passwordRepeat
                                                    }
                                                    onChange={(e) =>
                                                        this.onChangeInputReg(e)
                                                    }
                                                    maxlength="255"
                                                />
                                            </Form.Group>
                                        </div>
                                        <Form.Group className="reg-check">
                                            <Form.Check
                                                checked={this.state.terms}
                                                onChange={() =>
                                                    this.setState({
                                                        terms: !this.state
                                                            .terms,
                                                    })
                                                }
                                                type="checkbox"
                                                label={
                                                    <span
                                                        onClick={() =>
                                                            this.setState({
                                                                terms: !this
                                                                    .state
                                                                    .terms,
                                                            })
                                                        }
                                                    >
                                                        Үйлчигээний нөхцөлийг
                                                        зөвшөөрч байна{" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                            />
                                            <small
                                                id="emailHelp"
                                                style={{ marginBottom: 15 }}
                                                className="form-text text-muted"
                                            >
                                                Та бүртгүүлэх товчийг дарсанаар
                                                манай{" "}
                                                <span
                                                    style={{
                                                        color: "#1a1aa2",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        this.setState({
                                                            showModal: true,
                                                        })
                                                    }
                                                >
                                                    үйлчилгээний нөхцөл
                                                </span>{" "}
                                                - ийг хүлээн зөвшөөрсөнд тооцно.
                                            </small>
                                        </Form.Group>
                                        <Button
                                            type="submit"
                                            onClick={(e) =>
                                                this.handleSubmitRegister(e)
                                            }
                                            className="auth-button-first"
                                            style={{ marginTop: 30 }}
                                        >
                                            Бүртгүүлэх
                                        </Button>
                                    </Form>
                                    <span className="or">Эсвэл</span>
                                    <Button
                                        onClick={() => this.switchType("login")}
                                        className="auth-button-second"
                                    >
                                        Нэвтрэх
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                maxWidth: 280,
                                with: "100%",
                                margin: "100px auto",
                            }}
                        >
                            <div className="auth login">
                                <Form onSubmit={(e) => this.handleSubmit(e)}>
                                    <div className="form-auth">
                                        <Form.Group>
                                            <Form.Label>
                                                Имэйл хаяг:{" "}
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="info@example.com"
                                                value={login.email}
                                                onChange={(e) =>
                                                    this.onChangeInput(e)
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Нууц үг: </Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder="************"
                                                value={login.password}
                                                onChange={(e) =>
                                                    this.onChangeInput(e)
                                                }
                                            />
                                            {/*<input type="hidden" name="link" value={login.link} />*/}
                                        </Form.Group>
                                        <Form.Group>
                                            {/*<Form.Label>Нууц үг: </Form.Label>*/}
                                            <Form.Control
                                                hidden={true}
                                                type="text"
                                                name="link"
                                                // placeholder="************"
                                                value={login.link}
                                                onChange={(e) =>
                                                    this.onChangeInput(e)
                                                }
                                            />
                                        </Form.Group>
                                        {/*    <input type="hidden" name="link" value={login.link} />*/}
                                    </div>
                                    <span
                                        className="forgot"
                                        onClick={() =>
                                            this.setState({
                                                showReset: true,
                                                email_reset: "",
                                            })
                                        }
                                    >
                                        Нууц үгээ мартсан ?
                                    </span>
                                    <Button
                                        type="submit"
                                        onClick={(e) => this.handleSubmit(e)}
                                        className="auth-button-first"
                                    >
                                        Нэвтрэх
                                    </Button>
                                </Form>
                                <span className="or">Эсвэл</span>
                                <Button
                                    onClick={() => this.switchType("register")}
                                    className="auth-button-second"
                                >
                                    Бүртгүүлэх
                                </Button>
                            </div>
                        </div>
                    )}
                </Container>

                <Modal
                    size="sm"
                    className="loginModal"
                    show={this.state.showReset}
                    onHide={() =>
                        this.setState({ showReset: false, email_reset: "" })
                    }
                >
                    <h4
                        style={{
                            marginBottom: 15,
                            borderBottom: "1px solid #ccc",
                            paddingBottom: 15,
                        }}
                    >
                        Нууц үг сэргээх
                    </h4>
                    {this.state.showResetForm ? (
                        <Form onSubmit={this.handleSubmitReset.bind(this)}>
                            <Form.Group>
                                <Form.Group>
                                    <Form.Label>Нууц үг *</Form.Label>
                                    <Form.Control
                                        hidden={true}
                                        type="password"
                                        placeholder="*************"
                                        value={this.state.passReset}
                                        isInvalid={!!this.state.error.passReset}
                                    />
                                    <Form.Control
                                        hidden={false}
                                        type="password"
                                        placeholder="*************"
                                        value={this.state.passReset}
                                        isInvalid={!!this.state.error.passReset}
                                        onChange={(e) =>
                                            this.setState({
                                                passReset: e.target.value,
                                            })
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.error.passResetNoValid
                                            ? "Нууц үг хангалтгүй байна (6-аас дээш урттай байх)"
                                            : "Нууц үг оруулна уу."}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Нууц үг давтах *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        onChange={(e) =>
                                            this.setState({
                                                passResetRepeat: e.target.value,
                                            })
                                        }
                                        placeholder="*************"
                                        value={this.state.passResetRepeat}
                                        isInvalid={
                                            !!this.state.error.passResetRepeat
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.error.passResetNoMatch
                                            ? "Нууц үг зөрж байна"
                                            : "Нууц үг давтах оруулна уу."}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Group>
                            <div className="text-center">
                                <Button
                                    style={{
                                        position: "relative",
                                        paddingLeft: this.state.passResetLoading
                                            ? 35
                                            : 20,
                                    }}
                                    disabled={this.state.passResetLoading}
                                    type="submit"
                                    className="btn btn-btn btn-submit"
                                >
                                    {this.state.passResetLoading ? (
                                        <img
                                            src="/images/sync-outline.svg"
                                            className="spinner"
                                        />
                                    ) : null}
                                    Солих
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <Form onSubmit={this.ResetSubmit.bind(this)}>
                            <Form.Group>
                                <Form.Label>Имэйл хаяг</Form.Label>
                                <Form.Control
                                    onChange={(e) =>
                                        this.setState({
                                            email_reset: e.target.value,
                                        })
                                    }
                                    value={this.state.email_reset}
                                />
                            </Form.Group>
                            <div className="text-center">
                                <Button
                                    style={{
                                        position: "relative",
                                        paddingLeft: this.state.resetLoading
                                            ? 35
                                            : 20,
                                    }}
                                    disabled={this.state.resetLoading}
                                    type="submit"
                                    className="btn btn-btn btn-submit"
                                >
                                    {this.state.resetLoading ? (
                                        <img
                                            src="/images/sync-outline.svg"
                                            className="spinner"
                                        />
                                    ) : null}
                                    Илгээх
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal>
                <Footer />
            </React.Fragment>
        );
    }
}
export default connect(reducer, {
    changeValue,
    submitLogin,
    switchType,
    submitRegister,
    getCates,
    uploadImage,
    chagneType,
})(Home);
