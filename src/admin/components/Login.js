import React, {Fragment} from 'react';
import {Button, Form, Input, Row, message} from 'antd';
import {connect} from 'react-redux';
import Api from '../actions/api'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.checkToken = this.checkToken.bind(this);
        this.loginEnter = this.loginEnter.bind(this);
    }

    componentDidMount() {
        this.checkToken();
    };

    async checkToken() {
        const response = await Api.checkToken(`/admin/check/token`);
        if(response.status === 200){
            window.location = "/dashboard";
        }
    };

    changeHandler(e) {
        if (e.target) {
            this.props.form.setFieldsValue({
                [e.target.name]: e.target.value,
            });
        }
    };

    loginEnter = async (e) => {
        if (e.keyCode === 13 || e.type === 'click') {
            const {form} = this.props;
            form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    this.login(values)
                }
            });
        }
    };

    login = async (data) => {
        console.log('...............');
        const response = await Api.login(`/admin/login`, data);
        if (response.success === true) {
            let d = new Date();
            d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = "token=" + response.token + ";" + expires + ";path=/";
            window.location = "/dashboard";
        } else {
            message.error(response.message);
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Fragment>
                <div className="login-container">
                    <div className="form___3Tq4m">
                        <div className="logo___3tfTW">
                            <img alt="logo" src='/images/logo.png'/>
                        </div>
                        <form>
                            <Form.Item hasFeedback>
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                        },
                                    ],
                                })(
                                    <Input
                                        type="email"
                                        onChange={::this.changeHandler}
                                        onPressEnter={::this.loginEnter}
                                        placeholder={`Username`}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item hasFeedback>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                        },
                                    ],
                                })(
                                    <Input
                                        type="password"
                                        onChange={::this.changeHandler}
                                        onPressEnter={::this.loginEnter}
                                        placeholder={`Password`}
                                    />
                                )}
                            </Form.Item>
                            <Row>
                                <Button
                                    type="primary"
                                    onClick={::this.loginEnter}
                                    loading={this.state.loading}
                                >
                                    Нэвтрэх
                                </Button>
                            </Row>
                        </form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.main.user
    }
}

export default connect(mapStateToProps)(Form.create()(Login))