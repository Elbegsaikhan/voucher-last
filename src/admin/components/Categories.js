import React from "react";
import {
    Text,
    List,
    Select,
    Button,
    Table,
    Input,
    Row,
    Form,
    Col,
    Card,
    Modal,
    InputNumber,
    Popconfirm, Upload, Icon,
} from "antd";
import { connect } from "react-redux";
import * as action from "../actions/cates_actions";
class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(action.getCate());
    }

    changeHandler(e, value) {
        const { dispatch } = this.props;
        if (
            e &&
            (typeof e === "number" ||
                typeof e === "string" ||
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
    showModal(id) {
        const { dispatch } = this.props;
        dispatch(action.modalCate(id));
    }

    onSave() {
        const { dispatch, item } = this.props;
        dispatch(action.saveCate(item));
    }

    onCancel() {
        const { dispatch } = this.props;
        dispatch(action.closeModalCate());
    }

    delete(id) {
        const { dispatch } = this.props;
        dispatch(action.deleteCate(id));
    }

    render() {
        const {
            items,
            loading,
            confirmLoading,
            itemLoading,
            item,
            modal,
            parentCates,
        } = this.props;
        const uploadButton = (
            <div>
                <Icon type={this.state.uploadLoading ? "loading" : "inbox"} />
                <p className="ant-upload-text">Зураг</p>
            </div>
        );
        console.log('Cate props ', this.props)
        const columns = [
            {
                title: "№",
                key: "order",
                dataIndex: "order",
                width: 60,
            },
            {
                title: "Нэр",
                key: "title",
                dataIndex: "title",
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
                title="Ангилал"
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
                    expandedRowRender={(record) => (
                        <Row gutter={[8, 8]}>
                            {record.child && record.child.length > 0
                                ? record.child.map((ch) => (
                                      <List.Item
                                          actions={[
                                              <React.Fragment>
                                                  <Button
                                                      onClick={this.showModal.bind(
                                                          this,
                                                          ch._id
                                                      )}
                                                      size="small"
                                                      type="default"
                                                      icon="edit"
                                                      disabled={itemLoading}
                                                  >
                                                      Засах
                                                  </Button>
                                                  <Popconfirm
                                                      title="Та устгахдаа итгэлтэй байна уу"
                                                      onConfirm={this.delete.bind(
                                                          this,
                                                          ch._id
                                                      )}
                                                      okText="Тийм"
                                                      cancelText="Үгүй"
                                                  >
                                                      <Button
                                                          style={{
                                                              marginLeft: 15,
                                                          }}
                                                          size="small"
                                                          type="danger"
                                                          icon="delete"
                                                          disabled={itemLoading}
                                                      >
                                                          Устгах
                                                      </Button>
                                                  </Popconfirm>
                                              </React.Fragment>,
                                          ]}
                                      >
                                          <span>
                                              <span style={{ marginRight: 15 }}>
                                                  {ch.order}
                                              </span>
                                              {ch.title}
                                          </span>
                                      </List.Item>
                                  ))
                                : null}
                        </Row>
                    )}
                    defaultExpandAllRows={true}
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
                                <Input
                                    name="title"
                                    value={item.title}
                                    onChange={this.changeHandler.bind(this)}
                                />
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
                    </Row>
                    {/*{parentCates && parentCates.length > 0 ? (*/}
                    {/*    <Form.Item*/}
                    {/*        label="Эцэг"*/}
                    {/*        labelCol={{ span: 3 }}*/}
                    {/*        help="Заавал шаардлагагүй"*/}
                    {/*    >*/}
                    {/*        <Select*/}
                    {/*            value={item.parent ? item.parent : ""}*/}
                    {/*            name="parent"*/}
                    {/*            onChange={this.changeHandler.bind(*/}
                    {/*                this,*/}
                    {/*                "parent"*/}
                    {/*            )}*/}
                    {/*        >*/}
                    {/*            <Select.Option value="">*/}
                    {/*                Эцэг ангилал сонгох*/}
                    {/*            </Select.Option>*/}
                    {/*            {parentCates.map((run) =>*/}
                    {/*                run._id === item._id ||*/}
                    {/*                run.parent ? null : (*/}
                    {/*                    <Select.Option value={run._id}>*/}
                    {/*                        {run.title}*/}
                    {/*                    </Select.Option>*/}
                    {/*                )*/}
                    {/*            )}*/}
                    {/*        </Select>*/}
                    {/*    </Form.Item>*/}
                    {/*    null*/}
                    {/*) : null}*/}
                </Modal>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.cates.categories,
        loading: state.cates.cateLoading,
        modal: state.cates.cateModal,
        item: state.cates.item,
        confirmLoading: state.cates.confirmCateLoading,
        parentCates: state.cates.parentCates,
        itemLoading: state.cates.itemLoading,
    };
}

export default connect(mapStateToProps)(Categories);
