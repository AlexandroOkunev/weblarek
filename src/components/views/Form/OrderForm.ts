import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IForm } from "./Form";
import { TPayment } from "../../../types";

export interface IOrderForm extends IForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.paymentButtons = Array.from(
            this.container.querySelectorAll<HTMLButtonElement>(".button_alt")
        );

        this.addressInput = ensureElement<HTMLInputElement>(
            'input[name="address"]',
            this.container
        );

        this.paymentButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.events.emit("order:payment", {
                    payment: button.name as TPayment,
                });
            });
        });

        this.addressInput.addEventListener("input", () => {
            this.events.emit("order:address", {
                value: this.addressInput.value,
            });
        });
    }

    set payment(value: TPayment) {
        this.paymentButtons.forEach(button => {
            button.classList.toggle(
                "button_alt-active",
                button.name === value
            );
        });
    }

    set address(value: string) {
        if (this.addressInput.value !== value) {
            this.addressInput.value = value;
        }
    }
}