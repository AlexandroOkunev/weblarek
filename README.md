# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


## Данные:
    Товар:
        interface IProduct {
        id: string; - айди товара;
        description: string; - описание товара;
        image: string; - изображение товара (url);
        title: string; - название товара;
        category: string; - категория товара;
        price: number | null; - цена товара (null — если цена не указана);
        }
        
    Покупатель:
        interface IBuyer {
        payment: TPayment | null; - способ оплаты (карта или наличные);
        email: string; - емэйл покупателя;
        phone: string; - телефон покупателя;
        address: string; - адрес покупателя;
        }

## Модели данных:
    ProductModel - каталог товаров:

        items: IProduct[] - хранит массив всех товаров;
        selectedProduct: IProduct | null - хранит товар, выбранный для подробного отображения;

        Методы:
            setItems(items: IProduct[]): void - сохранение массива товаров полученного в параметрах метода;
            getItems(): IProduct[] - получение массива товаров из модели;
            getProduct(id: string): IProduct | undefined - получение одного товара по его id;
            setSelectedProduct(product: IProduct): void - сохранение товара для подробного отображения;
            getSelectedProduct(): IProduct | null - получение товара для подробного отображения.

    BasketModel - корзина:
        items: IProduct[] - хранит массив товаров, выбранных покупателем для покупки.

        Методы:
            getItems(): IProduct[] - получение массива товаров, которые находятся в корзине;
            addItem(product: IProduct): void - добавление товара, который был получен в параметре, в массив корзины;
            removeItem(id: string): void - удаление товара, полученного в параметре из массива корзины;
            clear(): void - очистка корзины;
            getTotal(): number - получение стоимости всех товаров в корзине;
            getCount(): number - получение количества товаров в корзине;
            hasItem(id: string): boolean - проверка наличия товара в корзине по его id, полученного в параметре метода.

    BuyerModel - покупатель:
        Хранит следующие данные:
            payment: TPayment - вид оплаты;
            address:string - адреc;
            phone:string - телефон;
            email:string - емэйл;

        Методы:
            setPayment(value: TPayment): void — сохраняет вид оплаты.
            setAddress(value: string): void — сохраняет адрес.
            setPhone(value: string): void — сохраняет телефон.
            setEmail(value: string): void — сохраняет email.
            getBuyerData(): IBuyer - получение всех данных покупателя;
            clear(): void - очистка данных покупателя;
            validate(): FormErrors - валидация данных. Возвращает объект, который содержит сообщения об ошибках валидации для каждого не валидного поля. Тип FormErrors: Partial<Record<keyof IBuyer, string>>;

## Слой коммуникации:
    Класс:
        WebLarekApi — использует композицию, чтобы выполнить запрос на сервер с помощью метода get класса Api и будет получать с сервера объект с массивом товаров.

    Данные:
        protected api: IApi; -  ссылка на экземпляр базового класса для выполнения сетевых запросов.

    Методы:
        getProductList(): Promise<IProductListResponse> — делает get запрос на эндпоинт /product/ и возвращает объект, полученный от сервера, в котором находится массив товаров.

        postOrder(order: IOrder): Promise<IOrderResult> — делает post запрос на эндпоинт /order/ и передаёт в него данные, полученные в параметрах метода, а возвращает объект, подтверждающий покупку на определенную сумму.

### Класс Header (наследник Component)
    Интрефейс:
        HeaderData
    
    Тип данных:
        counter: number

    Поля класса:
        headerBasketButton: HTMLButtonElement - кнопка открытия корзины, расположена в шапке сайта.
        headerBasketCounter: HTMLElement - элемент, отображающий колличестов товаров в корзине
    
    Методы класса:
        set counter(value: number) - обновляет значение счётчика товаров в корзине    

### Класс Gallery (наследник Component)
    Интерфейс:
        GalleryData

    Тип данных:
        catalog: HTMLElement[]

    Поля класса:
        catalogElement: HTMLElement - контейнер каталога товаров

    Методы класса:    
        set catalog(items: HTMLElement[]) - принимает массив DOM-элементов и вставляет их в контейнер каталога


## Класс ModalWindow
    Интерфейс:
        ModalWindowData

    Тип данных:
        content: HTMLElement
    
    Поля класса:
        contentElement: HTMLElement - контейнер содержимого окна
        buttonClose: HTMLButtonElement - кнопка закрытия окна
        
    Методы класса:
        set content(element: HTMLElement) - устанавливает содержимое модального окна
        close(): void - закрывает модальное окно

## Класс Card (абстрактный родительский класс)
    Интерфейс:
        CardData

    Тип данных:
        id: string
        title: string
        price: number | null
        category: string
        image: string

    Поля класса:
        cardElement: HTMLElement - корневой элемент карточки

    Методы класса:
        set id(value: string) - устанавливает индефикатор карточки
        set title(value: string) - устанавливает название товара
        set price(value: number | null) - устанавливает цену товара
        set category(value: string) - устанавливает категорию товара
        set image(value: string) - устанавливает изображение товара

### Класс CardCatalog (наследник Card)
    Интерфейс:
        CardCatalogData

    Тип данных: 
        (наследует все поля CardData)

    Поля класса:
        cardElement: HTMLElement - корневой элемент карточки (наследуется)

    Методы класса:
        (наследует все сеттеры от базового класса Card)

### Класс CardPreview (наследник Card)
    Интерфейс:
        CardPreviewData

    Тип данных:
        description: string
        isLocked: boolean

    Поля класса:
        cardElement: HTMLElement - корневой элемент карточки (наследуется)
        cardDescription: HTMLElement - элемент описания товара
        cardButton: HTMLButtonElement - кнопа "В корзину"

    Методы класса:
        set description(value: string) - устанавливает описание товара
        set isLocked(value: boolean) - блокирует/разблокирует кнопку "В корзину" (если товар уже в корзине)

### Класс CardBasket (наследник Card)
    Интерфейс:
        CardBasketData

    Тип данных:
        index: number

    Поля класса:
        cardElement: HTMLElement - корневой элемент карточки (наследуется)
        indexElement: HTMLElement - элемент с порядковым номером товара
        deleteButton: HTMLButtonElement - кнопка удаление товара из корзины

    Методы класса:
        set index(value: number) - устанавливает порядковый номер товара в корзине

## Класс Basket
    Интерфейс:
        BasketData
    
    Тип данных:
        items: HTMLElement[]
        totalPrice: number

    Поля класса:
        basketElement: HTMLElement - корневой элемент корзины
        basketListElement: HTMLElement - контейнер списка товаров в корзине
        basketPriceElement: HTMLElement - элемент общей стоимости
        checkoutButton: HTMLButtonElement - кнопка "Оформить"

    Методы класса:
        set items(elements: HTMLElement[]) - принимает массив карточек CardBasket  и вставляет их в список
        set totalPrice(value: number) - обновляет общую стоимость корзины

## Класс Form (абстрактный родительский класс)
    Интерфейс: 
        FormData

    Тип данных:
        valid: boolean
        errors: Record<string, string>

    Поля класса:
        formElement: HTMLFormElement - корневой элемент
        submitButton: HTMLButtonElement - кнопка отправки формы
        errorsElement: HTMLElement - контейнер для отображения ошибок

    Методы класса:
        set valid(value: boolean) - блокирует/разблокирует кнопку отправки формы
        set errors(value: Record<string, string>) - устанавливает ошибки валидации по полям
        renderErrors(): void - отрисовывает сообщения об ошибках в соответствующих полях

### Класс OrderForm (наследник Form)
    Интерфейс:
        OrderFormData

    Тип данных:
        payment: string
        address: string

    Поля класса:
        formElement: HTMLFormElement - корневой элемент формы(наследуется)
        paymentButtons: HTMLButtonElement - кнопка выбора способа оплаты
        addressInput: HTMLInputElement - поле ввода адреса доставки

    Методы класса:
        set payment(value: string) - выделяет активную кнопку способа оплаты
        set address(value: string) - устанавливает значение для поля адреса

### Класс ContactsForm (наследник Form)
    Интерфейс:
        ContactsFormData

    Тип данных:
        email: string
        phone: string

    Поля класса:
        formElement: HTMLFormElement - корневой элемент формы (наследуется)
        emailInput: HTMLInputElement - поле ввода email
        phoneInput: HTMLInputElement - поле ввода телефона

    Методы класса:
        set email(value: string) - устанавливает значение поля email
        set phone(value: string) - устанавливает значение поля телефона

## Класс Success
    Интерфейс:
        SuccessData

    Тип данных:
        total: number

    Поля класса:
        successElement: HTMLElement - корневой элемент окна успеха
        descriptionElement: HTMLElement - элемент с текстом "Списано N синапсов"
        closeButton: HTMLButtonElement - кнопка "За новыми покупками!"

    Методы класса:
        set total(value: number) - устанавливает сумму, списанную при оформлении заказа