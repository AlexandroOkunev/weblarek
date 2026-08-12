import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
    items: HTMLElement[];
    totalPrice: number;
}

export class Basket extends Component<IBasket> {
    protected events: IEvents;
    protected basketElement: HTMLElement;
    protected basketListElement: HTMLElement;
    protected basketPriceElement: HTMLElement;
    protected checkoutButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.events = events;
        this.basketElement = this.container;
        this.basketListElement = ensureElement<HTMLElement>(
            ".basket__list",
            this.basketElement
        );

        this.basketPriceElement = ensureElement<HTMLElement>(
            ".basket__price",
            this.basketElement
        );

        this.checkoutButton = ensureElement<HTMLButtonElement>(
            ".basket__button",
            this.basketElement
        );

        this.checkoutButton.addEventListener("click", () => {
            this.events.emit("basket:checkout");
        });
    }

    set items(elements: HTMLElement[]) {
        this.basketListElement.replaceChildren(...elements);
    }

    set totalPrice(value: number) {
        this.basketPriceElement.textContent = `${value} синапсов`
    }
}
