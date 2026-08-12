import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";

export interface ICardPreview extends ICard {
    category: string;
    image: string;
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreview> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected cardDescription: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement, onAdd: () => void) {
        super(events, container);

        this.categoryElement = ensureElement<HTMLElement>(
            ".card__category",
            this.container
        );

        this.imageElement = ensureElement<HTMLImageElement>(
            ".card__image",
            this.container
        );

        this.cardDescription = ensureElement<HTMLElement>(
            ".card__text",
            this.container
        );

        this.cardButton = ensureElement<HTMLButtonElement>(
            ".card__button",
            this.container
        );

        this.cardButton.addEventListener("click", onAdd);
    }

    set category(value: string) {
        const modifier = categoryMap[value] ?? categoryMap["другое"];
        this.categoryElement.className = "card__category";
        this.categoryElement.classList.add(modifier);
        this.categoryElement.textContent = value;
    }

    set image(value: string) {
        this.imageElement.src = value;
    }

    set description(value: string) {
        this.cardDescription.textContent = value;
    }

    set buttonText(value: string) {
        this.cardButton.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.cardButton.disabled = value;
    }
}