// import React from "react";
// import { connect } from "react-redux";
// import { getProduct } from "../../actions/product_actions";
// import { Editor } from "@tinymce/tinymce-react";
// // import config from "../config";
// import {
//     Icon,
//     Upload,
//     Button,
//     Input,
//     Row,
//     Form,
//     Col,
//     Card,
//     Divider,
//     Table,
//     Tag,
//     Space, Popconfirm,
// } from "antd";
// import * as action from "../../actions/silder_actions";
// const reducer = ({ product }) => ({ product });
//
// class Product extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             current: 0,
//         };
//         this.editor = null;
//     }
//
//     componentDidMount() {
//         this.props.getProduct();
//     }
//     showModal(id) {
//         const { dispatch } = this.props;
//         dispatch(action.modalSlider(id));
//     }
//     render() {
//         const { product } = this.props.product;
//         console.log("Did mount product", typeof product);
//
//         const columns = [
//             {
//                 title: "Нэр",
//                 dataIndex: "name",
//                 key: "name",
//                 render: (text) => <a>{text}</a>,
//             },
//             {
//                 title: "Тайлбар",
//                 dataIndex: "desc",
//                 key: "desc",
//             },
//             // {
//             //   title: 'Зураг',
//             //   dataIndex: 'image',
//             //   key: 'image'
//             // },
//             {
//                 title: "Тоо",
//                 dataIndex: "order",
//                 key: "order",
//             },
//             {
//                 title: "Үнэ",
//                 key: "price",
//                 dataIndex: "price",
//             },
//             {
//                 title: "Хаяг",
//                 key: "address",
//                 dataIndex: "address"
//             },
//             {
//                 title: "Үйлдэл",
//                 width: 250,
//                 key: "action",
//                 render: (text, record) => (
//                     <React.Fragment>
//                         <div style={{display: "flex"}}>
//                             <Button
//                                 // onClick={this.showModal.bind(this, record._id)}
//                                 size="small"
//                                 type="default"
//                                 icon="edit"
//                                 // disabled={itemLoading}
//                             >
//                                 Засах
//                             </Button>
//                             <Popconfirm
//                                 title="Та устгахдаа итгэлтэй байна уу"
//                                 // onConfirm={this.delete.bind(this, record._id)}
//                                 okText="Тийм"
//                                 cancelText="Үгүй"
//                             >
//                                 <Button
//                                     style={{ marginLeft: 15 }}
//                                     size="small"
//                                     type="danger"
//                                     icon="delete"
//                                     // disabled={itemLoading}
//                                 >
//                                     Устгах
//                                 </Button>
//                             </Popconfirm>
//                         </div>
//                     </React.Fragment>
//                 ),
//             },
//         ];
//
//         const data = [
//             {
//                 key: product.id,
//                 name: product.name,
//                 // image: product.image,
//                 desc: product.desc,
//                 order: product.order,
//                 price: product.price,
//                 address: product.address,
//             },
//         ];
//
//         return (
//             <Card className="full-card" title="Voucher засах" bordered="false" extra={
//                 <Button icon="plus"
//                         onClick={this.showModal.bind(this, 0)}
//                 >
//                     Нэмэх
//                 </Button>
//             }>
//                 {/*<Table dataSource={} columns={columns} />*/}
//                 <Table columns={columns} dataSource={data} />
//                 {/*{product}*/}
//             </Card>
//         );
//     }
// }
// export default connect(reducer, { getProduct })(Product);
