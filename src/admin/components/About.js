import React from 'react';
import {Icon, Upload, Button, Input, Row, Form, Col, Card, Divider} from 'antd';
import {connect} from 'react-redux';
import * as action from '../actions/config_actions';

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            uploadLoading: false,
        }
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(action.getAbout());
    };

    changeHandler(e,value){
        const {dispatch} = this.props;
        if (value && ( typeof value === 'number' || typeof value === 'string' || e instanceof String)) {
            dispatch(action.changeHandler({name:e,value:value}))
        } else {
            dispatch(action.changeHandler({name:e.target.name,value:e.target.value}));
        }
    }

    onSave(){
        const {dispatch, about} = this.props;
        dispatch(action.saveAbout(about));
    }

    handleChange = (info) => {
        const {dispatch} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            dispatch(action.changeHandler({name: 'logo', value: info.file.response.result}));
            dispatch(action.changeHandler({name: 'newLogo', value: true}))
        }
        if (info.file.status === 'error') {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    handleChangeLogo1 = (info) => {
        const {dispatch} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            dispatch(action.changeHandler({name: 'logo1', value: info.file.response.result}));
            dispatch(action.changeHandler({name: 'newLogo1', value: true}))
        }
        if (info.file.status === 'error') {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    handleChangeBg = (info) => {
        const {dispatch} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            dispatch(action.changeHandler({name: 'background', value: info.file.response.result}));
            dispatch(action.changeHandler({name: 'newBackground', value: true}))
        }
        if (info.file.status === 'error') {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    handleChangeHomeImage = (info) => {
        const {dispatch} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            dispatch(action.changeHandler({name: 'homeImage', value: info.file.response.result}));
            dispatch(action.changeHandler({name: 'newHomeImage', value: true}))
        }
        if (info.file.status === 'error') {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    handleChangeHomeBanner1 = (info) => {
        const {dispatch} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            dispatch(action.changeHandler({name: 'homeBanner1', value: info.file.response.result}));
            dispatch(action.changeHandler({name: 'newHomeBanner1', value: true}))
        }
        if (info.file.status === 'error') {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };


    handleChangeHomeBanner2 = (info) => {
        const {dispatch} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            dispatch(action.changeHandler({name: 'homeBanner2', value: info.file.response.result}));
            dispatch(action.changeHandler({name: 'newHomeBanner2', value: true}))
        }
        if (info.file.status === 'error') {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    render() {
        const {about, confirmLoading} = this.props;
        const uploadButton = (
            <div>
                <Icon type={this.state.uploadLoading ? 'loading' : 'inbox'} />
                <p className="ant-upload-text">Зураг</p>
            </div>
        );
        return (
            <Card className="full-card" title='About' bordered={false}>
                <Row gutter={30} type="flex" justify="center">
                    <Col span={12}>
                        <Form.Item
                            label="Гарчиг"
                        >
                            <Input name="title" value={about.title} onChange={this.changeHandler.bind(this)}/>
                        </Form.Item>
                        <Form.Item
                            label="Тайлбар"
                        >
                            <Input name="description" value={about.description} onChange={this.changeHandler.bind(this)}/>
                        </Form.Item>
                        <Form.Item
                            label="Цагаан лого"
                        >
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                multiple={false}
                                action="/dashboard/api/upload"
                                onChange={::this.handleChange}
                            >
                                {
                                    about.logo ?
                                        <img width={110} src={about.logo} alt="image"/>
                                        : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Өнгөтэй лого"
                        >
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                multiple={false}
                                action="/dashboard/api/upload"
                                onChange={::this.handleChangeLogo1}
                            >
                                {
                                    about.logo1 ?
                                        <img width={110} src={about.logo1} alt="image"/>
                                        : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Нүүр хуудасны толгой зураг"
                        >
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                multiple={false}
                                action="/dashboard/api/upload"
                                onChange={::this.handleChangeBg}
                            >
                                {
                                    about.background ?
                                        <img width={110} src={about.background} alt="image"/>
                                        : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Бусад хуудасны толгой зураг"
                        >
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                multiple={false}
                                action="/dashboard/api/upload"
                                onChange={::this.handleChangeHomeImage}
                            >
                                {
                                    about.homeImage ?
                                        <img width={110} src={about.homeImage} alt="image"/>
                                        : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Суртчилгаа"
                        >
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                multiple={false}
                                action="/dashboard/api/upload"
                                onChange={::this.handleChangeHomeBanner1}
                            >
                                {
                                    about.homeBanner1 ?
                                        <img width={110} src={about.homeBanner1} alt="image"/>
                                        : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Баннер"
                        >
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                multiple={false}
                                action="/dashboard/api/upload"
                                onChange={::this.handleChangeHomeBanner2}
                            >
                                {
                                    about.homeBanner2 ?
                                        <img width={110} src={about.homeBanner2} alt="image"/>
                                        : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Утас"
                        >
                            <Input name="phone" value={about.phone} onChange={this.changeHandler.bind(this)}/>
                        </Form.Item>
                        <Form.Item
                            label="Имэйл"
                        >
                            <Input name="email" value={about.email} onChange={this.changeHandler.bind(this)}/>
                        </Form.Item>
                        <Form.Item
                            label="Хаяг байршил"
                        >
                            <Input name="address" value={about.address} onChange={this.changeHandler.bind(this)}/>
                        </Form.Item>
                        <Form.Item
                            label="Хөлний текст"
                        >
                            <Input name="footerText" value={about.footerText} onChange={this.changeHandler.bind(this)}/>
                        </Form.Item>
                        <Form.Item
                            label="Facebook link"
                        >
                            <Input name="facebook" value={about.facebook} onChange={this.changeHandler.bind(this)}/>
                        </Form.Item>
                        <Form.Item
                            label="Instagram link"
                        >
                            <Input name="instagram" value={about.instagram} onChange={this.changeHandler.bind(this)}/>
                        </Form.Item>
                        <Form.Item
                            label="Youtube link"
                        >
                            <Input name="youtube" value={about.youtube} onChange={this.changeHandler.bind(this)}/>
                        </Form.Item>
                    </Col>
                    <Divider/>
                    <Button loading={confirmLoading} type={'primary'} onClick={() => this.onSave()}>Хадгалах</Button>
                </Row>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        about: state.config.about,
        aboutLoading: state.config.aboutLoading,
        confirmLoading: state.config.confirmLoading
    }
}

export default connect(mapStateToProps)(About);
