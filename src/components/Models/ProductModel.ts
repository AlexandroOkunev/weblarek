import { IEvents } from "../base/Events";

import { IProduct, IProductModel } from "../../types";

export class ProductModel implements IProductModel {
    protected items: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    };

    setItems(items: IProduct[]): void {
        this.items = items;

        this.events.emit("products:loaded", {
            items: this.getItems(),
            count: this.items.length,
        });
    };

    getItems(): IProduct[] {
        return this.items;
    };

    getProduct(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    };

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;

        this.events.emit("product:selected", {
            product: this.selectedProduct,
        });
    };

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    };
}