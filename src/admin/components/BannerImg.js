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
import {connect} from "react-redux";
import * as action from "../actions/silder_actions";

class BannerImg extends React.Component {
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
        const {dispatch} = this.props;
        dispatch(action.getSlider(this.state.current));
    }

    onPaginate(data) {
        const {dispatch} = this.props;
        this.setState({current: data.current - 1});
        dispatch(action.getSlider(data.current - 1));
    }

    changeHandler(e, value) {
        this.setState({option: value});
        // console.log("Option First", this.state.option)
        const {dispatch} = this.props;
        if (
            value &&
            (typeof value === "number" ||
                typeof value === "string" ||
                e instanceof String)
        ) {
            dispatch(action.changeHandler({name: e, value: value}));
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
        const {dispatch} = this.props;
        dispatch(action.modalSlider(id));
    }

    onSave() {
        const {dispatch, item} = this.props;
        console.log("Item", item)
        dispatch(action.saveSlider(item));
    }

    onCancel() {
        const {dispatch} = this.props;
        dispatch(action.closeModalSlider());
    }

    delete(id) {
        const {dispatch} = this.props;
        dispatch(action.deleteSlider(id));
    }

    handleChange = (info) => {
        const {dispatch} = this.props;
        if (info.file.status === "uploading") {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === "done") {
            this.setState({uploadLoading: false});
            dispatch(
                action.changeHandler({
                    name: "image",
                    value: info.file.response.result,
                })
            );
            dispatch(action.changeHandler({name: "newImage", value: true}));
        }
        if (info.file.status === "error") {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };
    changeOption = () => {
        this.setState({option: 1});
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
        // item.position = 7;

        const datas = items.filter((item) => item.position > 6)
        console.log("Data", datas)
        const uploadButton = (
            <div>
                <Icon type={this.state.uploadLoading ? "loading" : "inbox"}/>
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
                // render: (index) => (
                //     <span>{ index + 1}</span>
                // )
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
                    <span>{text - 6}</span>
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
                                style={{marginLeft: 15}}
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
                title="Баннер"
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
                    dataSource={datas}
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
                            <Form.Item
                                label="Banner"
                                help="1920x150 тохиромжтой хэмжээ"
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
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Төрөл">
                                <Select
                                    style={{width: "100%"}}
                                    value={item.position ? item.position : "7"}
                                    name="position"
                                    onChange={this.changeHandler.bind(
                                        this,
                                        "position"
                                    )}
                                >
                                    <Select.Option value={7}>1</Select.Option>
                                    <Select.Option value={8}>2</Select.Option>
                                    <Select.Option value={9}>3</Select.Option>
                                    <Select.Option value={10}>4</Select.Option>
                                    <Select.Option value={11}>5</Select.Option>
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

export default connect(mapStateToProps)(BannerImg);
