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
		const emailFilled = this._email.value.trim().length > 0;
		const phoneFilled = this._phone.value.trim().length > 0;
		this.valid = emailFilled && phoneFilled;
	}

	cleanFieldValues(): void {
		this._email.value = '';
		this._phone.value = '';
		this.checkValid();
	}
}
