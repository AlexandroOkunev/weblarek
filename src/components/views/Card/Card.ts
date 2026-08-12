import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { categoryMap } from "../../../utils/constants";

export interface ICard {
    id: string;
    title: string;
    price: number | null;
    category: string;
    image: string;
}

export abstract class Card<T extends ICard = ICard> extends Component<T> {
    protected events: IEvents;
    protected cardElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement: HTMLElement | null;
    protected imageElement: HTMLImageElement | null;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.events = events;

        this.cardElement = this.container;

        this.titleElement = ensureElement<HTMLElement>(
            ".card__title",
            this.cardElement
        );

        this.priceElement = ensureElement<HTMLElement>(
            ".card__price",
            this.cardElement
        );

        this.categoryElement = this.cardElement.querySelector<HTMLElement>(".card__category");

        this.imageElement = this.cardElement.querySelector<HTMLImageElement>(".card__image");
    }

    set id(value: string) {
        this.cardElement.dataset.id = value;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? "Бесценно" : `${value} синапсов`;
    }

    set category(value: string) {
        const categoryElement = this.categoryElement;

        if (!categoryElement) {
            return;
        }

        const modifier = categoryMap[value] ?? "card__category_other";

        categoryElement.className = "card__category";
        categoryElement.classList.add(modifier);
        categoryElement.textContent = value;
    }

    set image(value: string) {
        if (!this.imageElement) {
            return;
        }
        this.imageElement.src = value;
    }
}