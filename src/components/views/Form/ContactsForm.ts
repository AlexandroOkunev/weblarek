import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IForm } from "./Form";

export interface IContactsForm extends IForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.emailInput = ensureElement<HTMLInputElement>(
            'input[name="email"]',
            this.container
        );

        this.phoneInput = ensureElement<HTMLInputElement>(
            'input[name="phone"]',
            this.container
        );

        this.emailInput.addEventListener("input", () => {
            this.events.emit("contacts:email", {
                value: this.emailInput.value,
            });
        });

        this.phoneInput.addEventListener("input", () => {
            this.events.emit("contacts:phone", {
                value: this.phoneInput.value,
            });
        });
    }

    set email(value: string) {
        if (this.emailInput.value !== value) {
            this.emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this.phoneInput.value !== value) {
            this.phoneInput.value = value;
        }
    }
}