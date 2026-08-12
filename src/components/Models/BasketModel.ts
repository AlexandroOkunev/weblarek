import { IEvents } from "../base/Events";
import { IProduct, IBasketModel } from "../../types";

export class BasketModel implements IBasketModel {
    protected items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this.items.push(product);
            this.events.emit("basket:changed");
        }
    }

    removeItem(id: string): void {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.events.emit("basket:changed");
        }
    }

    clear(): void {
        this.items = [];
        this.events.emit("basket:changed");
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => {
            return sum + (item.price ?? 0);
        }, 0);
    }

    getCount(): number {
       return this.items.length; 
    }

    hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}