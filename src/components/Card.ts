import { ICardActions } from '../types';
import { categories } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export interface ICard {
	id: string;
	category: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
	selected: boolean;
	buttonText: string;
	index?: number;
}

export abstract class BaseCard extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._button = container.querySelector(`.card__button`);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: string | null) {
		if (this._price) {
			if (value == null) {
				this.setDisabled(this._button, true);
				this.setText(this._price, 'Бесценно');
				this.setText(this._button, 'Нельзя купить');
			} else {
				this.setDisabled(this._button, false);
				this.setText(this._price, `${value} синапсов`);
			}
		}
	}
}

export class Card extends BaseCard {
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._category = container.querySelector(`.card__category`);
		this._image = container.querySelector(`.card__image`);
		this._description = container.querySelector(`.card__text`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		const categoryClass = categories.get(value) || '';
		this.toggleClass(this._category, categoryClass, true);
	}

	set buttonText(value: string) {
        this._button.textContent = value;
    }
}

export class BasketCard extends BaseCard {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);

		if (actions && actions.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}