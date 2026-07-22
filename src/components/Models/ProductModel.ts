import { IProduct, IProductModel } from "../../types";

export class ProductModel implements IProductModel {
    items: IProduct[] = [];

    selectedProduct: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
    };

    getItems(): IProduct[] {
        return this.items;
    };

    getProduct(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    };

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    };

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    };
}