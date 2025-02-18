/**
 * Интерфейс описывает структуру объекта товара.
 */
export interface Product {
  /** Уникальный идентификатор товара */
  id: string;

  /** Описание товара */
  description: string;

  /** URL изображения товара */
  image: string;

  /** Название товара */
  title: string;

  /** Категория, к которой относится товар */
  category: string;

  /** Цена товара (может быть null, если товар недоступен) */
  price: number | null;
}

/** Класс-заглушка для UUID */
class UUID {}

/**
 * Интерфейс карточки товара, расширяет `Product`.
 */
export interface ProductCard extends Product {
  /** Опциональный индекс товара в списке */
  index?: number;
}

/**
 * Интерфейс формы заказа.
 */
export interface OrderForm {
  /** Адрес доставки */
  address: string;

  /** Способ оплаты */
  payment: string;
}

/**
 * Интерфейс контактной формы.
 */
export interface ContactForm {
  /** Электронная почта пользователя */
  email: string;

  /** Номер телефона пользователя */
  phoneNumber: string;
}

/**
 * Объединенный интерфейс формы заказа и контактной формы.
 * Используется для объединенного представления данных заказа.
 */
export interface MergedForm extends OrderForm, ContactForm {}

/**
 * Интерфейс заказа, включает данные о пользователе, список товаров и итоговую сумму.
 */
export interface Order extends MergedForm {
  /** Итоговая сумма заказа */
  total: number;

  /** Список уникальных идентификаторов товаров в заказе */
  items: UUID[];
}

/**
 * Тип для хранения ошибок, связанных с формой заказа.
 */
export type OrderFormError = Partial<Record<keyof OrderForm, string>>;

/**
 * Тип для хранения ошибок, связанных с контактной формой.
 */
export type ContactFormError = Partial<Record<keyof ContactForm, string>>;

/**
 * Интерфейс состояния приложения.
 * Определяет структуру данных, используемых в приложении.
 */
export interface AppState {
  /** Каталог товаров, загруженный с сервера */
  catalog: Product[];

  /** Товары, добавленные пользователем в корзину */
  basket: Product[];

  /** Данные текущего заказа */
  order: Order;

  /** Ошибки, возникшие при заполнении формы заказа */
  orderFormErrors: OrderFormError;

  /** Ошибки, возникшие при заполнении контактной формы */
  contactFormErrors: ContactFormError;

  /** Товар для предварительного просмотра в модальном окне */
  preview: Product | null;
}

/**
 * Интерфейс главной страницы приложения.
 * Определяет структуру данных, используемых для управления отображением товаров и корзины.
 */
export interface MainPage {
  /** Количество товаров в корзине */
  cartCount: number;

  /** Массив элементов товаров, представленных на странице */
  productElements: HTMLElement[];

  /** Флаг блокировки страницы (например, при открытии модального окна) */
  locked: boolean;
}

/**
 * Интерфейс ответа сервера после оформления заказа.
 */
export interface OrderResponse {
  /** Уникальный идентификатор заказа */
  id: UUID;

  /** Итоговая сумма заказа */
  total: number;
}

/**
 * Типизированный ответ API, используемый для возврата списка элементов.
 */
export type ApiResponseList<T> = {
  /** Общее количество элементов в списке */
  total: number;

  /** Массив элементов указанного типа */
  items: T[];
};

/**
 * Тип формы, используемой в приложении.
 * Определяет возможные формы для валидации и обработки.
 */
export type FormType = 'order' | 'contacts';
