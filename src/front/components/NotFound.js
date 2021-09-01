import React, {Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from "./include/Header";
import Footer from "./include/Footer";

const reducer = ({ main }) => ({ main });

class NotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        document.body.classList.add('error-page');
    }

    componentWillUnmount() {
        document.body.classList.remove('error-page');
    }

    render() {
        return (
            <Fragment>
                <Header location={this.props.location} history={this.props.history}/>
                <div className="container-fluid error">
                    <div>
                        <div className="text-center">
                            <Link className="logo" to="/">
                                <img width={160} id="single-logo" className="img-responsive"
                                     src="/frontAssets/img/logo-progrid.png" alt="logo"/>
                            </Link>
                            <div className="big-404">404</div>
                            <h3>oops ! ... Page not found</h3>
                            <p>Уучлаарай таны орсон линк идвэхгүй байна.</p>
                            <Link className="custom-button" to="/"><span data-hover="take me home">Нүүр хуудасруу буцах</span></Link>
                        </div>
                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}
export default connect(reducer)(NotFound)