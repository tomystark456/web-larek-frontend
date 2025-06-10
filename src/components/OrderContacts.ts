import { TOrderContact } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';

export class OrderContacts extends Form<TOrderContact> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._email = container.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		this._phone = container.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;

		this._email.addEventListener('input', () => {
			events.emit('order:change', {
				field: 'email',
				value: this._email.value
			});
			this.checkValid();
		});

		this._phone.addEventListener('input', () => {
			events.emit('order:change', {
				field: 'phone',
				value: this._phone.value
			});
			this.checkValid();
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			if (this.valid) {
				events.emit('contacts:submit');
			}
		});
	}

	set email(value: string) {
		this._email.value = value;
		this.checkValid();
	}

	set phone(value: string) {
		this._phone.value = value;
		this.checkValid();
	}

	checkValid() {
		const email = this._email.value.trim();
		const phone = this._phone.value.trim();
		let error = '';

		// Валидация email
		const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		if (!email) {
			error = 'Укажите email';
		} else if (!emailValid) {
			error = 'Некорректный email';
		}

		// Валидация телефона (10-15 цифр, допускается +)
		const phoneDigits = phone.replace(/\D/g, '');
		const phoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 15;
		if (!phone) {
			error = 'Укажите телефон';
		} else if (!phoneValid) {
			error = 'Некорректный телефон';
		}

		this.errors = error;
		this.valid = !error;
	}

	cleanFieldValues(): void {
		this._email.value = '';
		this._phone.value = '';
		this.checkValid();
	}
}
