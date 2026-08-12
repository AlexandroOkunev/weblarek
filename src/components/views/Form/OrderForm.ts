import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IForm } from "./Form";

export interface IOrderForm extends IForm {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.paymentButtons = Array.from(
            this.formElement.querySelectorAll<HTMLButtonElement>(
                ".button_alt"
            )
        );

        this.addressInput = ensureElement<HTMLInputElement>(
            'input[name="address"]',
            this.formElement
        );

        this.paymentButtons.forEach(buttton => {
            buttton.addEventListener("click", () => {
                this.events.emit("order:payment", {
                    payment: buttton.name,
                });
            });
        });

        this.addressInput.addEventListener("input", () => {
            this.events.emit("order:address", {
                value: this.addressInput.value,
            });
        });

        this.formElement.addEventListener("submit", event => {
            event.preventDefault();
            this.events.emit("order:submit");
        });
    }

    set payment(value: string) {
        this.paymentButtons.forEach(button => {
            button.classList.toggle(
                "button_alt-active",
                button.name === value
            );
        });
    }

    set address(value: string) {
        if (this.addressInput.value !==value) {
            this.addressInput.value = value;
        }
    }
}