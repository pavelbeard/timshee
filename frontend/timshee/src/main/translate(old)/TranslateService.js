import AuthService from "../api(old)/authService";

import { API_URL } from '../../config';

const siteCreated = {
    "en-US": "Site created by heavycream9090",
    "en-UK": "Site created by heavycream9090",
    "ru-RU": "Сайт создан heavycream9090",
};

const orderPaid = {
    "en-US": "Order.HAS BEEN PAID SUCCESSFULLY!",
    "en-UK": "Order.HAS BEEN PAID SUCCESSFULLY!",
    "ru-RU": "Заказ.успешно оплачен",
};

const itemCardDetail = {
    sizes: {
        "en-US": "Sizes:",
        "en-UK": "Sizes:",
        "ru-RU": "Размеры:",
    },
    colors: {
        "en-US": "Colors:",
        "en-UK": "Colors:",
        "ru-RU": "Цвета:",
    },
    outOfStock: {
        "en-US": "Out of stock",
        "en-UK": "Out of stock",
        "ru-RU": "Нет в наличии",
    },
    hasAdded: {
        "en-US": "Has added",
        "en-UK": "Has added",
        "ru-RU": "В корзине",
    },
    addToCart: {
        "en-US": "Add to cart",
        "en-UK": "Add to cart",
        "ru-RU": "В корзину"
    },
    addToWishlist: {
        "en-US": "Add to wishlist",
        "en-UK": "Add to wishlist",
        "ru-RU": "В избранное",
    },
    removeFromWishlist: {
        "en-US": "Remove from wishlist",
        "en-UK": "Remove from wishlist",
        "ru-RU": "Удалить из избранного",
    }
};

const account = {
    logout: {
        "en-US": "Logout",
        "en-UK": "Logout",
        "ru-RU": "Выйти из аккаунта",
    },
    address: {
        "en-US": "Address",
        "en-UK": "Address",
        "ru-RU": "Адрес",
    },
    primaryAddress: {
        "en-US": "Primary Address",
        "en-UK": "Primary Address",
        "ru-RU": "Главный адрес",
    },
    noAddress: {
        "en-US": "THERE AREN'T ANY PRIMARY ADDRESS",
        "en-UK": "THERE AREN'T ANY PRIMARY ADDRESS",
        "ru-RU": "Главный адрес не установлен",
    },
    editAddress: {
        "en-US": "Edit Address",
        "en-UK": "Edit Address",
        "ru-RU": "Изменить адрес",
    },
    addAddress: {
        "en-US": "Add Address",
        "en-UK": "Add Address",
        "ru-RU": "Добавить адрес",
    },
    returnToAccount: {
        "en-US": "Return to account",
        "en-UK": "Return to account",
        "ru-RU": "Вернуться в аккаунт",
    },
    edit: {
        "en-US": "Edit",
        "en-UK": "Edit",
        "ru-RU": "Изменить",
    },
    delete: {
        "en-US": "Delete",
        "en-UK": "Delete",
        "ru-RU": "Удалить",
    },
    orders: {
        "en-US": "Orders",
        "en-UK": "Orders",
        "ru-RU": "Заказы",
        status: {
            partialRefunded: {
                "en-US": "partial refunded",
                "en-UK": "partial refunded",
                "ru-RU": "Частично возвращен",
            },
            refunded: {
                "en-US": "refunded",
                "en-UK": "refunded",
                "ru-RU": "Возвращен",
            },
            pendingForPay: {
                "en-US": "Pending for pay",
                "en-UK": "Pending for pay",
                "ru-RU": "Ожидает оплаты",
            },
            completed: {
                "en-US": "completed",
                "en-UK": "completed",
                "ru-RU": "Завершен",
            },
            cancelled: {
                "en-US": "Cancelled",
                "en-UK": "Cancelled",
                "ru-RU": "Отменен",
            },
            processing: {
                "en-US": "Processing",
                "en-UK": "Processing",
                "ru-RU": "В процессе сборки"
            },
            delivering: {
                "en-US": "Delivering",
                "en-UK": "Delivering",
                "ru-RU": "В доставке",
            },
            delivered: {
                "en-US": "Delivered",
                "en-UK": "Delivered",
                "ru-RU": "Доставлен",
            },
        }
    },
    noOrders: {
        "en-US": "THERE AREN'T ANY ORDERS",
        "en-UK": "THERE AREN'T ANY ORDERS",
        "ru-RU": "Нет заказов",
    },
    deliveredAt: {
        "en-US": "DELIVERED AT:",
        "en-UK": "DELIVERED AT:",
        "ru-RU": "Доставлено:",
    },
    status: {
        "en-US": "STATUS:",
        "en-UK": "STATUS:",
        "ru-RU": "Статус:",
    },
    refundedAt: {
        "en-US": "REFUNDED AT:",
        "en-UK": "REFUNDED AT:",
        "ru-RU": "Возвращено:",
    },
    seeAddresses: {
        "en-US": "SEE ADDRESS",
        "en-UK": "SEE ADDRESS",
        "ru-RU": 'Просмотреть адреса'
    },
    seeOrders: {
        "en-US": "SEE ORDERS",
        "en-UK": "SEE ORDERS",
        "ru-RU": "Просмотреть заказы",
    },
    createdAt: {
        "en-US": "Created At:",
        "en-UK": "Created At:",
        "ru-RU": "Создано:",
    },
    updatedAt: {
        "en-US": "Updated At:",
        "en-UK": "Updated At:",
        "ru-RU": "Обновлено:",
    },
    orderDetail: {
        "en-US": "Order Detail",
        "en-UK": "Order Detail",
        "ru-RU": "Просмотреть заказ",
    },
    returnOrder: {
        "en-US": "Return order",
        "en-UK": "Return order",
        "ru-RU": "Вернуть заказ",
    },
    returnThroughMail: {
        "en-US": "FURTHER REFUND OF THIS ITEM IS AVAILABLE ONLY THROUGH A MAIL LETTER",
        "en-UK": "FURTHER REFUND OF THIS ITEM IS AVAILABLE ONLY THROUGH A MAIL LETTER",
        "ru-RU": "Дальнейший возврат заказа возможен только через почту",
    },
    returnItem: {
        "en-US": "Return Item",
        "en-UK": "Return Item",
        "ru-RU": "Вернуть вещь",
    },
    returnToOrders: {
        "en-US": "Return to orders page",
        "en-UK": "Return to orders page",
        "ru-RU": "Вернуться в 'Заказы'",
    },
    quantity: {
        "en-US": "Quantity:",
        "en-UK": "Quantity:",
        "ru-RU": "Количество:",
    },
    to: {
        "en-US": "To:",
        "en-UK": "To:",
        "ru-RU": "Доставка в:",
    },
    orderNumber: {
        "en-US": "Order Number:",
        "en-UK": "Order Number:",
        "ru-RU": "Номер заказа",
    }
};

const refundForm = {
    orderReturned: {
        "en-US": "ORDER HAS BEEN REFUNDED",
        "en-UK": "ORDER HAS BEEN REFUNDED",
        "ru-RU": "Заказ был возвращен",
    },
    returnToOrder: {
        "en-US": "Return to order",
        "en-UK": "Return to order",
        "ru-RU": "Вернуться в заказ",
    },
    refundForm: {
        "en-US": "REFUND FORM",
        "en-UK": "REFUND FORM",
        "ru-RU": "Форма возврата",
    },
    question: {
        "en-US": "WHY YOU WANT TO REFUND THIS ITEM?",
        "en-UK": "WHY YOU WANT TO REFUND THIS ITEM?",
        "ru-RU": "Почему вы хотите вернуть заказ?",
    },
    dontLike: {
        "en-US": "Item didn't like me",
        "en-UK": "Item didn't like me",
        "ru-RU": "Вещь мне не понравилась",
    },
    dontCorrect: {
        "en-US": "Item's color/size isn't correct",
        "en-UK": "Item's color/size isn't correct",
        "ru-RU": "Цвет/размер вещи неккоректен",
    },
    wrongDescription: {
        "en-US": "Item doesn't match the description in the store",
        "en-UK": "Item doesn't match the description in the store",
        "ru-RU": "Вещь не подходит под описание в магазине"
    },
    wrongAppearance: {
        "en-US": "Dissatisfaction with appearance",
        "en-UK": "Dissatisfaction with appearance",
        "ru-RU": "Неудовлетворенность внешним видом",
    },
    longShipping: {
        "en-US": "Shipping is very long",
        "en-UK": "Shipping is very long",
        "ru-RU": "Очень долгая доставка",
    },
    wrongItemOrdered: {
        "en-US": "Wrong item ordered",
        "en-UK": "Wrong item ordered",
        "ru-RU": "Заказана не та вещь",
    },
    wrongQuantity: {
        "en-US": "I ordered more items than I wanted",
        "en-UK": "I ordered more items than I wanted",
        "ru-RU": "Заказано больше вещей чем хотелось",
    },
    quantityForRefund: {
        "en-US": "Quantity for refund:",
        "en-UK": "Quantity for refund:",
        "ru-RU": "Количество вещей к возврату",
    },
    otherReasons: {
        "en-US": "Other reasons:",
        "en-UK": "Other reasons:",
        "ru-RU": "Другие причины:",
    },
    refundItem: {
        "en-US": "Refund item/order",
        "en-UK": "Refund item/order",
        "ru-RU": "Вернуть вещь/заказ",
    },
};

const wishlist = {
    addItemsToWL: {
        "en-US": "Add items to wishlist",
        "en-UK": "Add items to wishlist",
        "ru-RU": "Добавьте вещи в избранное",
    },
    saveWL: {
        "en-US": "For save that wishlist, please login",
        "en-UK": "For save that wishlist, please login",
        "ru-RU": "Для сохранения списка избранных нужно войти в аккаунт",
    }
};

const shop = {
    shop: {
        "en-US": "Shop",
        "en-UK": "Shop",
        "ru-RU": "Магазин",
    },
    women: {
        "en-US": "for her",
        "en-UK": "for her",
        "ru-RU": "Для нее",
    },
    men: {
        "en-US": "for him",
        "en-UK": "for him",
        "ru-RU": "Для него",
    },
    unisex: {
        "en-US": "for them",
        "en-UK": "for them",
        "ru-RU": "Для них",
    },
    house: {
        "en-US": "timshee",
        "en-UK": "timshee",
        "ru-RU": "timshee",
    },
    about: {
        "en-US": "about",
        "en-UK": "about",
        "ru-RU": "обо мне",
    },
    changeLanguage: {
        "en-US": "change language",
        "en-UK": "change language",
        "ru-RU": "Сменить язык",
    },
    account: {
        "en-US": "account",
        "en-UK": "account",
        "ru-RU": "Аккаунт",
    },
    details: {
        "en-US": "details",
        "en-UK": "details",
        "ru-RU": "В аккаунт",
    },
    collections: {
        "en-US": "collections",
        "en-UK": "collections",
        "ru-RU": "Коллекции",
    },
    addressBook: {
        "en-US": "address book",
        "en-UK": "address book",
        "ru-RU": "Адреса",
    },
    wishlist: {
        "en-US": "wishlist",
        "en-UK": "wishlist",
        "ru-RU": "Избранное",
    },
    orders: {
        "en-US": "orders",
        "en-UK": "orders",
        "ru-RU": "Заказы",
    },
    cart: {
        "en-US": "cart",
        "en-UK": "cart",
        "ru-RU": "Корзина",
    },
    filters: {
        "en-US": "filters:",
        "en-UK": "filters:",
        "ru-RU": "Фильтры:"
    },
    size: {
        "en-US": "size:",
        "en-UK": "size:",
        "ru-RU": "Размер:"
    },
    color: {
        "en-US": "color",
        "en-UK": "color:",
        "ru-RU": "Цвет:",
    },
    type: {
        "en-US": "type",
        "en-UK": "type:",
        "ru-RU": "Тип:",
    },
};

const cart = {
    yourCart: {
        "en-US": "your cart",
        "en-UK": "your cart",
        "ru-RU": "Твоя корзина",
    },
    checkout: {
        "en-US": "checkout",
        "en-UK": "checkout",
        "ru-RU": "Оформить заказ",
    },
    taxesAndShipping: {
        "en-US": "Shipping and taxes calculated at checkout",
        "en-UK": "Shipping and taxes calculated at checkout",
        "ru-RU": "Доставка и налоги рассчитаются при оформлении заказа"
    },
    remove: {
        "en-US": "remove",
        "en-UK": "remove",
        "ru-RU": "Удалить",
    },
    removeAll: {
        "en-US": "remove all",
        "en-UK": "remove all",
        "ru-RU": "Удалить всё",
    },
    cartIsEmpty: {
        "en-US": "cart is empty",
        "en-UK": "cart is empty",
        "ru-RU": "Корзина пуста",
    },
}

const authForms = {
    forgotPassword: {
        "en-US": "I forgot my password",
        "en-UK": "I forgot my password",
        "ru-RU": "Я забыл(-а) пароль",
    },
    login: {
        "en-US": "Login",
        "en-UK": "Login",
        "ru-RU": "Войти в аккаунт",
    },
    password: {
        "en-US": "Password:",
        "en-UK": "Password:",
        "ru-RU": "Пароль:",
    },
    firstname: {
        "en-US": "First Name:",
        "en-UK": "First Name:",
        "ru-RU": "Имя:",
    },
    lastname: {
        "en-US": "Last Name:",
        "en-UK": "Last Name:",
        "ru-RU": "Фамилия",
    },
    passwordConfirm: {
        "en-US": "Password confirm:",
        "en-UK": "Password confirm:",
        "ru-RU": "Подтверждение пароля",
    },
    register: {
        "en-US": "Register",
        "en-UK": "Register",
        "ru-RU": "Создать аккаунт",
    },
};

const checkout = {
    cart: {
        "en-US": "cart",
        "en-UK": "cart",
        "ru-RU": "Корзина",
    },
    information: {
        "en-US": "information",
        "en-UK": "information",
        "ru-RU": "Информация",
    },
    shipping: {
        "en-US": "shipping",
        "en-UK": "shipping",
        "ru-RU": "Метод доставки",
    },
    payment: {
        "en-US": "Pay now",
        "en-UK": "Pay now",
        "ru-RU": "Оплатить сейчас",
    },
    contact: {
        "en-US": "contact",
        "en-UK": "contact",
        "ru-RU": "Контактная информация",
    },
    shippingAddress: {
        "en-US": "shipping address:",
        "en-UK": "shipping address:",
        "ru-RU": "Адрес доставки:",
    },
    shippingMethod: {
        "en-US": "shipping method:",
        "en-UK": "shipping method",
        "ru-RU": "Метод доставки",
    },
    toShipping: {
        "en-US": "continue to shipping",
        "en-UK": "continue to shipping",
        "ru-RU": "Выбрать метод доставки",
    },
    toCart: {
        "en-US": "return to cart",
        "en-UK": "return to cart",
        "ru-RU": "Вернуться в корзину",
    },
    shippingInfo: {
        "en-US": "shipping info",
        "en-UK": "shipping info",
        "ru-RU": "Данные доставки",
    },
    subtotal: {
        "en-US": "subtotal:",
        "en-UK": "subtotal:",
        "ru-RU": "Подытог:",
    },
    total: {
        "en-US": "total:",
        "en-UK": "total:",
        "ru-RU": "Итог:",
    },
    toPayment: {
        "en-US": "continue to payment",
        "en-UK": "continue to payment",
        "ru-RU": "Перейти к оплате",
    },
    toInformation: {
        "en-US": "return to information",
        "en-UK": "return to information",
        "ru-RU": "Вернуться к заполнению информации",
    },
};

const stuff = {
    loading: {
        "en-US": "loading...",
        "en-UK": "loading...",
        "ru-RU": "Загрузка..."
    },
    nothing: {
        "en-US": "nothing",
        "en-UK": "nothing",
        "ru-RU": "Ничего не нашлось"
    },
    error: {
        "en-US": "error",
        "en-UK": "error",
        "ru-RU": "Ошибка",
    },
    error500: {
        "en-US": "SERVER ERROR 500. WE ARE ALREADY SOLVING THIS PROBLEM",
        "en-UK": "SERVER ERROR 500. WE ARE ALREADY SOLVING THIS PROBLEM",
        "ru-RU": "ОШИБКА 500. Мы уже занимаемся это проблемой",
    },
    startPage: {
        "en-US": "For start to work you need to add some data to DB: continents, countries, phone codes, provinces, categories and collections",
        "en-UK": "For start to work you need to add some data to DB: continents, countries, phone codes , provinces, categories and collections",
        "ru-RU": "Для начала работы нужно добавить некоторые данные в БД: континенты, страны, коды телефонов стран, регионы, категории и коллекции"
    },
    paymentOptions: {
        "en-US": "Payment options:",
        "en-UK": "Payment options:",
        "ru-RU": "Способы оплаты:"
    },
    emailExists: {
        "en-US": "email already exists...",
        "en-UK": "email already exists...",
        "ru-RU": "Указанный email уже существует..."
    },
    offer: {
        "en-US": "offer",
        "en-UK": "offer",
        "ru-RU": "Оферта",
    },
    contacts: {
        "en-US": "contacts",
        "en-UK": "contacts",
        "ru-RU": "Обратная связь",
    },
    shippingMethods: {
        "en-US": "shipping methods",
        "en-UK": "shipping methods",
        "ru-RU": "Способы доставки",
    }
};

const forms = {
    country: {
        "en-US": "Country:",
        "en-UK": "Country:",
        "ru-RU": "Страна:",
    },
    firstname: {
        "en-US": "First Name:",
        "en-UK": "First Name:",
        "ru-RU": "Имя:",
    },
    lastname: {
        "en-US": "Last Name:",
        "en-UK": "Last Name:",
        "ru-RU": "Фамилия:",
    },
    streetAddress: {
        "en-US": "Street address:",
        "en-UK": "Street address:",
        "ru-RU": "Адрес:",
    },
    apartment: {
        "en-US": "Apartment:",
        "en-UK": "Apartment:",
        "ru-RU": "Квартира (по желанию):"
    },
    postalCode: {
        "en-US": "Postal Code:",
        "en-UK": "Postal Code:",
        "ru-RU": "Почтовый индекс:"
    },
    city: {
        "en-US": "City:",
        "en-UK": "City:",
        "ru-RU": "Город:"
    },
    province: {
        "en-US": "Province/State:",
        "en-UK": "Province/State:",
        "ru-RU": "Регион:",
    },
    phoneCode: {
        "en-US": "Phone Code:",
        "en-UK": "Phone Code:",
        "ru-RU": "Код телефона:"
    },
    phoneNumber: {
        "en-US": "Phone Number:",
        "en-UK": "Phone Number:",
        "ru-RU": "Номер телефона:"
    },
    asPrimary: {
        "en-US": "as primary",
        "en-UK": "as primary",
        "ru-RU": "Установить как главный адрес"
    },
    submit: {
        "en-US": "Submit",
        "en-UK": "Submit",
        "ru-RU": "Отправить"
    },
    newEmail: {
        "en-US": "New Email:",
        "en-UK": "New Email:",
        "ru-RU": "Новый email:",
    },
    changeEmail: {
        "en-US": "Change Email:",
        "en-UK": "Change Email:",
        "ru-RU": "Сменить email:",
    },
    email: {
        "en-US": "email:",
        "en-UK": "email:",
        "ru-RU": "email:",
    }
}

const language = () => {
    return localStorage.getItem("language") !== null ? localStorage.getItem("language") : "ru-RU";
};

const setLanguage = async (language) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        const token = AuthService.getAccessToken();
        if (token?.access) {
            headers["Authorization"] = `Bearer ${token.access}`
        }
        const response = await fetch(`${API_URL}api/stuff/lang/`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                language: language,
            }),
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("language", data.language);
            return data.language;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
};

const getLanguage = async () => {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        const token = AuthService.getAccessToken();
        if (token?.access) {
            headers["Authorization"] = `Bearer ${token.access}`
        }
        const response = await fetch(`${API_URL}api/stuff/lang/`, {
            method: "GET",
            headers,
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("language", data.language);
            return data.language;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
};

const TranslateService = {
    language,
    getLanguage,
    setLanguage,
    siteCreated,
    orderPaid,
    itemCardDetail,
    account,
    authForms,
    refundForm,
    wishlist,
    shop,
    cart,
    checkout,
    forms,
    stuff,
};

export default TranslateService;