import React, { Component } from "react";
import { connect } from "react-redux";
import config from "../../config";
import { toastr } from "react-redux-toastr";

import HeaderSecond from "./HeaderSecond";
import {openLogin, closeLogin, changeValue, submitLogin, switchType, submitRegister} from "../../actions/auth_actions";

const reducer = ({ main, auth }) => ({ main, auth });

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }

  componentDidMount() {
    let self = this;
    this.onErrorField = config
      .get("emitter")
      .addListener("error", function (title, text) {
        window.setTimeout(function () {
          toastr.warning("", text);
        }, 100);
      });
    this.onSuccessField = config
      .get("emitter")
      .addListener("success", function (title, text) {
        window.setTimeout(function () {
          toastr.success("", text);
        }, 100);
      });
    this.NotFound = config.get("emitter").addListener("404", function () {
      self.props.history.push("/404");
    });
    config.get("emitter").addListener("login", function () {
      self.openLogin();
    });
  }

  componentWillUnmount() {
    this.onErrorField.remove();
    this.onSuccessField.remove();
    this.NotFound.remove();
  }

  render() {
    const {
      main: { user, services, servicesCategories, config },
      location,
      auth: { isRegister, modal, login, register },
    } = this.props;
    // let url = (location.pathname || '').split("/").filter(v => v);
    return (
      <div>
        <HeaderSecond config={config} user={user} scroll={this.props.scroll} search={this.props.search} />
      </div>
    );
  }
}
export default connect(reducer, {
  openLogin,
  closeLogin,
  changeValue,
  submitLogin,
  switchType,
  submitRegister,
})(Header);
