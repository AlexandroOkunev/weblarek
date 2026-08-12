import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

export interface ICardPreview extends ICard {
    description: string;
    isLocked: boolean;
}

export class CardPreview extends Card<ICardPreview> {
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
            const id = this.cardElement.dataset.id ?? "";
            this.events.emit("card:add", { id });
        });
    }

    set description(value: string) {
        this.cardDescription.textContent = value;
    }

    set isLocked(value: boolean) {
        this.cardButton.textContent = value
            ? "Удалить из корзины"
            : "В корзину";
    }

    set price(value: number | null) {
        super.price = value;

        if (value === null) {
            this.cardButton.textContent = "Недоступно";
            this.cardButton.disabled = true;
        } else {
            this.cardButton.disabled = false;
        }
    }
}