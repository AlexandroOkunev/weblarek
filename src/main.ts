import "./scss/styles.scss";

import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate } from "./utils/utils";

import { ProductModel } from "./components/Models/ProductModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/WebLarekApi/webLarekApi";

import { IOrderResult, TPayment } from "./types";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { ModalWindow } from "./components/views/ModalWindow";
import { CardCatalog } from "./components/views/Card/CardCatalog";
import { CardPreview } from "./components/views/Card/CardPreview";
import { CardBasket } from "./components/views/Card/CardBasket";
import { Basket } from "./components/views/Basket";
import { OrderForm } from "./components/views/Form/OrderForm";
import { ContactsForm } from "./components/views/Form/ContactsForm";
import { Success } from "./components/views/Success";

const events = new EventEmitter();

const productsModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const baseApi = new Api(API_URL, {
    headers: {
        "Content-Type": "application/json",
    }
});

const webLarekApi = new WebLarekApi(baseApi);

const header = new Header(
    events,
    document.querySelector(".header") as HTMLElement
);

const modal = new ModalWindow(
    events,
    document.querySelector("#modal-container") as HTMLElement
);

const gallery = new Gallery(
    document.querySelector(".gallery") as HTMLElement
);

let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

events.on("products:loaded", () => {
    const items = productsModel.getItems();

    const cards = items.map((product) => {
        const container = cloneTemplate<HTMLButtonElement>("#card-catalog");
        const card = new CardCatalog(events, container);

        return card.render({
            id: product.id,
            title: product.title,
            price: product.price,
            category: product.category,
            image: `${CDN_URL}/${product.image}`,
        });
    });

    gallery.catalog = cards;
});

events.on("product:selected", () => {
    const product = productsModel.getSelectedProduct();

    if (!product) return;

    const container = cloneTemplate<HTMLDivElement>("#card-preview");
    const isLocked = basketModel.hasItem(product.id);

    const cardPreview = new CardPreview(events, container);

    cardPreview.render({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        image: `${CDN_URL}/${product.image}`,
        description: product.description,
        isLocked,
    });

    modal.content = cardPreview.container;
});

events.on("basket:changed", (data: { count: number }) => {
    header.counter = data.count;
});

events.on("modal:close", () => {
    modal.close();
});

events.on("card:select", (data: { id: string }) => {
    const product = productsModel.getProduct(data.id);

    if (product) {
        productsModel.setSelectedProduct(product);
    }
});

events.on("card:add", (data: { id: string }) => {
    const product = productsModel.getProduct(data.id);
    if (!product) return;

    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product.id);
    } else {
        basketModel.addItem(product);
    }
    
    modal.close();
});

events.on("basket:open", () => {
    renderBasket();
});

events.on("basket:remove", (data: { id:string }) => {
    basketModel.removeItem(data.id);
    renderBasket();
});

events.on("basket:checkout", () => {
    if (basketModel.getItems().length === 0) {
        return;
    }
    renderOrderForm();
});

events.on("order:payment", (data: { payment: TPayment }) => {
    buyerModel.setPayment(data.payment);
    updateOrderForm();
});

events.on("order:address", (data: { value: string }) => {
    buyerModel.setAddress(data.value);
    updateOrderForm();
});

events.on("order:submit", () => {
    const errors = buyerModel.validate();
    const hasOrderErrors = errors.payment || errors.address;

    if (hasOrderErrors && currentOrderForm) {
        currentOrderForm.render({
            valid: false,
            errors,
        });
        return;
    }

    renderContactsForm();
});

events.on("contacts:email", (data: { value: string }) => {
    buyerModel.setEmail(data.value);
    updateContactsForm();
});

events.on("contacts:phone", (data: { value: string }) => {
    buyerModel.setPhone(data.value);
    updateContactsForm();
});

events.on("contacts:submit", () => {
    const errors = buyerModel.validate();

    if (Object.keys(errors).length === 0) {
        const orderData = {
            ...buyerModel.getBuyerData(),
            items: basketModel.getItems().map((item) => item.id),
            total: basketModel.getTotal(),
        };

        webLarekApi
            .postOrder(orderData)
            .then((result: IOrderResult) => {
                basketModel.clear();
                buyerModel.clear();
                renderSuccess(result.total);
            })
            .catch((error) => {
                console.error("Ошибка оформления заказа:", error);
            });
    }
});

events.on("success:close", () => {
    modal.close();
});

function renderBasket(): void {
    const items = basketModel.getItems();

    const basketItems = items.map((product, index) => {
        const container = cloneTemplate<HTMLLIElement>("#card-basket");
        const cardBasket = new CardBasket(events, container);

        cardBasket.render({
            id: product.id,
            title: product.title,
            price: product.price,
            category: product.category,
            image: `${CDN_URL}/${product.image}`,
            index: index + 1,
        });

        return cardBasket.container;
    });

    const basketContainer = cloneTemplate<HTMLDivElement>("#basket");
    const basket = new Basket(events, basketContainer);

    basket.render({
        items: basketItems,
        totalPrice: basketModel.getTotal(),
    });

    modal.content = basket.container;
}

function renderOrderForm(): void {
    const container = cloneTemplate<HTMLFormElement>("#order");
    currentOrderForm = new OrderForm(events, container);

    const buyerData = buyerModel.getBuyerData();
    const errors = buyerModel.validate();

    const orderErrors = {
        payment: errors.payment,
        address: errors.address,
    };

    currentOrderForm.render({
        payment: buyerData.payment ?? "",
        address: buyerData.address,
        valid: !errors.payment && !orderErrors.address,
        errors: {},
    });

    modal.content = currentOrderForm.container;
}

function updateOrderForm(): void {
    if (!currentOrderForm) return;

    const buyerData = buyerModel.getBuyerData();
    const errors = buyerModel.validate();

    const orderErrors = {
        payment: errors.payment,
        address: errors.address,
    };

     const isValid = !orderErrors.payment && !orderErrors.address;

    currentOrderForm.render({
        payment: buyerData.payment ?? "",
        address: buyerData.address,
        valid: isValid,
        errors: {},
    });
}

function renderContactsForm(): void {
    const container = cloneTemplate<HTMLFormElement>("#contacts");
    currentContactsForm = new ContactsForm(events, container);

    const buyerData = buyerModel.getBuyerData();
    const errors = buyerModel.validate();

    currentContactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: !errors.email && !errors.phone,
        errors: {},
    });

    modal.content = currentContactsForm.container;
}

function updateContactsForm(): void {
    if (!currentContactsForm) return;

    const errors = buyerModel.validate();

    currentContactsForm.render({
        valid: !errors.email && !errors.phone,
        errors: {},
    });
}

function renderSuccess(total: number): void {
    const container = cloneTemplate<HTMLDivElement>("#success");
    const success = new Success(events, container);

    success.render({ total });

    modal.content = success.container;
}

webLarekApi
    .getProductList()
    .then((response) => {
        productsModel.setItems(response.items);
    })
    .catch((error) => {
        console.error("Ошибка при получении товаров:", error);
    })