import React from 'react';
import {Icon, Upload, Button, Table, Input, Row, Form, Col, Card, Modal, InputNumber, Popconfirm, Select} from 'antd';
import {connect} from 'react-redux';
import * as action from '../actions/groupName_actions';

class GroupNames extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            uploadLoading: false,
        }
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(action.getGroupNames(this.state.current));
    };

    changeHandler(e,value){
        const {dispatch} = this.props;
        if (value && ( typeof value === 'number' || typeof value === 'string' || e instanceof String)) {
            dispatch(action.changeHandler({name:e,value:value}))
        } else {
            dispatch(action.changeHandler({name:e.target.name,value:e.target.value}));
        }
    }

    showModal(id){
        const {dispatch} = this.props;
        dispatch(action.modalGroupName(id));
    }

    onSave(){
        const {dispatch, item} = this.props;
        dispatch(action.saveGroupName(item));
    }

    onCancel(){
        const {dispatch} = this.props;
        dispatch(action.closeModalGroupName());
    }

    delete(id){
        const {dispatch} = this.props;
        dispatch(action.deleteGroupName(id));
    }

    render() {
        const {items, loading, confirmLoading ,itemLoading, item, modal} = this.props;
        const columns = [{
            title: '№',
            width: 70,
            key: 'order',
            render: (text, record, index) => (
                <React.Fragment>
                    <span>{index + 1}</span>
                </React.Fragment>
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
                    <Popconfirm title="Та устгахдаа итгэлтэй байна уу" onConfirm={this.delete.bind(this,record._id)} okText="Тийм" cancelText="Үгүй">
                        <Button style={{marginLeft: 15}} size="small" type="danger" icon="delete" disabled={itemLoading}>Устгах</Button>
                    </Popconfirm>
                </React.Fragment>
            )
        }];
        return (
            <Card className="full-card" title='Sliders' bordered={false}
                extra={<Button icon="plus" onClick={this.showModal.bind(this, 0)}>Нэмэх</Button>}
            >
                <Table
                    size="small"
                    bordered={false}
                    rowKey={record => record._id}
                    columns={columns}
                    dataSource={items}
                    loading={loading}
                />
                <Modal
                    title={item._id === 0 ? 'Нэмэх' : 'Засах'}
                    visible={modal}
                    closable={false}
                    maskClosable={false}
                    onOk={() => this.onSave()}
                    confirmLoading={confirmLoading}
                    onCancel={() => this.onCancel()}
                    cancelText="Болих"
                    okText="Хадгалах"
                >
                    <Row gutter={30}>
                        <Col span={17}>
                            <Form.Item
                                label="Гарчиг"
                            >
                                <Input name="title" value={item.title} onChange={this.changeHandler.bind(this)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Modal>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.groupName.items,
        loading: state.groupName.loading,
        modal: state.groupName.modal,
        item: state.groupName.item,
        confirmLoading: state.groupName.confirmLoading,
        itemLoading: state.groupName.itemLoading
    }
}

export default connect(mapStateToProps)(GroupNames);