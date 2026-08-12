import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModalWindow {
    content: HTMLElement;
}

export class ModalWindow extends Component<IModalWindow> {
    protected events: IEvents;
    protected contentElement: HTMLElement;
    protected buttonClose: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;

        this.contentElement = ensureElement<HTMLElement>(
            ".modal__content",
            this.container
        );

        this.buttonClose = ensureElement<HTMLButtonElement>(
            ".modal__close",
            this.container
        );

        this.buttonClose.addEventListener("click", () => {
            this.close();
        });

        this.container.addEventListener("click", (event: MouseEvent) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    open(): void {
        this.container.classList.add("modal_active");
    }

    close(): void {
        this.container.classList.remove("modal_active");
        this.contentElement.replaceChildren();
    }

    set content(element: HTMLElement) {
        this.contentElement.replaceChildren(element);
    }
}