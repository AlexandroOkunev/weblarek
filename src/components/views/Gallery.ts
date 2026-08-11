import { Component } from "../base/Component";

export interface IGallery {
    catakog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.catalogElement = this.container;
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}