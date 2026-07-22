import "./scss/styles.scss";

import { apiProducts } from "./utils/data";

import { ProductModel } from "./components/Models/ProductModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

import { TPayment } from "./types";


// 1. ПРОВЕРКА ProductModel

console.log("ProductModel");

const productsModel = new ProductModel();

// Проверяем начальное состояние
console.log("1. Начальный каталог (должен быть []):", productsModel.getItems());
console.log("2. Начальный выбранный товар (должен быть null):", productsModel.getSelectedProduct());

// Сохраняем массив товаров
productsModel.setItems(apiProducts.items);
console.log("3. Каталог после setItems:", productsModel.getItems());
console.log("4. Количество товаров в каталоге:", productsModel.getItems().length);

// Получаем один товар по id
const oneProductId = apiProducts.items[0].id;
console.log("5. Товар по id " + oneProductId + ":", productsModel.getProduct(oneProductId));

// Пытаемся получить несуществующий товар
console.log("6. Несуществующий товар (должен быть undefined):", productsModel.getProduct("someproduct-id"));

// Сохраняем товар для подробного отображения
const oneProduct = productsModel.getProduct(oneProductId);
if (oneProduct) {
    productsModel.setSelectedProduct(oneProduct);
}
console.log("7. Выбранный товар после setSelectedProduct:", productsModel.getSelectedProduct());

// 2. ПРОВЕРКА BasketModel

console.log("BasketModel");

const basketModel = new BasketModel();

// Начальное состояние
console.log("1. Начальная корзина (должна быть []):", basketModel.getItems());
console.log("2. Начальное количество (должно быть 0):", basketModel.getCount());
console.log("3. Начальная сумма (должна быть 0):", basketModel.getTotal());

// Добавляем товары
const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];
const product3 = apiProducts.items[2];

basketModel.addItem(product1);
basketModel.addItem(product2);
console.log("4. Корзина после добавления 2 товаров:", basketModel.getItems());
console.log("5. Количество (должно быть 2):", basketModel.getCount());
console.log("6. Сумма корзины:", basketModel.getTotal());

// Защита от дублей
basketModel.addItem(product1);
console.log("7. Количество после попытки добавить дубль (должно остаться 2):", basketModel.getCount());

// Проверка hasItem
console.log("8. Есть ли product1 в корзине (должно быть true):", basketModel.hasItem(product1.id));
console.log("9. Есть ли product3 в корзине (должно быть false):", basketModel.hasItem(product3.id));

// Добавляем и удаляем
basketModel.addItem(product3);
console.log("10. Количество после добавления product3 (должно быть 3):", basketModel.getCount());

basketModel.removeItem(product3.id);
console.log("11. Количество после удаления product3 (должно быть 2):", basketModel.getCount());
console.log("12. Есть ли product3 после удаления (должно быть false):", basketModel.hasItem(product3.id));

// Очистка
basketModel.clear();
console.log("13. Корзина после clear (должна быть []):", basketModel.getItems());
console.log("14. Количество после clear (должно быть 0):", basketModel.getCount());
console.log("15. Сумма после clear (должна быть 0):", basketModel.getTotal());

// 3. ПРОВЕРКА BuyerModel

console.log("BuyerModel");

const buyerModel = new BuyerModel();

// Начальное состояние
console.log("1. Начальные данные покупателя:", buyerModel.getBuyerData());

// Валидация пустой формы — должны быть ошибки во всех полях
console.log("2. Валидация пустой формы (должны быть ошибки):", buyerModel.validate());
console.log("3. Объект ошибок:", buyerModel.errors);

// Заполняем данные по одному полю
buyerModel.setPayment("online" as TPayment);
console.log("4. После setPayment — payment:", buyerModel.payment);
console.log("5. Остальные поля не изменились:", buyerModel.getBuyerData());

buyerModel.setAddress("г. Москва, ул. Скворцова, д. 7");
console.log("6. После setAddress — address:", buyerModel.address);

buyerModel.setPhone("+7 (111) 111-11-11");
console.log("7. После setPhone — phone:", buyerModel.phone);

buyerModel.setEmail("alex@example.com");
console.log("8. После setEmail — email:", buyerModel.email);

// Валидация заполненной формы — ошибок быть не должно
console.log("9. Валидация заполненной формы (должен быть {}):", buyerModel.validate());

// Итоговые данные
console.log("10. Итоговые данные покупателя:", buyerModel.getBuyerData());

// Частичная очистка — проверяем, что валидация видит пустое поле
buyerModel.setEmail("");
console.log("11. Валидация с пустым email (должна быть ошибка email):", buyerModel.validate());

// Полная очистка
buyerModel.clear();
console.log("12. После clear — данные:", buyerModel.getBuyerData());
console.log("13. После clear — ошибки:", buyerModel.errors);