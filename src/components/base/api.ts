import { IApi } from '../../types';

export type ApiListResponse<T> = {
	total: number;
	items: T[];
};

export class Api implements IApi {
	private baseUrl: string;
	private options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
		};
	}

	protected handleResponse<T>(response: Response): Promise<T> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	get<T>(uri: string): Promise<T> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then((response) => this.handleResponse<T>(response));
	}

	post<T>(uri: string, data: object, method: string = 'POST'): Promise<T> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then((response) => this.handleResponse<T>(response));
	}
}
