import { FormErrors, IBuyer, IBuyerModel, TPayment } from "../../types";

export class BuyerModel implements IBuyerModel {
    payment: TPayment | null = null;
    address: string = "";
    phone: string = "";
    email: string = "";
    errors: FormErrors = {};

    setPayment(value: TPayment): void {
        this.payment = value;
    };

    setAddress(value: string): void {
        this.address = value;
    };

    setPhone(value: string): void {
        this.phone = value;
    };

    setEmail(value: string): void {
        this.email = value;
    };

    getBuyerData(): IBuyer {
        return {
            payment: this.payment as TPayment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    };

    clear(): void {
        this.payment = null;
        this.address = "";
        this.phone = "";
        this.email = "";
        this.errors = {};
    };

    validate(): FormErrors {
        this.errors = {};

        if (!this.payment) {
            this.errors.payment = "Не выбран вид оплаты";       
        };

        if (!this.address || this.address.trim().length === 0) {
            this.errors.address = "Укажите адрес";
        };

        if (!this.phone || this.phone.trim().length === 0) {
            this.errors.phone = "Укажите телефон";
        };

        if (!this.email || this.email.trim().length === 0) {
            this.errors.email = "Укажите емэйл";
        };

        return this.errors;
    };
}