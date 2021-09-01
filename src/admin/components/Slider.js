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
import * as action from "../actions/silder_actions";

class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            uploadLoading: false,
            option: 1,
            arr: {
                title: "Зургаа оруулаал болоо 👏",
                desc: "",
                order: "",
            },
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(action.getSlider(this.state.current));
    }

    onPaginate(data) {
        const { dispatch } = this.props;
        this.setState({ current: data.current - 1 });
        dispatch(action.getSlider(data.current - 1));
    }

    changeHandler(e, value) {
        console.log("Value", value, "  e", e);
        this.setState({ option: value });
        // console.log("Option First", this.state.option)
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
        if (value === 3) {
            this.setState({
                arr: {
                    title: "Тайлбар",
                    desc: "sale || trend",
                    order: "үнэ",
                },
            });
        } else if (value === 2) {
            this.setState({
                arr: {
                    title: "Зураг өнгө тэгээл болоо 👏",
                    desc: "Туслах Слайд сонгосон бол өнгөний код оруулна уу Ж:нь #f582ae",
                    order: "",
                },
            });
        } else if (value === 1) {
            this.setState({
                arr: {
                    title: "Зургаа оруулаал болоо 👏",
                    desc: "",
                    order: "",
                },
            });
        } else {
            this.setState({
                arr: {
                    title: "",
                    desc: "",
                    order: "",
                },
            });
        }
    }

    showModal(id) {
        const { dispatch } = this.props;
        dispatch(action.modalSlider(id));
    }

    onSave() {
        const { dispatch, item } = this.props;
        dispatch(action.saveSlider(item));
    }

    onCancel() {
        const { dispatch } = this.props;
        dispatch(action.closeModalSlider());
        this.setState({
            arr: {
                title: "Зургаа оруулаал болоо 👏",
                desc: "",
                order: "",
            },
        });
    }

    delete(id) {
        const { dispatch } = this.props;
        dispatch(action.deleteSlider(id));
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
        // console.log("Option", this.state.option)
        // console.log('Arr ', this.state.arr)
        // console.log("Title", this.state.arr.title);

        const {
            all,
            items,
            loading,
            confirmLoading,
            itemLoading,
            item,
            modal,
        } = this.props;
        let items2 = items.filter((u) => u.position < 7)
        const uploadButton = (
            <div>
                <Icon type={this.state.uploadLoading ? "loading" : "inbox"} />
                <p className="ant-upload-text">Зураг</p>
            </div>
        );
        let pagination = {
            total: all,
            current: this.state.current + 1,
            pageSize: 30,
            position: "bottom",
        };
        const columns = [
            {
                title: "№",
                dataIndex: "order",
                width: 70,
                key: "order",
            },
            {
                title: "Нэр",
                key: "title",
                dataIndex: "title",
            },
            {
                title: "Байрлал",
                key: "position",
                dataIndex: "position",
                render: (text, record) => (
                    <span>{text === 7 ? "Сэтгэгдэл" : text}</span>
                ),
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
                    dataSource={items2}
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
                        <Col span={7}>
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                multiple={false}
                                action="/dashboard/api/upload"
                                onChange={::this.handleChange}
                            >
                                {item.image ? (
                                    <img
                                        width={110}
                                        src={item.image}
                                        alt="image"
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Col>
                        <Col span={17}>
                            <Form.Item label={this.state.arr.title}>
                                <Input
                                    name="title"
                                    value={item.title}
                                    onChange={this.changeHandler.bind(this)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={this.state.arr.desc}>
                                <Input
                                    name="description"
                                    value={item.description}
                                    onChange={this.changeHandler.bind(this)}
                                />
                            </Form.Item>
                        </Col>
                        {/*<Col span={24}>*/}
                        {/*    <Form.Item label="Link">*/}
                        {/*        <Input*/}
                        {/*            name="link"*/}
                        {/*            value={item.link}*/}
                        {/*            onChange={this.changeHandler.bind(this)}*/}
                        {/*            type="hidden"*/}
                        {/*        />*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}
                        <Col span={12}>
                            <Form.Item
                                label={this.state.arr.order}
                                help="min/max"
                            >
                                <InputNumber
                                    value={item.order}
                                    min={0}
                                    max={1000000}
                                    style={{ width: "100%" }}
                                    formatter={(value) => `${value}`}
                                    onChange={this.changeHandler.bind(
                                        this,
                                        "order"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Төрөл">
                                <Select
                                    style={{ width: "100%" }}
                                    value={item.position ? item.position : ""}
                                    name="position"
                                    onChange={this.changeHandler.bind(
                                        this,
                                        "position"
                                    )}
                                >
                                    <Select.Option value={1}>
                                        Үндсэн Слайд
                                    </Select.Option>
                                    <Select.Option value={2}>
                                        Туслах Слайд
                                    </Select.Option>
                                    <Select.Option value={3}>3</Select.Option>
                                    <Select.Option value={4}>4</Select.Option>
                                    <Select.Option value={5}>5</Select.Option>
                                    <Select.Option value={6}>6</Select.Option>
                                </Select>
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
        items: state.slider.items,
        loading: state.slider.loading,
        modal: state.slider.modal,
        item: state.slider.item,
        all: state.slider.all,
        confirmLoading: state.slider.confirmLoading,
        itemLoading: state.slider.itemLoading,
    };
}

export default connect(mapStateToProps)(Slider);
