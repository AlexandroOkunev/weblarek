import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";

export interface ICardCatalog extends ICard {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    
    constructor(events: IEvents, container: HTMLElement, onSelect: () => void) {
        super(events, container);

        this.categoryElement = ensureElement<HTMLElement>(
            ".card__category",
            this.container
        );

        this.imageElement = ensureElement<HTMLImageElement>(
            ".card__image",
            this.container
        );

        this.container.addEventListener("click", onSelect);
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
}