import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

export interface ICardPreview extends ICard {
    deccription: string;
    isLocked: boolean;
}

export class CardPreview extends Card {
    protected cardDescription: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.cardDescription = ensureElement<HTMLElement>(
            ".card__text",
            this.cardElement
        );

        this.cardButton = ensureElement<HTMLButtonElement>(
            ".card__button",
            this.cardElement
        );

        this.cardButton.addEventListener("click", () => {
            this.events.emit("card:add", {
                id: this.cardElement.dataset.id ?? "",
            });
        });
    }

    set description(value: string) {
        this.cardDescription.textContent = value;
    }

    set isLocked(value: boolean) {
        this.cardButton.disabled = value;
    }
}