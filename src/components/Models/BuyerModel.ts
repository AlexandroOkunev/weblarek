import { IEvents } from "../base/Events";
import { FormErrors, IBuyer, IBuyerModel, TPayment } from "../../types";

export class BuyerModel implements IBuyerModel {
    protected payment: TPayment | null = null;
    protected address: string = "";
    protected phone: string = "";
    protected email: string = "";
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setPayment(value: TPayment): void {
        this.payment = value;
        this.events.emit("buyer:changed");
    }

    setAddress(value: string): void {
        this.address = value;
        this.events.emit("buyer:changed");
    }

    setPhone(value: string): void {
        this.phone = value;
        this.events.emit("buyer:changed");
    }

    setEmail(value: string): void {
        this.email = value;
        this.events.emit("buyer:changed");
    }

    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    clear(): void {
        this.payment = null;
        this.address = "";
        this.phone = "";
        this.email = "";
        this.events.emit("buyer:changed");
    }

    validate(): FormErrors {
        const errors: FormErrors = {};

        if (!this.payment) {
            errors.payment = "Не выбран вид оплаты";       
        }

        if (!this.address || this.address.trim().length === 0) {
            errors.address = "Укажите адрес";
        }

        if (!this.phone || this.phone.trim().length === 0) {
            errors.phone = "Укажите телефон";
        }

        if (!this.email || this.email.trim().length === 0) {
            errors.email = "Укажите емэйл";
        }

        return errors;
    }
}