import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import {
    mdiFacebook,
    mdiInstagram,
    mdiMapMarker,
    mdiYoutube,
    mdiPhone,
    mdiEmail,
    mdiChevronLeft,
    mdiChevronRight
} from '@mdi/js';
import Icon from "@mdi/react";

const reducer = ({main}) => ({main});

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {main: {config}} = this.props;

        return (
            <React.Fragment>
                <div id="contact" className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 col-sm-4">
                                <div className="f1">
                                    <div className="footer-logo">
                                        <img src={config.logo}
                                             alt="surgaltuud.mn"/>
                                    </div>
                                    <div className="footer-social">
                                        <a href="http://www.facebook.com/" target="_blank">
                                            <Icon path={mdiFacebook}
                                                  size={1}
                                                  color="#fff"
                                            />
                                        </a>
                                        <a href="http://www.instagram.com/" target="_blank">
                                            <Icon path={mdiInstagram}
                                                  size={1}
                                                  color="#fff"
                                            />
                                        </a>
                                        <a href="http://www.youtube.com/" target="_blank">
                                            <Icon path={mdiYoutube}
                                                  size={1}
                                                  color="#fff"
                                            />
                                        </a>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4">
                                <div className="f1">
                                    <h2>Тусламж үйлчилгээ</h2>
                                    <ul className="footer-menu">
                                        <li className="menu-item">
                                            <Icon path={mdiChevronRight}
                                                  size={0.5}
                                                  color="#fff"
                                            />
                                            <Link to="/page/jlchilgeenij-nhcl">Үйлчилгээний нөхцөл</Link>
                                        </li>
                                        <li className="menu-item" style={{
                                            background: '#272343',
                                            padding: '5px 10px',
                                            marginLeft: -10,
                                            borderRadius: 3,
                                        }}>
                                            <Icon path={mdiChevronRight}
                                                  size={0.5}
                                                  color="#fff"
                                            />
                                            <Link to="/page/Surtalchilgaa-bajrshuulah">Сурталчилгаа байршуулах</Link>
                                        </li>
                                        <li className="menu-item" style={{
                                            background: '#272343',
                                            padding: '5px 10px',
                                            marginLeft: -10,
                                            borderRadius: 3,
                                        }}>
                                            <Icon path={mdiChevronRight}
                                                  size={0.5}
                                                  color="#fff"
                                            />
                                            <Link to={{pathname: "/register", state: {isCompany: true}}}>Сургалтын байгууллага нэмэх</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4">
                                <div className="f1">
                                    <h2>Холбоо барих</h2>
                                    <ul className="contact">
                                        <li>
                                            <Icon path={mdiMapMarker}
                                                  size={1}
                                                  color="#fff"
                                            />
                                            <h4>
                                                {config.address}
                                            </h4>
                                        </li>
                                        <li>
                                            <Icon path={mdiPhone}
                                                  size={1}
                                                  color="#fff"
                                            />
                                            <h4>
                                                {config.phone}
                                            </h4>
                                        </li>
                                        <li>
                                            <Icon path={mdiEmail}
                                                  size={1}
                                                  color="#fff"
                                            />
                                            <h4>
                                                <a href={`mailto:${config.email}`}>{config.email}</a>
                                            </h4>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <p style={{
                            color: '#fff',
                            // borderTop: '1px solid #84d422',
                            marginTop: 30,
                            paddingTop: 30,
                            marginBottom: -20,
                        }}>Сургалтын бүртгэл мэдээллийн нэгдсэн платформ, Бүх эрх зохиогчийн эрхээр хамгаалагдав 202<Link to={"/product"} style={{color: "white"}}>1</Link></p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(reducer)(Footer);
