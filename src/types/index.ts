export interface Product {
  productId: string;
  description: string;
  imageUrl: string;
  name: string;
  category: string;
  price: number | null;
}

export interface ProductCard extends Product {
  index?: number;
}

export interface OrderForm {
  address: string;
  paymentMethod: string;
}

export interface ContactForm {
  email: string;
  phoneNumber: string;
}

export interface MergedForm extends OrderForm, ContactForm {}

export type UUID = string;

export interface Order extends MergedForm {
  total: number;
  productIds: UUID[];
}

export type OrderFormError = Partial<Record<keyof OrderForm, string>>;
export type ContactFormError = Partial<Record<keyof ContactForm, string>>;

export interface AppState {
  catalog: Product[];
  basket: Product[];
  order: Order;
  orderFormErrors: OrderFormError;
  contactFormErrors: ContactFormError;
}

export interface MainPage {
  cartCount: number;
  productElements: HTMLElement[];
}

export interface OrderResponse {
  id: UUID;
  total: number;
}

export type ApiResponseList<T> = {
  total: number;
  items: T[];
};

export type FormType = 'order' | 'contacts';
