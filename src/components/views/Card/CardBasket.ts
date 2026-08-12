import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

export interface ICardBasket extends ICard {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement, onRemove: () => void) {
        super(events, container);

        this.indexElement = ensureElement<HTMLElement>(
            ".basket__item-index",
            this.container
        );

        this.deleteButton = ensureElement<HTMLButtonElement>(
            ".basket__item-delete",
            this.container
        );

        this.deleteButton.addEventListener("click", onRemove);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}