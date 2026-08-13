import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
    valid: boolean;
    errorsText: string;
}

export abstract class Form<T extends IForm = IForm> extends Component<T> {
    protected events: IEvents;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;

        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            this.container
        );

        this.errorsElement = ensureElement<HTMLElement>(
            ".form__errors",
            this.container
        );

        this.container.addEventListener("submit", (e) => {
            e.preventDefault();
            const formName = (this.container as HTMLFormElement).name;
            this.events.emit(`${formName}:submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errorsText(value: string) {
        this.errorsElement.textContent = value;
    }
}