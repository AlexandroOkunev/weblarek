import "./scss/styles.scss";
import { apiProducts } from "./utils/data";

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
    headers: { "Content-Type": "application/json" },
});
const webLarekApi = new WebLarekApi(baseApi);

const header = new Header(events, document.querySelector(".header") as HTMLElement);
const modal = new ModalWindow(events, document.querySelector("#modal-container") as HTMLElement);
const gallery = new Gallery(document.querySelector(".gallery") as HTMLElement);

const cardPreview = new CardPreview(
    events,
    cloneTemplate<HTMLDivElement>("#card-preview"),
    () => events.emit("card:add")
);

const basket = new Basket(events, cloneTemplate<HTMLDivElement>("#basket"));
const orderForm = new OrderForm(events, cloneTemplate<HTMLFormElement>("#order"));
const contactsForm = new ContactsForm(events, cloneTemplate<HTMLFormElement>("#contacts"));
const success = new Success(events, cloneTemplate<HTMLDivElement>("#success"));

events.on("products:loaded", () => {
    const items = productsModel.getItems();
    const cards = items.map((product) => {
        const container = cloneTemplate<HTMLButtonElement>("#card-catalog");
        const card = new CardCatalog(events, container, () => {
            events.emit("card:select", { id: product.id });
        });

        const isAvailable = product.price !== null && product.price > 0;
        const priceText = isAvailable ? `${product.price} синапсов` : "Бесценно";

        return card.render({
            title: product.title,
            price: priceText,
            category: product.category,
            image: `${CDN_URL}/${product.image}`,
        });
    });
    gallery.render({ catalog: cards });
});

events.on("product:selected", () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;

    const isAvailable = product.price !== null && product.price > 0;
    const isLocked = basketModel.hasItem(product.id);

    let buttonText = "В корзину";
    let buttonDisabled = false;

    if (!isAvailable) {
        buttonText = "Недоступно";
        buttonDisabled = true;
    } else if (isLocked) {
        buttonText = "Убрать из корзины";
    }

    const priceText = isAvailable ? `${product.price} синапсов` : "Бесценно";

    const element = cardPreview.render({
        title: product.title,
        price: priceText,
        category: product.category,
        image: `${CDN_URL}/${product.image}`,
        description: product.description,
        buttonText,
        buttonDisabled,
    });

    modal.open();
    modal.content = element;
});

events.on("basket:changed", () => {
    header.render({ counter: basketModel.getCount() });
    updateBasket();
});

events.on("buyer:changed", () => {
    updateOrderForm();
    updateContactsForm();
});

events.on("card:select", (data: { id: string }) => {
    const product = productsModel.getProduct(data.id);
    if (product) productsModel.setSelectedProduct(product);
});

events.on("card:add", () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;

    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product.id);
    } else {
        basketModel.addItem(product);
    }
    modal.close();
});

events.on("basket:open", () => openBasket());

events.on("basket:remove", (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

events.on("basket:checkout", () => {
    openOrderForm();
});

events.on("order:payment", (data: { payment: TPayment }) => buyerModel.setPayment(data.payment));
events.on("order:address", (data: { value: string }) => buyerModel.setAddress(data.value));

events.on("order:submit", () => {
    openContactsForm();
});

events.on("contacts:email", (data: { value: string }) => buyerModel.setEmail(data.value));
events.on("contacts:phone", (data: { value: string }) => buyerModel.setPhone(data.value));

events.on("contacts:submit", () => {
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
        .catch((error) => console.error("Ошибка оформления заказа:", error));
});

events.on("success:close", () => modal.close());

function updateBasket(): void {
    const items = basketModel.getItems();
    const basketItems = items.map((product, index) => {
        const container = cloneTemplate<HTMLLIElement>("#card-basket");

        const cardBasket = new CardBasket(events, container, () => {
            events.emit("basket:remove", { id: product.id });
        });

        const isAvailable = product.price !== null && product.price > 0;
        const priceText = isAvailable ? `${product.price} синапсов` : "Бесценно";

        return cardBasket.render({
            title: product.title,
            price: priceText,
            index: index + 1,
        });
    });

    basket.render({
        items: basketItems,
        totalPrice: basketModel.getTotal(),
        isEmpty: items.length === 0,
    });
}

function openBasket(): void {
    modal.content = basket.render();
    modal.open();
}

function updateOrderForm(): void {
    const buyerData = buyerModel.getBuyerData();
    const errors = buyerModel.validate();

    orderForm.render({
        payment: buyerData.payment ?? "card",
        address: buyerData.address,
        valid: !errors.payment && !errors.address,
        errorsText: Object.values({ payment: errors.payment, address: errors.address })
            .filter((i) => !!i)
            .join("; "),
    });
}

function openOrderForm(): void {
    modal.content = orderForm.render();
    modal.open();
}

function updateContactsForm(): void {
    const buyerData = buyerModel.getBuyerData();
    const errors = buyerModel.validate();

    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: !errors.email && !errors.phone,
        errorsText: Object.values({ email: errors.email, phone: errors.phone })
            .filter((i) => !!i)
            .join("; "),
    });
}

function openContactsForm(): void {
    modal.content = contactsForm.render();
    modal.open();
}

function renderSuccess(total: number): void {
    const element = success.render({ total: `${total} синапсов` });
    modal.open();
    modal.content = element;
}

   webLarekApi.getProductList()
       .then((response) => productsModel.setItems(response.items))
       .catch((error) => {
           console.warn("API недоступен, используются локальные мок-данные:", error);
           productsModel.setItems(apiProducts.items);
       });