import React from "react";
import {Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Table, Upload,} from "antd";
import {connect} from "react-redux";
import * as action from "../actions/cupon_actions";

class Cuponcode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(action.getCoupon(this.state.current));
    }

    onPaginate(data) {
        const { dispatch } = this.props;
        this.setState({ current: data.current - 1 });
        dispatch(action.getCoupon(data.current - 1));
    }

    changeHandler(e, value) {
        console.log("e", e, " value", value)
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
                    name: e,
                    value: e,
                })
            );
        }

    }

    showModal(id) {
        const { dispatch } = this.props;
        console.log("ID", id)
        dispatch(action.modalCoupon(id));
    }

    onSave() {
        const { dispatch, item } = this.props;
        // console.log("item", item)
        item.user = this.props.user._id
        console.log('USer', item.user)
        dispatch(action.saveCoupon(item));
    }

    onCancel() {
        const { dispatch } = this.props;
        dispatch(action.closeModalCoupon());
    }

    delete(id) {
        const { dispatch } = this.props;
        dispatch(action.deleteCoupon(id));
    }

    handleChange = (info) => {
        const { dispatch } = this.props;
        if (info.file.status === "uploading") {
            this.setState({ uploadLoading: true });
            return;
        }
        if (info.file.status === "done") {
            this.setState({ uploadLoading: false });
            dispatch(
                action.changeHandler({
                    name: "image",
                    value: info.file.response.result,
                })
            );
            dispatch(action.changeHandler({ name: "newImage", value: true }));
        }
        if (info.file.status === "error") {
            this.setState({ uploadLoading: false });
            message.error(`${info.file.name} file upload failed.`);
        }
    };
    changeOption = () => {
        this.setState({ option: 1 });
        console.log("Option::: ", this.state.option);
    };

    render() {

        const {
            all,
            items,
            loading,
            confirmLoading,
            itemLoading,
            item,
            modal,
            user,
        } = this.props;

        let items2 = Object.values(items)

        let pagination = {
            total: all,
            current: this.state.current + 1,
            pageSize: 30,
            position: "bottom",
        };
        const columns = [
            {
                title: "Код",
                key: "code",
                dataIndex: "code",
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
                title="Sliders"
                bordered={false}
                extra={
                    <Button icon="plus" onClick={this.showModal.bind(this, 0)}>
                        Нэмэх
                    </Button>
                }
            >
                <Table
                    size="small"
                    bordered={false}
                    onChange={() => this.onPaginate()}
                    pagination={pagination}
                    rowKey={(record) => record._id}
                    columns={columns}
                    // dataSource={items}
                    dataSource={items2.filter((it) => it.user === user._id )}
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
                        <Col span={12}>
                            <Form.Item
                                label="Код"
                                help="code"
                            >
                                <InputNumber
                                    value={item.code}
                                    min={0}
                                    max={1000000}
                                    style={{ width: "100%" }}
                                    formatter={(value) => `${value}`}
                                    onChange={this.changeHandler.bind(
                                        this,
                                        "code"
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
        items: state.coupon.items,
        loading: state.coupon.loading,
        modal: state.coupon.modal,
        item: state.coupon.item,
        all: state.coupon.all,
        confirmLoading: state.coupon.confirmLoading,
        itemLoading: state.coupon.itemLoading,
        user: state.main.user,

    };
}

export default connect(mapStateToProps)(Cuponcode);
