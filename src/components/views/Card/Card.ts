import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface ICard {
    title: string;
    price: string;
}

export abstract class Card<T extends ICard = ICard> extends Component<T> {
    protected events: IEvents;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;

        this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
        this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: string) {
        this.priceElement.textContent = value;
    }
}