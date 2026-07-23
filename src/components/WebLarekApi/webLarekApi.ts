import { IApi, IProductsResponse, IOrder, IOrderResult} from "../../types";

export class WebLarekApi {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    };

    getProductList(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>("/product/");
    };

    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>("/order/", order);    
    };
}