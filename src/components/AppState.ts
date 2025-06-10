import { IEvents } from './base/events';
import { IAppState, Product, IBasket, IOrder, TFormErrors } from '../types';
import { Model } from './base/Model';
import { categories } from '../utils/constants';

type StringOrderFields = Extract<keyof IOrder, 'email' | 'phone' | 'address' | 'payment'>;

export class AppState extends Model<IAppState> {
	protected catalog: Product[] = [];
	protected basket: IBasket[] = [];
	protected order: IOrder = {
		total: 0,
		items: [],
		email: '',
		phone: '',
		address: '',
		payment: 'card',
	};
	protected orderFormErrors: TFormErrors = {};
	protected contactFormErrors: TFormErrors = {};
	protected preview: string | null = null;

	constructor(events: IEvents) {
		super({}, events);
	}

	setCatalog(items: Product[]) {
		this.catalog = items;
		this.emitChanges('catalog:changed');
	}

	getCatalog(): Product[] {
		return this.catalog;
	}

	savePreview(item: Product) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	addBasket(item: Product) {
		const existingItem = this.basket.find(basketItem => basketItem.id === item.id);
		if (existingItem) {
			return;
		}
		
		const basketItem: IBasket = {
			id: item.id,
			title: item.title,
			price: item.price || 0,
		};
		this.basket.push(basketItem);
		this.emitChanges('basket:changed');
	}

	deleteBasket(id: string) {
		const index = this.basket.findIndex(item => item.id === id);
		if (index !== -1) {
			this.basket.splice(index, 1);
			this.emitChanges('basket:changed');
		}
	}

	getBasket(): IBasket[] {
		return this.basket;
	}

	getNumberBasket(): number {
		return this.basket.length;
	}

	getTotalBasket(): number {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	validate(formData: FormData): boolean {
		const errors: TFormErrors = {};
		const { payment, address, email, phone } = Object.fromEntries(formData.entries());

		if (!payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		if (!address) {
			errors.address = 'Укажите адрес доставки';
		}
		if (!email) {
			errors.email = 'Укажите email';
		}
		if (!phone) {
			errors.phone = 'Укажите телефон';
		}

		this.orderFormErrors = errors;
		this.emitChanges('formErrors:changed', errors);

		return Object.keys(errors).length === 0;
	}

	validatePaymentForm(): boolean {
		const errors: TFormErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Укажите адрес доставки';
		}
		this.orderFormErrors = errors;
		this.emitChanges('formErrors:changed', errors);
		return Object.keys(errors).length === 0;
	}

	validateContactForm(): boolean {
		const errors: TFormErrors = {};
		if (!this.order.email) {
			errors.email = 'Укажите email';
		}
		if (!this.order.phone) {
			errors.phone = 'Укажите телефон';
		}
		this.contactFormErrors = errors;
		this.emitChanges('formErrors:changed', errors);
		return Object.keys(errors).length === 0;
	}

	setOrderField(field: StringOrderFields, value: string) {
		if (field === 'payment' && (value !== 'card' && value !== 'cash')) {
			return;
		}
		(this.order[field] as any) = value;
		if (field === 'payment' || field === 'address') {
			this.validatePaymentForm();
		}
		if (field === 'email' || field === 'phone') {
			this.validateContactForm();
		}
		this.emitChanges('order:changed', this.order);
	}

	prepareOrder(): IOrder {
		return {
			...this.order,
			total: this.getTotalBasket(),
			items: this.getBasket().map(item => item.id)
		};
	}

	cleanBasketState() {
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	cleanOrder() {
		this.order = {
			total: 0,
			items: [],
			email: '',
			phone: '',
			address: '',
			payment: 'card',
		};
		this.orderFormErrors = {};
		this.contactFormErrors = {};
		this.emitChanges('order:changed');
	}
	getCategoryClass(category: string): string {
		return categories.get(category) || '';
	}
} 