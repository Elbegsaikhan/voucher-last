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
    Drawer,
    Popconfirm,
    message,
} from "antd";
import { connect } from "react-redux";
import * as action from "../actions/news_actions";
import { Editor } from "@tinymce/tinymce-react";
import config from "../config";
class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
        this.editor = null;
    }

    componentDidMount() {
        const { dispatch } = this.props;
        let self = this;
        dispatch(action.getNewss(this.state.current));
        config.get("emitter").addListener("editorNews", function () {
            self.editor && self.editor.editor
                ? self.editor.editor.setContent("")
                : null;
        });
    }

    onPaginate(data) {
        const { dispatch } = this.props;
        this.setState({ current: data.current - 1 });
        dispatch(action.getNewss(data.current - 1));
    }

    changeHandler(e, value) {
        const { dispatch } = this.props;
        if (value && (typeof e === "string" || e instanceof String)) {
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
        dispatch(action.modalNews(id));
    }

    onSave() {
        const { dispatch, item } = this.props;
        let data = {
            ...item,
            body: this.editor.editor.getContent({ format: "raw" }),
        };
        dispatch(action.saveNews(data));
    }

    onCancel() {
        const { dispatch } = this.props;
        dispatch(action.closeModalNews());
    }

    delete(id) {
        const { dispatch } = this.props;
        dispatch(action.deleteNews(id));
    }

    onImageUpload(blobInfo, success, failure) {
        let xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open("POST", "/dashboard/api/upload/direct");

        xhr.onload = function () {
            let json;

            if (xhr.status != 200) {
                failure("HTTP Error: " + xhr.status);
                return;
            }

            json = JSON.parse(xhr.responseText);

            if (!json || json.success != true) {
                failure("Invalid JSON: " + xhr.responseText);
                return;
            }

            success(json.result);
        };

        formData = new FormData();
        formData.append("image", blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
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
                    value: info.file.response.image,
                })
            );
            dispatch(action.changeHandler({ name: "newImage", value: true }));
        }
        if (info.file.status === "error") {
            this.setState({ uploadLoading: false });
            message.error(`${info.file.name} file upload failed.`);
        }
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
        } = this.props;
        const uploadButton = (
            <div>
                <Icon type={this.state.uploadLoading ? "loading" : "inbox"} />
                <p className="ant-upload-text">??????????</p>
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
                title: "???",
                width: 60,
                key: "index",
                render: (text, record, index) =>
                    this.state.current * 30 + index + 1,
            },
            {
                title: "??????????",
                width: 80,
                key: "img",
                dataIndex: "image",
                render: (text, record, index) => (
                    <img
                        src={text}
                        height={30}
                        width={60}
                        style={{
                            objectFit: "cover",
                            borderRadius: 3,
                            border: "1px solid #d0d0d0",
                        }}
                        alt=""
                    />
                ),
            },
            {
                title: "??????",
                key: "title",
                dataIndex: "title",
            },
            {
                title: "????????????",
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
                            ??????????
                        </Button>
                        {record.status != "delete" ? (
                            <Popconfirm
                                title="???? ?????????????????? ???????????????? ?????????? ????"
                                onConfirm={this.delete.bind(this, record._id)}
                                okText="????????"
                                cancelText="????????"
                            >
                                <Button
                                    style={{ marginLeft: 15 }}
                                    size="small"
                                    type="danger"
                                    icon="delete"
                                    disabled={itemLoading}
                                >
                                    ????????????
                                </Button>
                            </Popconfirm>
                        ) : null}
                    </React.Fragment>
                ),
            },
        ];
        return (
            <Card
                className="full-card"
                title="????????????????"
                bordered={false}
                extra={[
                    <Button icon="plus" onClick={this.showModal.bind(this, 0)}>
                        ??????????
                    </Button>,
                ]}
            >
                <Table
                    size="small"
                    bordered={false}
                    onChange={() => this.onPaginate()}
                    pagination={pagination}
                    rowKey={(record) => record._id}
                    columns={columns}
                    dataSource={items}
                    loading={loading}
                />
                <Drawer
                    title={item._id === 0 ? "??????????" : "??????????"}
                    visible={modal}
                    closable={false}
                    maskClosable={false}
                    width={"70%"}
                >
                    <Row gutter={30}>
                        <Col span={6}>
                            <Form.Item label="??????????" help="500x250">
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    multiple={false}
                                    action="/api/image/upload/news"
                                    onChange={::this.handleChange}
                                >
                                    {item.image ? (
                                        <img
                                            width={"100%"}
                                            src={item.image}
                                            alt="image"
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={18}>
                            <Row gutter={15}>
                                <Col span={12}>
                                    <Form.Item
                                        label="????????????"
                                        help="?????????????? ????????????"
                                    >
                                        <Input
                                            name="title"
                                            placeholder="???????? ????????????????"
                                            value={item.title}
                                            onChange={this.changeHandler.bind(
                                                this
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Form.Item label="??????????????">
                            <Editor
                                value={item.body}
                                ref={(ref) => {
                                    this.editor = ref;
                                }}
                                height="600px"
                                init={{
                                    height: "600px",
                                    content_style: "img { max-width: 100%; }",
                                    relative_urls: false,
                                    remove_script_host: false,
                                    plugins:
                                        "image code paste media link lists textcolor hr table emoticons advlist",
                                    images_upload_handler: this.onImageUpload,
                                    paste_data_images: true,
                                    paste_webkit_styles: "color font-size",
                                    valid_elements:
                                        "img[src|width|height],*[style]",
                                    toolbar:
                                        "undo redo | bold italic | fontsizeselect | alignleft aligncenter alignright | image media link | numlist bullist | forecolor backcolor | emoticons",
                                    extended_valid_elements:
                                        "iframe[src|frameborder|style|scrolling|class|width|height|name|align]",
                                    color_cols: "5",
                                    custom_colors: false,
                                    body_class: "my_class",
                                    paste_postprocess: function (plugin, args) {
                                        console.log(args.node);
                                    },
                                }}
                            />
                        </Form.Item>
                    </Row>
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            borderTop: "1px solid #e8e8e8",
                            padding: "10px 16px",
                            textAlign: "right",
                            left: 0,
                            background: "#fff",
                            borderRadius: "0 0 4px 4px",
                        }}
                    >
                        <Button
                            style={{
                                marginRight: 8,
                            }}
                            onClick={() => this.onCancel()}
                            disabled={confirmLoading}
                        >
                            ??????????
                        </Button>
                        <Button
                            onClick={() => this.onSave()}
                            disabled={confirmLoading}
                            loading={confirmLoading}
                            type="primary"
                        >
                            ????????????????
                        </Button>
                    </div>
                </Drawer>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.news.news,
        loading: state.news.newsLoading,
        modal: state.news.newsModal,
        item: state.news.item,
        all: state.news.all,
        confirmLoading: state.news.confirmLoading,
        itemLoading: state.news.itemLoading,
    };
}

export default connect(mapStateToProps)(News);
