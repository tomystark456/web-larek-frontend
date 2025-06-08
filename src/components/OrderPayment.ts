import { TOrderPayment } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';

export class OrderPayment extends Form<TOrderPayment> {
	protected _buttonOnline: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._address = container.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;
		this._buttonCash = container.querySelector(
			'button[name="cash"]'
		) as HTMLButtonElement;
		this._buttonOnline = container.querySelector(
			'button[name="card"]'
		) as HTMLButtonElement;

		this._address.addEventListener('input', () => {
			events.emit('order:change', {
				field: 'address',
				value: this._address.value
			});
			this.checkValid();
		});

		if (this._buttonOnline) {
			this._buttonOnline.addEventListener('click', () => {
				this.togglePayment(this._buttonOnline);
				events.emit('order:change', {
					field: 'payment',
					value: this._buttonOnline.name
				});
				this.checkValid();
			});
		}

		if (this._buttonCash) {
			this._buttonCash.addEventListener('click', () => {
				this.togglePayment(this._buttonCash);
				events.emit('order:change', {
					field: 'payment',
					value: this._buttonCash.name
				});
				this.checkValid();
			});
		}

		// Добавляем обработчик отправки формы
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			if (this.valid) {
				events.emit('order:submit');
			}
		});
	}

	set address(value: string) {
		this._address.value = value;
		this.checkValid();
	}

	togglePayment(value: HTMLElement) {
		this.resetPayment();
		this.toggleClass(value, 'button_alt-active', true);
	}

	resetPayment() {
		this.toggleClass(this._buttonCash, 'button_alt-active', false);
		this.toggleClass(this._buttonOnline, 'button_alt-active', false);
	}

	checkValid() {
		const addressFilled = this._address.value.trim().length > 0;
		const paymentSelected =
			this._buttonOnline.classList.contains('button_alt-active') ||
			this._buttonCash.classList.contains('button_alt-active');
		this.valid = addressFilled && paymentSelected;
	}

	cleanFieldValues(): void {
		this._address.value = '';
		this.resetPayment();
		this.checkValid();
	}
}
