import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
    valid: boolean;
    errors: Record<string, string>;
}

export abstract class Form<T extends IForm = IForm> extends Component<T> {
    protected events: IEvents;
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected errorsData: Record<string, string> = {};

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.events = events;

        this.formElement = this.container as HTMLFormElement;

        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            this.formElement
        );

        this.errorsElement = ensureElement<HTMLElement>(
            ".form__errors",
            this.formElement
        );
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: Record<string, string>) {
        this.errorsData = value;
        this.renderErrors();
    }

    renderErrors(): void {
        this.errorsElement.textContent = "";

        this.formElement
            .querySelectorAll<HTMLInputElement>("input")
            .forEach(input => {
                input.setCustomValidity("");
                input.classList.remove("form__input_invalid");
            });
        
        const messages: string[] = [];

        Object.entries(this.errorsData).forEach(([fieldName, errorMessage]) => {
            const field = this.formElement.querySelector<HTMLElement>(
                `[name="${fieldName}"]`
            );

            if (field instanceof HTMLInputElement) {
                field.setCustomValidity(errorMessage);

                if (errorMessage) {
                    field.classList.add("form__input_invalid");
                }
            }

            if (errorMessage) {
                messages.push(errorMessage);
            }
        });

        this.errorsElement.textContent = messages.join("; ");
    }
}