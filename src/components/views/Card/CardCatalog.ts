import { IEvents } from "../../base/Events";
import {Card, ICard} from "./Card";

export interface ICardCatalog extends ICard {}

export class CardCatalog extends Card {
    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.cardElement.addEventListener("click", () => {
            this.events.emit("card:select", {
                id: this.cardElement.dataset.id ?? "",
            });
        });
    }
}