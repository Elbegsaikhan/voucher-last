import React from 'react';
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
    message,
    Drawer,
    Popconfirm, Select,TreeSelect
} from 'antd';
import {connect} from 'react-redux';
import * as action from '../actions/companies_actions';
// import MapPicker from 'react-google-map-picker'
class Companies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            zoom: 10
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(action.getCompanies(this.state.current));
    };

    onPaginate(data){
        const {dispatch} = this.props;
        this.setState({current : data.current - 1});
        dispatch(action.getCompanies(data.current - 1));
    }

    changeHandler(e,value){
        const {dispatch} = this.props;
        if (value && ( typeof e === 'string' || e instanceof String)) {
            dispatch(action.changeHandler({name:e,value:value}))
        } else {
            dispatch(action.changeHandler({name:e.target.name,value:e.target.value}));
        }
    }

    showModal(id){
        const {dispatch} = this.props;
        dispatch(action.modalCompany(id));
    }

    onSave(){
        const {dispatch, item} = this.props;
        dispatch(action.saveCompany(item));
    }

    onCancel(){
        const {dispatch} = this.props;
        dispatch(action.closeModalCompany());
    }

    delete(id){
        const {dispatch} = this.props;
        dispatch(action.deleteCompany(id));
    }

    onImageUpload(blobInfo, success, failure){
        let xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', "/dashboard/api/upload/direct");

        xhr.onload = function() {
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
        formData.append('image', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
    }

    handleChange = (info) => {
        const {dispatch} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            dispatch(action.changeHandler({name: 'image', value: info.file.response.image}));
            dispatch(action.changeHandler({name: 'newImage', value: true}))
        }
        if (info.file.status === 'error') {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    handleChangeLogo = (info) => {
        console.log(info)
        const {dispatch} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({uploadLoading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            dispatch(action.changeHandler({name: 'logo', value: info.file.response.image}));
            dispatch(action.changeHandler({name: 'newLogo', value: true}))
        }
        if (info.file.status === 'error') {
            this.setState({uploadLoading: false});
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    handleLocationChange({ position, address, places }) {
        this.setState({ position, address });
    }

    render() {
        const {user, all, items, loading, confirmLoading ,itemLoading, item, modal, categories, locations} = this.props;
        console.log("User", items)
        const uploadButton = (
            <div>
                <Icon type={this.state.uploadLoading ? 'loading' : 'inbox'} />
                <p className="ant-upload-text">Зураг</p>
            </div>
        );
        let pagination = {
            total : all,
            current: this.state.current + 1,
            pageSize : 30,
            position: 'bottom'
        };
        const columns = [{
            title: '№',
            width: 60,
            key: 'index',
            render: (text, record, index) => (
                (this.state.current * 30) + index + 1
            )
        }, {
            title: 'Лого',
            width: 80,
            key: 'logo',
            dataIndex: 'logo',
            render: (text, record, index) => (
                text ? <img src={text} height={30} width={60} style={{objectFit: 'cover', borderRadius: 3, border: '1px solid #d0d0d0'}} alt=""/> : null
            )
        }, {
            title: 'Нэр',
            key: 'name',
            dataIndex: 'name'
        },
        {
        title: 'Төлөв',
        key: 'status',
        dataIndex: 'status',
        render: (text, record, index) => (
            text === 'pending' ? 'Хүлээгдэж байна' : text === 'active' ? 'Идэвхитэй' : null
        )
        }, {
            title: 'Үйлдэл',
            width: 250,
            key: 'action',
            render: (text, record) => (
                <React.Fragment>
                    <Button onClick={this.showModal.bind(this, record._id)} size="small" type="default" icon="edit" disabled={itemLoading}>Засах</Button>
                    {
                        user.role == 'admin' ?
                        <Popconfirm title="Та устгахдаа итгэлтэй байна уу" onConfirm={this.delete.bind(this,record._id)} okText="Тийм" cancelText="Үгүй">
                            <Button style={{marginLeft: 15}} size="small" type="danger" icon="delete" disabled={itemLoading}>Устгах</Button>
                        </Popconfirm>
                        : null
                    }
                </React.Fragment>
            )
        }];
        return (
            <Card className="full-card" title='Байгууллага' bordered={false}
                // extra={
                //     [<Button icon="plus" onClick={this.showModal.bind(this, 0)}>Нэмэх</Button>]
                // }
            >
                <Table
                    size="small"
                    bordered={false}
                    onChange={() => this.onPaginate()}
                    pagination={pagination}
                    rowKey={record => record._id}
                    columns={columns}
                    dataSource={items}
                    loading={loading}
                />
                <Drawer
                    title={item._id === 0 ? 'Нэмэх' : 'Засах'}
                    visible={modal}
                    closable={false}
                    maskClosable={false}
                    width={'70%'}
                >
                    <Row gutter={30}>
                        <Col span={6}>
                            <Form.Item
                                label="Лого"
                                help="400x400"
                            >
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    multiple={false}
                                    action="/api/image/upload/logo"
                                    onChange={(e) => this.handleChangeLogo(e)}
                                >
                                    {
                                        item.logo ?
                                            <img width={'100%'} src={item.logo} alt="image"/>
                                            : uploadButton
                                    }
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={18}>
                            <Row gutter={15}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Нэр"
                                    >
                                        <Input name="name" value={item.name} onChange={this.changeHandler.bind(this)}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Танилцуулга"
                                    >
                                        <Input
                                            name="bio"
                                            value={item.bio}
                                            style={{width: '100%'}}
                                            onChange={this.changeHandler.bind(this)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Имэйл"
                                    >
                                        <Input name="email" value={item.email} onChange={this.changeHandler.bind(this)}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Утас"
                                    >
                                        <Input
                                            name="phone"
                                            value={item.phone}
                                            style={{width: '100%'}}
                                            onChange={this.changeHandler.bind(this)}
                                        />
                                    </Form.Item>
                                </Col>
                                {
                                    user.role === 'admin' ? (
                                        <Col span={12}>
                                            <Form.Item
                                                label="Линк"
                                                help="text-company-slug"
                                            >
                                                <Input name="slug" value={item.slug} onChange={this.changeHandler.bind(this)}/>
                                            </Form.Item>
                                        </Col>
                                    ) : null
                                }
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Col span={6}>
                            <Form.Item
                                label="Толгой зураг"
                                help="1100x400, Толгой зурагт заавал байгууллагын лого мөн гишүүнчлэлийн icon -ноо байршуулсан байх шаардлагатай"
                            >
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    multiple={false}
                                    action="/api/image/upload"
                                    onChange={::this.handleChange}
                                >
                                    {
                                        item.image ?
                                            <img width={'100%'} src={item.image} alt="image"/>
                                            : uploadButton
                                    }
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={18}>
                            <Row gutter={15}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Банкны нэр"
                                        help="суралцагчийн төлбөр хүлээн авахад ашиглагдана"
                                    >
                                        <Input name="bankName" value={item.bankName} onChange={this.changeHandler.bind(this)}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Дансны дугаар"
                                        help="суралцагчийн төлбөр хүлээн авахад ашиглагдана"
                                    >
                                        <Input
                                            name="account"
                                            value={item.account}
                                            style={{width: '100%'}}
                                            onChange={this.changeHandler.bind(this)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Данс эзэмшигчийн нэр"
                                        help="суралцагчийн төлбөр хүлээн авахад ашиглагдана"
                                    >
                                        <Input name="accountName" value={item.accountName} onChange={this.changeHandler.bind(this)}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Social Link"
                                    >
                                        <Input
                                            name="facebook"
                                            value={item.facebook}
                                            style={{width: '100%'}}
                                            onChange={this.changeHandler.bind(this)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/*<Row gutter={15}>*/}
                            {/*    <Col span={12}>*/}
                            {/*        <Form.Item*/}
                            {/*            label="Instagram Link"*/}
                            {/*        >*/}
                            {/*            <Input name="instagram" value={item.instagram} onChange={this.changeHandler.bind(this)}/>*/}
                            {/*        </Form.Item>*/}
                            {/*    </Col>*/}
                            {/*    <Col span={12}>*/}
                            {/*        <Form.Item*/}
                            {/*            label="Youtube Link"*/}
                            {/*        >*/}
                            {/*            <Input*/}
                            {/*                name="youtube"*/}
                            {/*                value={item.youtube}*/}
                            {/*                style={{width: '100%'}}*/}
                            {/*                onChange={this.changeHandler.bind(this)}*/}
                            {/*            />*/}
                            {/*        </Form.Item>*/}
                            {/*    </Col>*/}
                            {/*</Row>*/}
                            <Row gutter={15}>
                                {/*<Col span={12}>*/}
                                {/*    {categories && categories.length > 0 ?*/}
                                {/*        <Form.Item*/}
                                {/*            label='Ангилал'*/}
                                {/*        >*/}
                                {/*            <TreeSelect*/}
                                {/*                name='category'*/}
                                {/*                showSearch*/}
                                {/*                style={{ width: '100%' }}*/}
                                {/*                value={item.category ? item.category : []}*/}
                                {/*                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}*/}
                                {/*                placeholder="Please select"*/}
                                {/*                multiple*/}
                                {/*                treeDefaultExpandAll={false}*/}
                                {/*                onChange={this.changeHandler.bind(this, 'category')}*/}
                                {/*            >*/}
                                {/*                {categories.map( run =>*/}
                                {/*                    <TreeSelect.TreeNode value={run._id} title={run.title} key={run._id}>*/}
                                {/*                        {*/}
                                {/*                            (run.child || []).length > 0 ? (*/}
                                {/*                                run.child.map( run1 =>*/}
                                {/*                                    <TreeSelect.TreeNode value={run1._id} title={run1.title} key={run1._id}/>*/}
                                {/*                                )*/}
                                {/*                            ) : null*/}
                                {/*                        }*/}
                                {/*                        <TreeSelect.TreeNode value="leaf1" title="my leaf" key="random" />*/}
                                {/*                    </TreeSelect.TreeNode>*/}
                                {/*                )}*/}
                                {/*            </TreeSelect>*/}
                                {/*        </Form.Item>*/}
                                {/*        :*/}
                                {/*        null*/}
                                {/*    }*/}
                                {/*</Col>*/}
                                <Col span={12}>
                                    {locations && locations.length > 0 ?
                                        <Form.Item
                                            label='Байршил'
                                        >
                                            <Select style={{width: '100%'}} value={item.location ? item.location : ''} name='location' onChange={this.changeHandler.bind(this, 'location')}>
                                                <Select.Option value=''>Байршил сонгох</Select.Option>
                                                {locations.map( run =>
                                                    <Select.Option value={run._id}>{run.title}</Select.Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                        :
                                        null
                                    }
                                </Col>
                            </Row>
                            {
                                user.role === 'admin' ? (
                                    <React.Fragment>
                                        <Row gutter={15}>
                                            {/*<Col span={12}>*/}
                                            {/*    <Form.Item*/}
                                            {/*        label='Төрөл'*/}
                                            {/*    >*/}
                                            {/*        <Select style={{width: '100%'}} value={item.membership ? item.membership : ''} name='membership' onChange={this.changeHandler.bind(this, 'membership')}>*/}
                                            {/*            <Select.Option value='gold'>Gold</Select.Option>*/}
                                            {/*            <Select.Option value='platinum'>Platinum</Select.Option>*/}
                                            {/*        </Select>*/}
                                            {/*    </Form.Item>*/}
                                            {/*</Col>*/}
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Төлөв'
                                                >
                                                    <Select style={{width: '100%'}} value={item.status ? item.status : ''} name='status' onChange={this.changeHandler.bind(this, 'status')}>
                                                        <Select.Option value='pending'>Хүлээгдэж буй</Select.Option>
                                                        <Select.Option value='active'>Идэвхитэй</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                ) : null
                            }
                            {/*<MapPicker defaultLocation={item.position}*/}
                            {/*           zoom={this.state.zoom}*/}
                            {/*           style={{height:'700px'}}*/}
                            {/*           onChangeLocation={this.handleLocationChange}*/}
                            {/*           onChangeZoom={(e) => this.setState({zoom: e})}*/}
                            {/*           apiKey='AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8'/>*/}
                        </Col>
                    </Row>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e8e8e8',
                            padding: '10px 16px',
                            textAlign: 'right',
                            left: 0,
                            background: '#fff',
                            borderRadius: '0 0 4px 4px',
                        }}
                    >
                        <Button
                            style={{
                                marginRight: 8,
                            }}
                            onClick={() => this.onCancel()} disabled={confirmLoading}
                        >
                            Болих
                        </Button>
                        <Button onClick={() => this.onSave()} disabled={confirmLoading} loading={confirmLoading} type="primary">
                            Хадгалах
                        </Button>
                    </div>
                </Drawer>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.main.user,
        items: state.companies.items,
        loading: state.companies.itemsLoading,
        modal: state.companies.itemModal,
        item: state.companies.item,
        all: state.companies.all,
        confirmLoading: state.companies.confirmLoading,
        itemLoading: state.companies.itemLoading,
        categories: state.companies.categories,
        locations: state.companies.locations
    }
}

export default connect(mapStateToProps)(Companies);
