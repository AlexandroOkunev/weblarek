[![Deploy Status](https://github.com/AlexandroOkunev/weblarek/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/AlexandroOkunev/weblarek/actions/workflows/deploy-pages.yml)

# Веб-Ларёк 🛒

Интернет-магазин «Яндекс Практикум» на Vanilla TypeScript с архитектурой на событийной шине (Event Emitter), разделением Model/View, корзиной, валидацией форм и интеграцией с API.

## 🚀 Демо

- **GitHub Pages:** [https://alexandrookunev.github.io/weblarek/](https://alexandrookunev.github.io/weblarek/)  
  *(✅ Работает в РФ без VPN)*

## 🛠 Стек

- **Core:** Vanilla TypeScript, Vite, SCSS (БЭМ)
- **Архитектура:** событийная шина `EventEmitter`, модели `ProductModel` / `BasketModel` / `BuyerModel`, классы-представления
- **Сеть:** нативный `fetch`, класс-обёртка `Api`
- **CI/CD & Деплой:** GitHub Actions, GitHub Pages

## ✨ Ключевые особенности реализации

1. **Отказоустойчивость (Mock Layer):**  
   При недоступности внешнего API каталог подхватывает типизированные локальные данные из `src/utils/data.ts`, а оформление заказа завершается локальной модалкой успеха. Интерфейс остаётся полностью работоспособным без бэкенда.
2. **Событийная архитектура:**  
   UI-компоненты не знают друг о друге и общаются через шину событий (`products:loaded`, `basket:changed`, `contacts:submit` и др.), что упрощает расширение и тестирование.
3. **Корректный деплой на Pages:**  
   В `vite.config.ts` задан `base: './'` для относительных путей ассетов в подпапке репозитория; в workflow добавлен `environment: github-pages` и `concurrency` для стабильной сборки без конфликта артефактов.

## 📦 Функционал

- Каталог с категориями и превью товара в модалке.
- Корзина с добавлением/удалением и подсчётом суммы.
- Многошаговая форма заказа (оплата → адрес → контакты) с валидацией.
- Модалка успеха после оформления.

## ⚙️ Запуск локально

**Требования:** Node.js 18+

1. Установка:

        git clone https://github.com/AlexandroOkunev/weblarek.git
        cd weblarek
        npm install

2. Переменные окружения — создайте `.env` в корне:

        VITE_API_ORIGIN=https://<api-origin-практикума>

3. Режим разработки:

        npm run dev

4. Продакшен-сборка:

        npm run build
