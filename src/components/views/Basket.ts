import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
    items: HTMLElement[];
    totalPrice: number;
    isEmpty: boolean;
}

export class Basket extends Component<IBasket> {
    protected events: IEvents;
    protected basketListElement: HTMLElement;
    protected basketPriceElement: HTMLElement;
    protected checkoutButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.events = events;

        this.basketListElement = ensureElement<HTMLElement>(
            ".basket__list",
            this.container
        );

        this.basketPriceElement = ensureElement<HTMLElement>(
            ".basket__price",
            this.container
        );

        this.checkoutButton = ensureElement<HTMLButtonElement>(
            ".basket__button",
            this.container
        );

        this.checkoutButton.addEventListener("click", () => {
            this.events.emit("basket:checkout");
        });
    }

    set items(elements: HTMLElement[]) {
        this.basketListElement.replaceChildren(...elements);
    }

    set totalPrice(value: number) {
        this.basketPriceElement.textContent = `${value} синапсов`;
    }

    set isEmpty(value: boolean) {
        this.checkoutButton.disabled = value;
    }
}