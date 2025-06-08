import { IOrder, Product } from '../types/index';
import { IApi } from '../types';
import { ApiListResponse } from './base/api';

export class AppApi {
	private _baseApi: IApi;
	private cdn: string;

	constructor(cdn: string, baseApi: IApi) {
		this._baseApi = baseApi;
		this.cdn = cdn;
	}

	getItemList(): Promise<Product[]> {
		return this._baseApi
			.get<ApiListResponse<Product>>(`/product`)
			.then((response) =>
				response.items.map((product) => ({
					...product,
					image: this.cdn + product.image,
				}))
			);
	}

	getProduct(id: string): Promise<Product> {
		return this._baseApi
			.get<Product>(`/product/${id}`)
			.then((product) => ({
				...product,
				image: this.cdn + product.image,
			}));
	}

	postOrder(order: IOrder): Promise<IOrder> {
		return this._baseApi
			.post<IOrder>('/order', order)
			.then((data: IOrder) => data);
	}
}
