import { getProduct, searchProduct } from "../actionTypes";
let defaultProduct = {
    name: "",
    image: "",
    desc: "",
    minprice: 0,
    maxprice: 0,
    jumpprice: 0,
    address: '',
    status: '',
    date: "",
    category: '',
    torol: '',
    companyId: '',
    companyName: '',
}
const initialState = {
    cards: defaultProduct,
    loading: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case getProduct.REQUEST:
            return {
                ...state,
                loading: true
            };
        case getProduct.RESPONSE:
            return {
                ...state,
                loading: false,
                cards: action.json.result || defaultProduct
            };
        case searchProduct.REQUEST:
            return {
                ...state,
                loading: true
            }
        case searchProduct.RESPONSE:
            console.log(action.json);
            return {
                ...state,
                loading: false,
                cards: action.json.result || defaultProduct,
            }
        default:
            // console.log("Defaults Action Product", state);
            return state;
    }
};
