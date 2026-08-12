import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
    valid: boolean;
    errors: Record<string, string>;
    errorsText: string;
}

export abstract class Form<T extends IForm = IForm> extends Component<T> {
    protected events: IEvents;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected inputElements: HTMLInputElement[];

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

        this.inputElements = Array.from(
            this.container.querySelectorAll<HTMLInputElement>("input")
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

    set errors(value: Record<string, string>) {
        this.inputElements.forEach(input => {
            input.setCustomValidity("");
            input.classList.remove("form__input_invalid");
        });

        Object.entries(value).forEach(([fieldName, errorMessage]) => {
            const fields = this.inputElements.filter(
                input => input.name === fieldName
            );

            fields.forEach(field => {
                field.setCustomValidity(errorMessage);
                if (errorMessage) {
                    field.classList.add("form__input_invalid");
                }
            });
        });
    }

    set errorsText(value: string) {
        this.errorsElement.textContent = value;
    }
}