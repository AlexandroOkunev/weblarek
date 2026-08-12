import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected events: IEvents;
    protected successElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.events = events;

        this.successElement = this.container;

        this.descriptionElement = ensureElement<HTMLElement>(
            ".order-success__description",
            this.successElement
        );

        this.closeButton = ensureElement<HTMLButtonElement>(
            ".order-success__close",
            this.successElement
        );

        this.closeButton.addEventListener("click", () => {
            this.events.emit("success:close");
        });
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}