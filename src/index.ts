import './scss/styles.scss';
import { IEvents, EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Card, BasketCard } from './components/Card';
import { Modal } from './components/Modal';
import { IApi, Product, IOrder, PaymentType, ProductBasket } from './types/index';
import { AppApi } from './components/AppApi';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { OrderContacts } from './components/OrderContacts';
import { OrderPayment } from './components/OrderPayment';
import { Success } from './components/Success';
import { AppState } from './components/AppState';

type StringOrderFields = Extract<keyof IOrder, 'email' | 'phone' | 'address' | 'payment'>;

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(CDN_URL, baseApi);
const events: IEvents = new EventEmitter();

const appState = new AppState(events);

const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalContainerTemplate = ensureElement<HTMLTemplateElement>('#modal-container');

const page = new Page(document.body, events);
const modal = new Modal(modalContainerTemplate, events);

// Инициализация каталога
api.getItemList()
    .then((items: Product[]) => {
        appState.setCatalog(items);
    })
    .catch((err: Error) => {
        console.error(err);
    });

// Обработчики событий
events.on('card:select', (item: Product) => {
    appState.savePreview(item);
    modal.render({
        content: new Card(cloneTemplate(cardPreviewTemplate), {
            onClick: () => {
                appState.addBasket(item);
                modal.close();
            },
        }).render({
            title: item.title,
            image: item.image,
            description: item.description,
            category: item.category,
            price: item.price,
        }),
    });
});

events.on('basket:open', () => {
    const basketItems = appState.getBasket().map((item, index) => {
        const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', item),
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    modal.render({
        content: new Basket(cloneTemplate(basketTemplate), events).render({
            items: basketItems,
            total: appState.getTotalBasket(),
        }),
    });
});

events.on('basket:remove', (item: ProductBasket) => {
    appState.deleteBasket(item.id);
});

events.on('order:open', () => {
    modal.render({
        content: new OrderPayment(cloneTemplate(orderTemplate), events).render({
            valid: false,
            errors: '',
        }),
    });
});

events.on('order:change', (data: { field: string; value: string }) => {
    appState.setOrderField(data.field as StringOrderFields, data.value);
});

events.on('order:submit', () => {
    if (appState.validatePaymentForm()) {
        modal.render({
            content: new OrderContacts(cloneTemplate(contactsTemplate), events).render({
                valid: false,
                errors: '',
            }),
        });
    }
});

events.on('contacts:submit', () => {
    if (appState.validateContactForm()) {
        api.postOrder(appState.prepareOrder())
            .then(() => {
                modal.render({
                    content: new Success(cloneTemplate(orderSuccessTemplate), {
                        onClick: () => {
                            modal.close();
                            appState.cleanBasketState();
                            appState.cleanOrder();
                        },
                    }).render({
                        total: appState.getTotalBasket(),
                    }),
                });
            })
            .catch((err: Error) => {
                console.error(err);
            });
    }
});

events.on('success:close', () => {
    modal.close();
    appState.cleanBasketState();
    appState.cleanOrder();
});

events.on('basket:changed', () => {
    page.counter = appState.getNumberBasket();
    
    // Обновляем содержимое корзины, если она открыта
    const basketItems = appState.getBasket().map((item, index) => {
        const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', item),
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    const basket = document.querySelector('.basket') as HTMLElement;
    if (basket) {
        new Basket(basket, events).render({
            items: basketItems,
            total: appState.getTotalBasket(),
        });
    }
});

events.on('catalog:changed', () => {
    page.catalog = appState.getCatalog().map((item) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });
});

events.on('formErrors:changed', (errors: Record<string, string>) => {
    const errorMessage = Object.values(errors).join('; ');
    const form = document.querySelector('form[name="order"]');
    if (form) {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
            submitButton.disabled = Object.keys(errors).length > 0;
        }
        const errorElement = form.querySelector('.form__errors');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }
});
