import React, {Fragment} from 'react';
import {Button, Form, Input, Icon, Row, message} from 'antd';
import { Link } from 'react-router-dom';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    };


    render() {

        return (
            <div style={{textAlign: 'center'}}>
                <h1 style={{fontWeight: 700,fontSize: '10rem',color: 'red', marginTop: 80, marginBottom: 10}}>4<Icon type="stop" />4</h1>
                <p style={{display: 'block',margin: 'auto',width: 400, marginBottom: 20}}>
                    <strong style={{fontSize: '1.2rem',color: '#263238',display: 'block'}}>Уучлаарай, таны хайсан хуудас олдсонгүй</strong>
                </p>
                <Link to={'/dashboard'}>
                    <Button type="primary">Хянах самбар</Button>
                </Link>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    }
}

export default NotFound