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
	Popconfirm,
	Select,
	Tag,
} from "antd";
import {connect} from "react-redux";
import * as action from "../actions/product_actions";
import * as cateaction from "../actions/cates_actions";


class Product extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current: 0,
			uploadLoading: false,
			userRole: '',
			addrss: '',
			phone: '',
			arr: [],
			price0: 0,
			price1: 0,
			price2: '',
			price3: '',
			price4: '',
			price5: '',
			price6: '',
			price7: '',
			price8: '',
			priceArr: [],
			count: 2
		};

	}

	componentDidMount() {
		const {dispatch} = this.props;
		dispatch(action.getProduct(this.state.current));
		dispatch(cateaction.getCate());
		this.setState({arr: []})
	}

	onPaginate(data) {
		const {dispatch} = this.props;
		this.setState({current: data.current - 1});
		dispatch(action.getProduct(data.current - 1));
	}

	changeHandler(e, value) {
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
		dispatch(action.modalProduct(id));
	}

	onSave() {
		const {dispatch, item} = this.props;
		dispatch(action.saveProduct(item));
	}

	onCancel() {
		const {dispatch} = this.props;
		dispatch(action.closeModalProduct());
	}

	delete(id) {
		const {dispatch} = this.props;
		dispatch(action.deleteProduct(id));
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
	remove = k => {

	};

	add = () => {
		const ht = <Col span={12}>
			<Form.Item label={`Үнэ ${this.state.count}`}>
				<Input
					name={`price${this.state.count}`}
					value={item && item.price[`${this.state.count}`] }
					onChange={(e) => this.onHandle(`price${this.state.count}`, e.target.value)}
				/>
			</Form.Item>
		</Col>;
		this.setState({count: this.state.count + 1})
		console.log('', ht)
		this.setState({arr: [...this.state.arr, ht]})
		console.log("arr", this.state.arr)
	};
	onHandle = (a, value) => {
		console.log("Onhandle", a, "Vak", value)
		switch (a) {
			case "price":
				console.log('1')
				return this.setState({price: value})
			case "price1":
				console.log('2')
				return this.setState({price1: value})
			case "price2":
				console.log('3')
				return this.setState({price2: value})
			case "price3":
				return this.setState({price3: value})
			case "price4":
				return this.setState({price4: value})
			case "price5":
				return this.setState({price5: value})
			case "price6":
				return this.setState({price6: value})
			case "price7":
				return this.setState({price7: value})
			case "price8":
				return this.setState({price8: value})
			default:
				return 'aaa'
		}
	}

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
			cate,
		} = this.props;
		item.companyId = user._id;
		item.companyName = user.name;
		let aa = []
		this.state.price && aa.push(parseInt(this.state.price))
		this.state.price1 && aa.push(parseInt(this.state.price1))
		this.state.price2 && aa.push(parseInt(this.state.price2))
		this.state.price3 && aa.push(parseInt(this.state.price3))
		this.state.price4 && aa.push(parseInt(this.state.price4))
		this.state.price5 && aa.push(parseInt(this.state.price5))
		this.state.price6 && aa.push(parseInt(this.state.price6))
		this.state.price7 && aa.push(parseInt(this.state.price7))
		this.state.price8 && aa.push(parseInt(this.state.price8))
		if(aa.length > 0 && item.price.length > 0) {
			console.log("True")
			try{
				aa.map((it, index)=>{
					item.price[index] = it
				})
			}catch (e){
				console.log("Aldaa", e)
			}
		}else if(item.price.length > 0) {
			console.log("else")
			try{
				aa.map((it, index)=>{
					item.price[index] = it
				})
			}catch (e){
				console.log("Aldaa", e)
			}
		}else {
			item.price = aa
		}
		let newArr = []
		if (user.role === "admin") {
			newArr = items
		} else {
			newArr = items.filter(function (it) {
				return it.companyId === user._id
			})
		}
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
				title: "Нэр",
				key: "title",
				dataIndex: "title",
			},
			{
				title: "company Нэр",
				key: "companyName",
				dataIndex: 'companyName',
			},
			{
				title: "Үнэ",
				dataIndex: "price",
				key: "price",
				render: price => (
					<React.Fragment>
						{price.map(tag => {
							let color = tag.length > 5 ? 'geekblue' : 'green';
							if (tag === 'loser') {
								color = 'volcano';
							}
							return (
								<Tag color={color} key={tag}>
									{tag}
								</Tag>
							);
						})}
					</React.Fragment>
				),
			},
			{
				title: "Тайлбар",
				key: "desc",
				dataIndex: "desc",
			},
			{
				title: 'Төлөв',
				key: "torol",
				dataIndex: "torol"
			},
			{
				title: 'Ангилал',
				key: 'category.title',
				dataIndex: 'category.title',
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
				title="Бэлгийн картууд"
				bordered={false}
				extra={
					user.role !== "admin" ? (
						<Button icon="plus" onClick={this.showModal.bind(this, 0)}>
							Нэмэх
						</Button>) : null
				}
			>
				<Table
					size="small"
					bordered={false}
					onChange={() => this.onPaginate()}
					pagination={pagination}
					rowKey={(record) => record._id}
					columns={columns}
					dataSource={newArr}
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
							<Form.Item label="Нэр title">
								<Input
									name="title"
									value={item.title}
									onChange={this.changeHandler.bind(this)}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item label="Нэр desc">
								<Input
									name="desc"
									value={item.desc}
									onChange={this.changeHandler.bind(this)}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item label="Хаяг">
								<Input
									name="address"
									value={item.address}
									onChange={this.changeHandler.bind(this)}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item label="Утасны дугаар">
								<Input
									name="phone"
									value={item.phone}
									onChange={this.changeHandler.bind(this)}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Үнэ ">
								<Input
									name="price0"
									value={item.price[0]}
									onChange={(e) => this.onHandle("price", e.target.value)}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Үнэ 1">
								<Input
									name="price1"
									value={item.price[1]}
									onChange={(e) => this.onHandle("price1", e.target.value)}
								/>
							</Form.Item>
						</Col>
						{
							this.state.arr && this.state.arr
						}
						<Col span={12}>

							<Form.Item>
								<Button type="dashed" onClick={this.add} style={{width: '60%'}}>
									<Icon type="plus"/> Add field
								</Button>
							</Form.Item>

						</Col>
						<Col span={20}>
							<Form.Item label="Төлөв">
								<Select
									style={{width: "100%"}}
									value={item.torol}
									name="torol"
									onChange={this.changeHandler.bind(
										this,
										"torol"
									)}
								>
									{
										user.role === 'admin' ? (
											<Select.Option value='trend'>Тренд болж байгаа</Select.Option>
										) : (
											<Select.Option value='sale'>Хямдралтай байгаа</Select.Option>
										)
									}
									<Select.Option value='null'>Төлөв хоосон</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={20}>
							<Form.Item label="Ангилал   ">
								<Select
									style={{width: "100%"}}
									value={item.category}
									name="category"
									onChange={this.changeHandler.bind(
										this,
										"category"
									)}
								>
									{
										cate.map((c, index) => (
											<Select.Option value={c._id}>{c.title}</Select.Option>
										))
									}
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
		items: state.product.items,
		loading: state.product.loading,
		modal: state.product.modal,
		item: state.product.item,
		all: state.product.all,
		confirmLoading: state.product.confirmLoading,
		itemLoading: state.product.itemLoading,
		user: state.main.user,
		cate: state.cates.categories,
	};
}

export default connect(mapStateToProps)(Product);
