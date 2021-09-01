import React, { Component } from "react";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import config from "../config";
import ReactNotification, { store } from "react-notifications-component";
import AdsModal from "./include/AdsModal";
import WindowScroll from './WindowScroll'

const reducer = ({ main }) => ({ main });

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: 'true',
        }
        config.config({ history: this.props.history });
    }

    componentDidMount() {
        const optios = {
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 3000,
                onScreen: true,
                showIcon: true,
                pauseOnHover: true,
            },
            touchSlidingExit: {
                swipe: {
                    duration: 400,
                    timingFunction: "ease-out",
                    delay: 0,
                },
                fade: {
                    duration: 400,
                    timingFunction: "ease-out",
                    delay: 0,
                },
            },
            slidingExit: {
                duration: 400,
                timingFunction: "ease-out",
                delay: 0,
            },
            slidingEnter: {
                duration: 400,
                timingFunction: "ease-out",
                delay: 0,
            },
        };
        this.success = config
            .get("emitter")
            .addListener("success", function (text = "Амжилттай") {
                if (text != null && text !== "") {
                    store.addNotification({
                        ...optios,
                        message: text,
                        type: "default",
                    });
                }
            });
        this.error = config
            .get("emitter")
            .addListener("error", function (text = "Алдаа гарлаа") {
                if (text != null && text !== "") {
                    store.addNotification({
                        ...optios,
                        message: text,
                        type: "warning",
                    });
                }
            });
        this.warning = config
            .get("emitter")
            .addListener("warning", function (text = "Алдаа гарлаа") {
                if (text != null && text !== "") {
                    store.addNotification({
                        ...optios,
                        message: text,
                        type: "info",
                    });
                }
            });
        this.auth_error = config
            .get("emitter")
            .addListener("auth-error", function () {
                window.location.assign("/");
            });
        this.not_found = config
            .get("emitter")
            .addListener("not-found", function () {
                window.location.assign("/not-found");
            });

    }

    render() {
        const {
            route: { routes },
            main: { config },
        } = this.props;

        return (
            <React.Fragment>
                <ReactNotification />
                <AdsModal
                    showModal={this.state.showModal}
                    setShowModal={() => this.setState({ showModal: false})}
                    config = {config}
                />
                <WindowScroll />
                <main className="main-main">{renderRoutes(routes)}</main>
            </React.Fragment>
        );
    }
}

export default connect(reducer)(Main);
