### Проектная работа "Веб-ларёк"

**Используемый стек:** HTML, SCSS, TypeScript, Webpack

### Структура проекта

- `src/` — исходные файлы проекта
- `src/common.blocks/` — стили для UI-компонентов
- `src/components/` — JS/TS компоненты
- `src/components/base/` — базовый код (API, события)
- `src/images/` — изображения и иконки
- `src/pages/` — HTML-страницы
- `src/public/` — статические файлы (фавиконы, манифест)
- `src/scss/` — стили SCSS, включая миксины и переменные
- `src/types/` — TypeScript-типы
- `src/utils/` — утилиты и константы
- `src/vendor/` — сторонние шрифты и стили

### Важные файлы

- `src/pages/index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами
- `src/index.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами
- `src/components/base/api.ts` — базовый API-клиент
- `src/components/base/events.ts` — управление событиями

### Установка и запуск

Для установки и запуска проекта выполните:

```bash
  npm install
  npm run start
```

или

```bash
  yarn install
  yarn start
```

## Сборка

```bash
  npm run build
```

или

```bash
  yarn build
```

### Архитектура

Проект реализует архитектуру MVP (Model-View-Presenter):

- **Model**: 
  - Интерфейс `IAppState` — структура состояния (корзина, каталог, формы).
  - Класс `AppState` — реализация `IAppState`, управляет данными (корзина, товары, заказ).
  - Использует события (`basket:changed`, `item:selected`) для передачи данных.

- **View**: 
  - Отображает данные через классы `Card`, `Order`, `Contacts`, `Modal`, `Basket`, `Success`.
  - Передает пользовательские события в `Presenter`.

- **Presenter**: 
  - Связывает `Model` и `View`.
  - Обрабатывает события от `View`, обновляет `Model`.
  - Управляет логикой (добавление в корзину, оформление заказа).

#### Взаимодействие компонентов

1. Пользователь взаимодействует с `View` (нажимает "Купить").
2. `View` отправляет событие в `Presenter`.
3. `Presenter` обновляет `Model` (добавляет товар в корзину).
4. `Model` генерирует событие об изменении.
5. `Presenter` обрабатывает событие и уведомляет подписчиков.
6. `View` обновляет интерфейс.

### Типы данных

- **Product**:
```typescript
  interface Product {
    id: string; // Уникальный идентификатор
    title: string; // Название товара
    description: string; // Текстовое описание
    image: string; // Ссылка на изображение
    category: string; // Категория
    price: number | null; // Цена (может быть null)
  }
```

  

- **Order**:
```typescript
  interface Order {
    payment: string; // Способ оплаты
    address: string; // Адрес доставки
    email: string; // Email
    phone: string; // Телефон
    total: number; // Итоговая сумма
    items: string[]; // Массив ID товаров
}
```

- **AppState**:
```typescript
  interface AppState {
    catalog: Product[]; // Массив товаров в каталоге
    basket: Product[]; // Массив товаров в корзине
    order: Order; // Текущий заказ
    orderFormErrors: Partial<Record<keyof Order, string>>; // Ошибки формы заказа
    contactFormErrors: Partial<Record<keyof Order, string>>; // Ошибки контактной формы
}
```

### Главная страница

- **Список товаров**:  
  Динамически загружается с сервера, отображает каталог.

- **Индикатор корзины**:  
  Кнопка с счётчиком количества товаров в корзине.

- **Модальное окно**:  
  Используется для:  
  - Просмотра деталей товара.  
  - Отображения корзины.  
  Закрывается кликом вне области или кнопкой (крестик).
  
### Карточка товара

- **Полная информация**:  
  Показывает описание, изображение, категорию, цену и название товара.

- **Добавление в корзину**:  
  Кнопка «Купить» в модальном окне добавляет товар в корзину.

### Корзина

- **Содержимое корзины**:  
  Модальное окно показывает список товаров с названиями и ценами.

- **Удаление товара**:  
  Кнопка удаления убирает товар, пересчитываются:  
  - Общая стоимость.  
  - Количество товаров на кнопке корзины.

- **Оформление заказа**:  
  Кнопка «Оформить» открывает форму для выбора оплаты и ввода адреса.

### Оформление заказа

- **Выбор способа оплаты**:  
  Кнопка «Далее» позволяет выбрать способ оплаты.

- **Валидация формы**:  
  Проверка корректности заполнения формы.


### Завершение заказа

- **Отправка запроса**:  
  Кнопка оплаты отправляет запрос на сервер.

- **Очистка корзины**:  
  После успеха:  
  - Корзина очищается.  
  - Счётчик товаров сбрасывается.  
  - Отображается модальное окно с подтверждением.

### Базовые компоненты кода

#### Класс EventEmitter

Реализует управление событиями.

**Свойства**:
- `_events: Map<EventName, Set<Subscriber>>` — хранит события и подписчиков.

**Конструктор**:
- `constructor()` — инициализирует `_events` как `Map`.

**Методы**:
- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` — регистрирует обработчик для события.
- `off(eventName: EventName, callback: Subscriber)` — удаляет обработчик.
- `emit<T extends object>(eventName: string, data?: T)` — инициирует событие, вызывает обработчики.
- `onAll(callback: (event: EmitterEvent) => void)` — подписка на все события.
- `offAll()` — удаляет все обработчики.
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` — возвращает функцию для инициации события.

#### Абстрактный класс Model<T>

Основа для моделей данных, интегрирована с `EventEmitter`.

**Конструктор**:
- `constructor(data: Partial<T>, events: EventEmitter)` — принимает данные и объект событий.

**Методы**:
- `emitChanges(event: string, payload?: object)` — уведомляет об изменениях.

#### Абстрактный класс Component<T>

Основа для UI-компонентов.

**Свойства**:
- `protected readonly component: HTMLElement` — корневой DOM-элемент.

**Конструктор**:
- `constructor(container: HTMLElement)` — принимает контейнер.

**Методы**:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` — переключает класс.
- `protected setText(element: HTMLElement, value: unknown)` — устанавливает текст.
- `protected setImage(element: HTMLImageElement, src: string, alt?: string)` — устанавливает изображение.
- `setDisabled(element: HTMLElement, state: boolean)` — меняет статус блокировки.
- `protected setHidden(element: HTMLElement)` — скрывает элемент.
- `protected setVisible(element: HTMLElement)` — показывает элемент.
- `render(data?: Partial<T>): HTMLElement` — возвращает DOM-элемент.

#### Абстрактный класс Form<T>

База для форм.

**Свойства**:
- `protected container: HTMLFormElement` — форма.
- `protected events: EventEmitter` — объект событий.
- `protected _submit: HTMLButtonElement` — кнопка отправки.
- `protected _errors: HTMLElement` — блок ошибок.

**Конструктор**:
- `constructor(container: HTMLFormElement, events: EventEmitter)` — принимает форму и события.

**Методы**:
- `set valid(value: boolean)` — управляет активностью кнопки.
- `set errors(value: string)` — выводит ошибки.
- `abstract cleanFieldValues(): void` — очищает поля формы.

#### Класс Api

Обмен данными с сервером через HTTP.

**Конструктор**:
- `constructor(baseUrl: string, options?: RequestInit)` — принимает базовый URL и опции.

**Методы**:
- `get<T>(uri: string): Promise<T>` — GET-запрос.
- `post<T>(uri: string, data: object, method?: string): Promise<T>` — POST-запрос.

### Компоненты интерфейса

#### Класс Page

Управляет главной страницей.

**Свойства**:
- `protected container: HTMLElement` — контейнер страницы.
- `protected _counter: HTMLElement` — счётчик корзины.
- `protected _catalog: HTMLElement` — контейнер каталога.
- `protected _wrapper: HTMLElement` — обёртка страницы.

**Конструктор**:
- `constructor(container: HTMLElement)` — принимает контейнер.

**Методы**:
- `set counter(value: number)` — устанавливает счётчик корзины.
- `set catalog(items: HTMLElement[])` — рендерит карточки каталога.
- `set locked(value: boolean)` — блокирует страницу при открытии модального окна.

#### Класс Card

Отображает карточку товара.

**Свойства**:
- `protected _id: string` — ID товара.
- `protected _title: HTMLElement` — заголовок.
- `protected _image: HTMLImageElement` — изображение.
- `protected _category: HTMLElement` — категория.
- `protected _price: HTMLElement` — цена.
- `protected _description: HTMLElement` — описание.
- `protected _button: HTMLButtonElement` — кнопка.

**Конструктор**:
- `constructor(container: HTMLElement, actions?: ICardActions)` — принимает контейнер и обработчики событий.

**Методы**:
- `set id(value: string)` — устанавливает ID.
- `set title(value: string)` — устанавливает заголовок.
- `set image(value: string)` — устанавливает изображение.
- `set category(value: string)` — устанавливает категорию.
- `set price(value: number | null)` — устанавливает цену.
- `set description(value: string)` — устанавливает описание.
- `set isInBasket(value: boolean)` — обновляет состояние кнопки.
- `getCategoryClass(category: string): string` — возвращает CSS-класс для категории.

#### Класс Basket

Управляет корзиной.

**Свойства**:
- `protected _list: HTMLElement` — список товаров.
- `protected _total: HTMLElement` — итоговая сумма.
- `protected _button: HTMLButtonElement` — кнопка оформления.

**Конструктор**:
- `constructor(container: HTMLElement, actions?: IBasketActions)` — принимает контейнер и обработчики.

**Методы**:
- `set items(items: HTMLElement[])` — отображает товары.
- `set total(value: number)` — устанавливает сумму.
- `disableButton(state: boolean)` — блокирует кнопку при пустой корзине.

#### Класс Order

Управляет формой заказа.

**Свойства**:
- `protected _payment: string` — способ оплаты.
- `protected _address: HTMLInputElement` — поле адреса.
- `protected _buttons: HTMLButtonElement[]` — кнопки оплаты.

**Конструктор**:
- `constructor(container: HTMLFormElement, events: EventEmitter)` — принимает форму и события.

**Методы**:
- `set payment(value: string)` — устанавливает способ оплаты.
- `set address(value: string)` — устанавливает адрес.
- `cleanFieldValues(): void` — очищает поля.

#### Класс Contacts

Управляет контактной формой.

**Свойства**:
- `protected _email: HTMLInputElement` — поле email.
- `protected _phone: HTMLInputElement` — поле телефона.

**Конструктор**:
- `constructor(container: HTMLFormElement, events: EventEmitter)` — принимает форму и события.

**Методы**:
- `set email(value: string)` — устанавливает email.
- `set phone(value: string)` — устанавливает телефон.
- `cleanFieldValues(): void` — очищает поля.

#### Класс Success

Отображает успешное оформление.

**Свойства**:
- `protected _total: HTMLElement` — итоговая сумма.
- `protected _button: HTMLButtonElement` — кнопка «За новыми покупками».

**Конструктор**:
- `constructor(container: HTMLElement, actions?: ISuccessActions)` — принимает контейнер и обработчики.

**Методы**:
- `set total(value: number)` — устанавливает сумму.

#### Класс Modal

Управляет модальными окнами.

**Свойства**:
- `protected _content: HTMLElement` — содержимое модального окна.
- `protected _closeButton: HTMLButtonElement` — кнопка закрытия.

**Конструктор**:
- `constructor(container: HTMLElement)` — принимает контейнер.

**Методы**:
- `open(): void` — открывает модальное окно.
- `close(): void` — закрывает модальное окно.
- `set content(value: HTMLElement)` — устанавливает содержимое.

### Модель данных

#### Класс AppState

Хранит состояние приложения.

**Свойства**:
- `catalog: Product[]` — товары каталога.
- `basket: Product[]` — товары в корзине.
- `order: Order` — текущий заказ.
- `orderFormErrors: Partial<Record<keyof Order, string>>` — ошибки формы заказа.
- `contactFormErrors: Partial<Record<keyof Order, string>>` — ошибки контактной формы.

**Конструктор**:
- `constructor()` — инициализирует состояние.

**Методы**:
- `addBasket(item: Product, quantity: number): void` — добавляет товар в корзину.
- `deleteBasket(itemId: string): void` — удаляет товар из корзины.
- `setCatalog(catalog: Product[]): void` — обновляет каталог.
- `getNumberBasket(): number` — возвращает количество товаров в корзине.
- `getTotalBasket(): number` — возвращает итоговую стоимость.
- `isInBasket(itemId: string): boolean` — проверяет наличие товара в корзине.
- `validate(formData: FormData): boolean` — валидирует форму.
- `prepareOrder(): Order` — готовит заказ для отправки.
- `cleanBasketState(): void` — очищает корзину.
- `cleanOrder(): void` — очищает заказ.

### API

#### Класс Api

Базовый клиент для HTTP-запросов.

**Свойства**:
- `protected baseUrl: string` — базовый URL.
- `protected options: RequestInit` — опции запросов.

**Конструктор**:
- `constructor(baseUrl: string, options?: RequestInit)` — принимает URL и опции.

**Методы**:
- `get<T>(uri: string): Promise<T>` — GET-запрос.
- `post<T>(uri: string, data: object, method?: string): Promise<T>` — POST-запрос.

#### Класс AppAPI

Методы взаимодействия с бэкендом.

**Конструктор**:
- `constructor(api: Api)` — принимает базовый API-клиент.

**Методы**:
- `getItemList(): Promise<Product[]>` — получает список товаров.
- `postOrder(order: Order): Promise<Response>` — отправляет заказ.

### Список событий

#### События моделей
- `basket:changed` — изменение корзины.
- `userData:changed` — изменение данных пользователя.
- `item:selected` — выбор товара.

#### События View
- `card:select` — клик по карточке товара.
- `basket:open` — открытие корзины.
- `basket:remove` — удаление товара из корзины.
- `order:open` — открытие формы заказа.
- `order:submit` — отправка формы заказа.
- `contacts:submit` — отправка контактной формы.
- `success:close` — закрытие окна успеха.