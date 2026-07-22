export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
};

export type TPayment = "online" | "offline";

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
};

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
};

export type FormErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductModel {
    items: IProduct[];
    selectedProduct: IProduct | null;
    setItems(items: IProduct[]): void;
    getItems(): IProduct[];
    getProduct(id: string): IProduct | undefined;
    setSelectedProduct(product: IProduct): void;
    getSelectedProduct(): IProduct | null;
};

export interface IBasketModel {
    items: IProduct[];
    getItems(): IProduct[];
    addItem(product: IProduct): void;
    removeItem(id: string): void;
    clear(): void;
    getTotal(): number;
    getCount(): number;
    hasItem(id: string): boolean;
}

export interface IBuyerModel {
    payment: TPayment | null;
    address: string;
    phone: string;
    email: string;
    errors: FormErrors;
    setPayment(value: TPayment): void;
    setAddress(value: string): void;
    setPhone(value: string): void;
    setEmail(value: string): void;
    getBuyerData(): IBuyer;
    clear(): void;
    validate(): FormErrors;
}