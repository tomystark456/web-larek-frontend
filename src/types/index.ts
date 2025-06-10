export interface Product {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IBasket {
	id: string;
	title: string;
	price: number;
	count?: number;
}

export interface IOrder {
	total: number;
	items: string[];
	email: string;
	phone: string;
	address: string;
	payment: PaymentType;
}

export interface IAppState {
	catalog: Product[];
	basket: IBasket[];
	order: IOrder;
	orderFormErrors: TFormErrors;
	contactFormErrors: TFormErrors;
}

export type TOrderInput = Pick<
	IOrder,
	'payment' | 'address' | 'email' | 'phone'
>;

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContact = Pick<IOrder, 'email' | 'phone'>;

export type PaymentType = 'card' | 'cash';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}


export interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

export interface IFormValidator {
	valid: boolean;
	errors: string;
}

export interface IApi {
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: string): Promise<T>;
}

export type ProductBasket = Pick<Product, 'id' | 'title' | 'price'>;
