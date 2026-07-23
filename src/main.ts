import "./scss/styles.scss";

import { apiProducts } from "./utils/data";

import { ProductModel } from "./components/Models/ProductModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

import { Api } from "./components/base/Api";

import { WebLarekApi } from "./components/WebLarekApi/webLarekApi";

import { TPayment } from "./types";

console.log("1. ПРОВЕРКА ProductModel");
const productsModel = new ProductModel();
console.log("1. Начальный каталог (должен быть []):", productsModel.getItems());
console.log("2. Начальный выбранный товар (должен быть null):", productsModel.getSelectedProduct());
productsModel.setItems(apiProducts.items);
console.log("3. Каталог после setItems:", productsModel.getItems());
console.log("4. Количество товаров в каталоге:", productsModel.getItems().length);
const oneProductId = apiProducts.items[0].id;
console.log("5. Товар по id " + oneProductId + ":", productsModel.getProduct(oneProductId));
console.log("6. Несуществующий товар (должен быть undefined):", productsModel.getProduct("someproduct-id"));
const oneProduct = productsModel.getProduct(oneProductId);
if (oneProduct) {
productsModel.setSelectedProduct(oneProduct);
}
console.log("7. Выбранный товар после setSelectedProduct:", productsModel.getSelectedProduct());

console.log("2. ПРОВЕРКА BasketModel");
const basketModel = new BasketModel();
console.log("1. Начальная корзина (должна быть []):", basketModel.getItems());
console.log("2. Начальное количество (должно быть 0):", basketModel.getCount());
console.log("3. Начальная сумма (должна быть 0):", basketModel.getTotal());
const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];
const product3 = apiProducts.items[2];
basketModel.addItem(product1);
basketModel.addItem(product2);
console.log("4. Корзина после добавления 2 товаров:", basketModel.getItems());
console.log("5. Количество (должно быть 2):", basketModel.getCount());
console.log("6. Сумма корзины:", basketModel.getTotal());
basketModel.addItem(product1);
console.log("7. Количество после попытки добавить дубль (должно остаться 2):", basketModel.getCount());
console.log("8. Есть ли product1 в корзине (должно быть true):", basketModel.hasItem(product1.id));
console.log("9. Есть ли product3 в корзине (должно быть false):", basketModel.hasItem(product3.id));
basketModel.addItem(product3);
console.log("10. Количество после добавления product3 (должно быть 3):", basketModel.getCount());
basketModel.removeItem(product3.id);
console.log("11. Количество после удаления product3 (должно быть 2):", basketModel.getCount());
console.log("12. Есть ли product3 после удаления (должно быть false):", basketModel.hasItem(product3.id));
basketModel.clear();
console.log("13. Корзина после clear (должна быть []):", basketModel.getItems());
console.log("14. Количество после clear (должно быть 0):", basketModel.getCount());
console.log("15. Сумма после clear (должна быть 0):", basketModel.getTotal());


console.log("3. ПРОВЕРКА BuyerModel");
const buyerModel = new BuyerModel();
console.log("1. Начальные данные покупателя:", buyerModel.getBuyerData());
console.log("2. Валидация пустой формы (должны быть ошибки):", buyerModel.validate());
console.log("3. Объект ошибок:", buyerModel.errors);
buyerModel.setPayment("online" as TPayment);
console.log("4. После setPayment — payment:", buyerModel.payment);
console.log("5. Остальные поля не изменились:", buyerModel.getBuyerData());
buyerModel.setAddress("г. Москва, ул. Скворцова, д. 7");
console.log("6. После setAddress — address:", buyerModel.address);
buyerModel.setPhone("+7 (111) 111-11-11");
console.log("7. После setPhone — phone:", buyerModel.phone);
buyerModel.setEmail("alex@example.com");
console.log("8. После setEmail — email:", buyerModel.email);
console.log("9. Валидация заполненной формы (должен быть {}):", buyerModel.validate());
console.log("10. Итоговые данные покупателя:", buyerModel.getBuyerData());
buyerModel.setEmail("");
console.log("11. Валидация с пустым email (должна быть ошибка email):", buyerModel.validate());
buyerModel.clear();
console.log("12. После clear — данные:", buyerModel.getBuyerData());
console.log("13. После clear — ошибки:", buyerModel.errors);

const baseApi = new Api(import.meta.env.VITE_API_ORIGIN, {
    headers: {
        "Content-Type": "application/json",
    }
});

const webLarekApi = new WebLarekApi(baseApi);

webLarekApi.getProductList()
.then((response) => {
    console.log("Ответ от сервера:", response);
    console.log("Массив товаров из ответа:", response.items);
    productsModel.setItems(response.items);
    console.log("Каталог, сохранённый в модели после запроса:", productsModel.getItems());
    console.log("Количество товаров в модели:", productsModel.getItems().length);
})
.catch((error) => {
    console.error("Ошибка при получении товаров:", error);
})