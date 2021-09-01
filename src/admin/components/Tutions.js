import React from 'react';
import {
    InputNumber,
    Upload,
    Button,
    Table,
    Input,
    Row,
    Form,
    Col,
    Card,
    Drawer,
    DatePicker,
    Icon,
    Popconfirm, Select,
} from 'antd';
import {connect} from 'react-redux';
import * as action from '../actions/tutions_actions';
import moment from "moment";
import { ChromePicker } from 'react-color';
class Tutions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            displayColorPicker: false,
        };
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(action.getTutions(this.state.current));
    };

    onPaginate(data){
        const {dispatch} = this.props;
        this.setState({current : data.current - 1});
        dispatch(action.getTutions(data.current - 1));
    }

    changeHandler(e,value){
        const {dispatch} = this.props;
        if (value && ( typeof e === 'string' || e instanceof String)) {
            dispatch(action.changeHandler({name:e,value:value}))
        } else {
            dispatch(action.changeHandler({name:e.target.name,value:e.target.value}));
        }
    }

    changeHandlerNumber(name,value){
        const {dispatch} = this.props;
        if(isNaN(value)) {
            dispatch(action.changeHandler({name:name,value:0}))
        } else if(value < 0) {
            dispatch(action.changeHandler({name:name,value:0}))
        } else {
            dispatch(action.changeHandler({name:name,value:value}))
        }

    }

    changeHandlerDate(e,a) {
        const {dispatch} = this.props;
        dispatch(action.changeHandler({name: 'saleDate',value:e}));
    }

    handleChangeComplete(e) {
        const {dispatch} = this.props;
        dispatch(action.changeHandler({name: 'color',value:e.hex}));
    }

    removeImage(ind) {
        const {dispatch} = this.props;
        dispatch(action.removeImage(ind));
    }

    addImage(ind) {
        const {dispatch} = this.props;
        dispatch(action.addImage());
    }

    showModal(id){
        const {dispatch} = this.props;
        dispatch(action.modalTution(id));
    }

    onSave(){
        const {dispatch, item} = this.props;
        dispatch(action.saveTution(item));
    }

    onCancel(){
        const {dispatch} = this.props;
        dispatch(action.closeModalTution());
    }

    delete(id){
        const {dispatch} = this.props;
        dispatch(action.deleteTution(id));
    }

    handleChange = (index, info) => {
        const {dispatch} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            dispatch(action.changeHandler({name: 'image', value: info.file.response.result, index: index}));
        }
        if (info.file.status === 'error') {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    render() {
        const {all, items, loading, confirmLoading ,itemLoading, item, modal, groups} = this.props;
        let pagination = {
            total : all,
            current: this.state.current + 1,
            pageSize : 30,
            position: 'bottom'
        };
        const columns = [{
            title: '№',
            width: 60,
            key: 'index',
            render: (text, record, index) => (
                (this.state.current * 30) + index + 1
            )
        }, {
            title: 'Нэр',
            key: 'title',
            dataIndex: 'title'
        }, {
            title: 'Үйлдэл',
            width: 250,
            key: 'action',
            render: (text, record) => (
                <React.Fragment>
                    <Button onClick={this.showModal.bind(this, record._id)} size="small" type="default" icon="edit" disabled={itemLoading}>Засах</Button>
                    {
                        record.status != 'delete' ?
                        <Popconfirm title="Та устгахдаа итгэлтэй байна уу" onConfirm={this.delete.bind(this,record._id)} okText="Тийм" cancelText="Үгүй">
                            <Button style={{marginLeft: 15}} size="small" type="danger" icon="delete" disabled={itemLoading}>Устгах</Button>
                        </Popconfirm>
                        : null
                    }
                </React.Fragment>
            )
        }];
        const popover = {
            position: 'absolute',
            zIndex: '2',
        }
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }
        const uploadButton = (
            <div>
                <Icon type={this.state.uploadLoading ? 'loading' : 'inbox'} />
                <p className="ant-upload-text">Зураг</p>
            </div>
        );
        return (
            <Card className="full-card" title='Сургалтууд' bordered={false}
                extra={
                    [<Button icon="plus" onClick={this.showModal.bind(this, 0)}>Нэмэх</Button>]
                }
            >
                <Table
                    size="small"
                    bordered={false}
                    onChange={() => this.onPaginate()}
                    pagination={pagination}
                    rowKey={record => record._id}
                    columns={columns}
                    dataSource={items}
                    loading={loading}
                />
                <Drawer
                    title={item._id === 0 ? 'Нэмэх' : 'Засах'}
                    visible={modal}
                    closable={false}
                    maskClosable={false}
                    width={'70%'}
                >
                    <Row gutter={30}>
                        <Col span={6}>
                            <Form.Item
                                label="Гарчиг"
                                help="Сургалтын гарчиг"
                            >
                                <Input name="title" value={item.title} onChange={this.changeHandler.bind(this)}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Тайлбар"
                                help="Сургалтын тайлбар"
                            >
                                <Input name="description" value={item.description} onChange={this.changeHandler.bind(this)}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                                {groups && groups.length > 0 ?
                                    <Form.Item
                                        label='Бүлэг'
                                    >
                                        <Select style={{width: '100%'}} value={item.group ? item.group : ''} name='group' onChange={this.changeHandler.bind(this, 'group')}>
                                            <Select.Option value=''>Бүлэг сонгох</Select.Option>
                                            {groups.map( run =>
                                                <Select.Option value={run._id}>{run.title.title}</Select.Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                    :
                                    null
                                }
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Col span={4}>
                            <Form.Item
                                label="Үнэ"
                                help="Сургалтын үнэ"
                            >
                                <InputNumber style={{width: '100%'}} min={0} max={99999999}  name="price" value={item.price} onChange={this.changeHandlerNumber.bind(this, 'price')} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Хямдарсан үнэ"
                                help="Сайтад харагдах дараалал"
                            >
                                <InputNumber
                                    value={item.order}
                                    min={0}
                                    max={1000}
                                    style={{width: '100%'}}
                                    formatter={value => `№   ${value}`}
                                    onChange={this.changeHandlerNumber.bind(this, 'order')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Дараалал"
                                help="Хямдралгүй бол 0 оруулна уу"
                            >
                                <InputNumber style={{width: '100%'}} min={0} max={99999999}  name="sale" value={item.sale} onChange={this.changeHandlerNumber.bind(this, 'sale')} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Хямдралын дуусах хугацаа"
                                help="Хямдралгүй бол сонгох шаардлагагүй"
                            >

                                {
                                    (item.saleDate === '' || item.saleDate === null || item.saleDate === undefined)? (
                                        <DatePicker style={{width: '100%'}} value={''} onChange={this.changeHandlerDate.bind(this)} showTime/>
                                    ) : (
                                        <DatePicker showTime style={{width: '100%'}} value={moment.utc(item.saleDate)} onChange={this.changeHandlerDate.bind(this)}/>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Сургалтын арын өнгө"
                            >
                                <button style={{background: item.color || '#FDF8BC', padding: '0 20px', lineHeight: '28px', borderRadius: 5, border: '1px solid #bdbdbd'}} onClick={ this.handleClick }>Pick Color</button>
                                { this.state.displayColorPicker ? <div style={ popover }>
                                    <div style={ cover } onClick={this.handleClose.bind(this)}/>
                                    <ChromePicker
                                        color={ item.color }
                                        onChangeComplete={this.handleChangeComplete.bind(this)}
                                    />
                                </div> : null }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Зураг"
                        help="Сургалтын давуу тал, агууллага программ, хичээллэх өдөр цагийн сонголтууд, сургалтын танхимын зураг, сургалт орох багш, сургалтын төлбөр, сургалтын байгуудлагын байршил зэргийг багтаасан 8 хүртэлх зураг зураг оруулах боломжтой"
                    >
                        {
                            item.images.map((image, ins) => (
                                <div>
                                    <Upload
                                        name="image"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        multiple={false}
                                        action="/dashboard/api/upload/direct"
                                        onChange={this.handleChange.bind(this, ins)}
                                    >
                                        {
                                            image ?
                                                <img width={110} src={image} alt="image"/>
                                                : uploadButton}
                                    </Upload>
                                    <button style={{
                                        fontSize: 14,
                                        padding: '0 10px',
                                        lineHeight: '20px',
                                        margin: '0 auto',
                                        display: 'block',
                                        marginBottom: 30,
                                    }} onClick={() => this.removeImage(ins)}>Хасах</button>
                                </div>
                            ))
                        }
                        <div style={{textAlign: 'center'}}>
                            <Button onClick={() => this.addImage()}>Зураг нэмэх</Button>
                        </div>
                    </Form.Item>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e8e8e8',
                            padding: '10px 16px',
                            textAlign: 'right',
                            left: 0,
                            background: '#fff',
                            borderRadius: '0 0 4px 4px',
                        }}
                    >
                        <Button
                            style={{
                                marginRight: 8,
                            }}
                            onClick={() => this.onCancel()} disabled={confirmLoading}
                        >
                            Болих
                        </Button>
                        <Button onClick={() => this.onSave()} disabled={confirmLoading} loading={confirmLoading} type="primary">
                            Хадгалах
                        </Button>
                    </div>
                </Drawer>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.tutions.items,
        groups: state.tutions.groups,
        loading: state.tutions.loading,
        modal: state.tutions.modal,
        item: state.tutions.item,
        all: state.tutions.all,
        confirmLoading: state.tutions.confirmLoading,
        itemLoading: state.tutions.itemLoading
    }
}

export default connect(mapStateToProps)(Tutions);