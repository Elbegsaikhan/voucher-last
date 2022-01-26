import React from "react";
import {
    Modal,
    Button,
    Table,
    Card,
    Select,
} from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as action from "../actions/withdraw_actions.js";
import { Editor } from "@tinymce/tinymce-react";
import config from "../config";

class Withdraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            modal: false,
            data: {},
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(action.getWithdraw(this.state.current));
    }

    onPaginate(data) {
        const { dispatch } = this.props;
        this.setState({ current: data.current - 1 });
        dispatch(action.getWithdraw(data.current - 1));
    }

    changeHandler(id, value) {
        const { dispatch } = this.props;
        console.log("Id", id, 'Value', value)
        dispatch(action.getWithdrawChangeStatus({ id, value }));
    }

    render() {
        console.log('Props ', this.props)
        const { user, all, items, loading } = this.props;
        const { data } = this.state;
        // const more = items
        console.log('Data', JSON.stringify(data.user))
        const ssss = data.user
        console.log(ssss, ssss && ssss.first_name)
        // const data = items
        // console.log("Data", this.state)
        // const d = Object.values(items)
        // console.log("D ", d)

        let pagination = {
            total: all,
            current: this.state.current + 1,
            pageSize: 30,
            position: "bottom",
        };
        const columns = [
            {
                title: "№",
                width: 60,
                key: "index",
                render: (text, record, index) =>
                    this.state.current * 30 + index + 1,
            },
            {
                title: "Код",
                key: "sku",
                dataIndex: "sku",
            },
            {
                title: "Бараа",
                key: "product.title",
                dataIndex: "product.title",
                // render: (text, record) => (
                //     <Link to={`/tution/${record.tution._id}`} target="_blank">
                //         {text}
                //     </Link>
                // ),
            },
            {
                title: "Имэйл",
                key: "user.email",
                dataIndex: "user.email",
            },
            {
                title: "Утас",
                key: "user.phone",
                dataIndex: "user.phone",
            },
            {
                title: "Хүргэлт хийгдсэн эсэх",
                width: 300,
                key: "action2",
                render: (text, record) => (
                    <React.Fragment>
                        <Select
                            size={"small"}
                            className={
                                record.delivery === "hvrgsen" ? "active" : ""
                            }
                            style={{ width: "100%", marginRight: 1 }}
                            loading={loading}
                            value={record.delivery}
                            name="status"
                            onChange={this.changeHandler.bind(this, record._id)}
                        >
                            <Select.Option value="hvleegdej">
                                Хүлээгдэж байгаа✋
                            </Select.Option>
                            <Select.Option value="hvrgej">
                                Хүргэлт хийгдэж байгаа🏇
                            </Select.Option>
                            <Select.Option value="hvrgsen">
                                Хүргэлт хийгдсэн👌
                            </Select.Option>
                        </Select>
                    </React.Fragment>
                ),
            },
            {
                title: "Төлбөр баталгаажсан эсэх",
                width: 400,
                key: "action",
                render: (text, record) => (
                    <React.Fragment>
                        <Select
                            size={"small"}
                            className={
                                record.status === "active" ? "active" : ""
                            }
                            style={{ width: "180px", marginRight: 10 }}
                            loading={loading}
                            value={record.status}
                            name="status"
                            onChange={this.changeHandler.bind(this, record._id)}
                        >
                            <Select.Option value="pending">
                                Хүлээгдэж буй
                            </Select.Option>
                            <Select.Option value="active">
                                Идэвхитэй
                            </Select.Option>
                        </Select>
                        <Button
                            onClick={() =>
                                // console.log('Record ', record)
                                this.setState({
                                    data: { ...record, user: record.user, sku: record.info, product: record.product },
                                    modal: true,
                                })
                            }
                        >
                            Дэлгэрэнгүй харах
                            {/* {JSON.parse(record, 2, null)} */}
                        </Button>
                    </React.Fragment>
                ),
            },

        ];
        return (
            <Card
                className="full-card"
                title="Хүсэлтүүд"
                bordered={false}
            // extra={
            //     [<Button icon="plus" onClick={this.showModal.bind(this, 0)}>Нэмэх</Button>]
            // }
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
                <Modal
                    title={"Дэлгэрэнгүй"}
                    visible={this.state.modal}
                    onCancel={() => this.setState({ modal: false, data: {} })}
                    cancelText="Хаах"
                >
                    <div>
                        {data.sku}
                    </div>
                    <div>
                        {/* {JSON.parse(data.product && data.product)} */}
                    </div>
                    <ul
                        style={{
                            listStyle: "none",
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        {data.amount ? (
                            <li>
                                Үнэ: <strong>{data.amount}</strong>
                            </li>
                        ) : null}
                        {ssss ? (
                            <li>
                                Нэр: <strong>{data.user.first_name}</strong>
                            </li>
                        ) : null}
                        {ssss ? (
                            <li>
                                Овог: <strong>{data.user.last_name}</strong>
                            </li>
                        ) : null}
                        {ssss ? (
                            <li>
                                Төрсөн он: <strong>{data.user.birthday}</strong>
                            </li>
                        ) : null}
                        {ssss ? (
                            <li>
                                Утас: <strong>{data.user.phone}</strong>
                            </li>
                        ) : null}
                        {ssss ? (
                            <li>
                                Албан байгууллага:{" "}
                                <strong>{data.user.company}</strong>
                            </li>
                        ) : null}
                        {ssss ? (
                            <li>
                                Албан тушаал: <strong>{data.user.profession}</strong>
                            </li>
                        ) : null}
                        {ssss ? (
                            <li>
                                Дэлгэрэнгүй мэдээлэл:{" "}
                                <strong>{data.user.more}</strong>
                            </li>
                        ) : null}
                    </ul>
                </Modal>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.main.user,
        items: state.withdraw.items,
        // loading: state.requests.itemsLoading,
        all: state.withdraw.all,
        allUser: state.companies.all,

    };
}

export default connect(mapStateToProps)(Withdraw);
