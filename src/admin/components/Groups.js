import React from "react";
import {
    Icon,
    Upload,
    Button,
    Table,
    Input,
    Row,
    Form,
    Col,
    Card,
    Modal,
    InputNumber,
    Popconfirm,
    Select,
} from "antd";
import { connect } from "react-redux";
import * as action from "../actions/groups_actions";
class Groups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(action.getGroups());
    }

    changeHandler(e, value) {
        const { dispatch } = this.props;
        if (
            value &&
            (typeof value === "number" ||
                typeof value === "string" ||
                e instanceof String)
        ) {
            dispatch(action.changeHandler({ name: e, value: value }));
        } else {
            dispatch(
                action.changeHandler({
                    name: e.target.name,
                    value: e.target.value,
                })
            );
        }
    }

    showModal(id) {
        const { dispatch } = this.props;
        dispatch(action.modalGroup(id));
    }

    onSave() {
        const { dispatch, item } = this.props;
        dispatch(action.saveGroup(item));
    }

    onCancel() {
        const { dispatch } = this.props;
        dispatch(action.closeModalGroup());
    }

    delete(id) {
        const { dispatch } = this.props;
        dispatch(action.deleteGroup(id));
    }

    render() {
        const {
            items,
            loading,
            confirmLoading,
            itemLoading,
            item,
            modal,
            names,
        } = this.props;
        const columns = [
            {
                title: "№",
                key: "order",
                dataIndex: "order",
                width: 60,
            },
            {
                title: "Нэр",
                key: "title.title",
                dataIndex: "title.title",
            },
            {
                title: "Үйлдэл",
                width: 250,
                key: "action",
                render: (text, record) => (
                    <React.Fragment>
                        <Button
                            onClick={this.showModal.bind(this, record._id)}
                            size="small"
                            type="default"
                            icon="edit"
                            disabled={itemLoading}
                        >
                            Засах
                        </Button>
                        <Popconfirm
                            title="Та устгахдаа итгэлтэй байна уу"
                            onConfirm={this.delete.bind(this, record._id)}
                            okText="Тийм"
                            cancelText="Үгүй"
                        >
                            <Button
                                style={{ marginLeft: 15 }}
                                size="small"
                                type="danger"
                                icon="delete"
                                disabled={itemLoading}
                            >
                                Устгах
                            </Button>
                        </Popconfirm>
                    </React.Fragment>
                ),
            },
        ];
        return (
            <Card
                className="full-card"
                title="Байгшил"
                bordered={false}
                extra={[
                    <Button icon="plus" onClick={this.showModal.bind(this, 0)}>
                        Нэмэх
                    </Button>,
                ]}
            >
                <Table
                    size="small"
                    bordered={false}
                    pagination={false}
                    rowKey={(record) => record._id}
                    columns={columns}
                    dataSource={items}
                    loading={loading}
                />
                <Modal
                    title={item._id === 0 ? "Нэмэх" : "Засах"}
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
                        <Col span={16}>
                            <Form.Item label="Гарчиг">
                                <Select
                                    style={{ width: "100%" }}
                                    value={item.title ? item.title : ""}
                                    name="title"
                                    onChange={this.changeHandler.bind(
                                        this,
                                        "title"
                                    )}
                                >
                                    {(names || []).map((name, ind) => (
                                        <Select.Option
                                            key={ind}
                                            value={name._id}
                                        >
                                            {name.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Дараалал"
                                help="Сайтад харагдах дараалал"
                            >
                                <InputNumber
                                    value={item.order}
                                    min={0}
                                    max={1000}
                                    style={{ width: "100%" }}
                                    formatter={(value) => `№   ${value}`}
                                    onChange={this.changeHandler.bind(
                                        this,
                                        "order"
                                    )}
                                />
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
        items: state.groups.categories,
        names: state.groups.names,
        loading: state.groups.cateLoading,
        modal: state.groups.cateModal,
        item: state.groups.item,
        confirmLoading: state.groups.confirmCateLoading,
        itemLoading: state.groups.itemLoading,
    };
}

export default connect(mapStateToProps)(Groups);
