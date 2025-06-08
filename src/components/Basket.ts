import { ProductBasket } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export interface IBasket {
	items: HTMLElement[];
	total: number | null;
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:open');
			});
		}
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement('p', { textContent: 'Корзина пуста' })
			);
		}
		this.updateButtonState();
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
		this.updateButtonState();
	}

	private updateButtonState() {
		const totalPrice = parseFloat(this._total.textContent || '0');
		if (totalPrice > 0) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}
}
