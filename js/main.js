'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');
const labelAuth = document.querySelector('.label-auth');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const modalPrice = document.querySelector('.modal-pricetag');
const modalBody = document.querySelector('.modal-body');
const buttonClearCart = document.querySelector('.clear-cart');


let login = localStorage.getItem('Delivery');
/*modalAuth.classList.add('Hello');
console.log(modalAuth.classList.contains('Hello')); //есть такой класс или нет и возвращает true или false
modalAuth.classList.remove('.modal-auth');
modalAuth.classList.toggle('Hello');// добавляет или удаляет*/

//console.dir(modalAuth); //dir-выводит в консоле в виде обьекта
const cart = [];
//асинхронная функиця
const getData = async function (url) {
  //запрос на сервер
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибка ${response.status}!`);
  }
  return await response.json();
}

//валидация
const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str); //возвращает true или false 
}

const toggleModal = function () {
  modal.classList.toggle("is-open");
}

const toogleModalAuth = function () {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle('is-open');
}

function returnMain() {
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
}

function authorized() {
  //для обнуления строки
  function logOut() {
    login = null;
    localStorage.removeItem('Delivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';

    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  }
  console.log('Авторизован');
  userName.textContent = login; //свойство которое содержит текст внутри этого элемента
  buttonAuth.style.display = 'none'; //скрываем кнопку после того как авториз
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}

function maskInput(string) {
  return !!string.trim();
}

function notAuthorized() {
  console.log('Не авторизован');

  function logIn(event) {
    event.preventDefault(); //чтоб не перезагружалась страница

    if (valid(loginInput.value)) { //метод trim удаляет пробелы
      login = loginInput.value; //вводим новое значение в поле имя
      //метод setItem добовляет свойство со значением в наш localStorage
      localStorage.setItem('Delivery', login);
      toogleModalAuth(); //закрываем модальное окно
      //вешаем событие на кнопку Войти когда произойдет клик выполнится функция и очистится
      buttonAuth.removeEventListener('click', toogleModalAuth);
      closeAuth.removeEventListener('click', toogleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset(); //очищаем поля ввода
    } else {
      loginInput.style.borderColor = 'red' //подкрашивает рамку
      loginInput.value = '' //очищает

    }


    checkAuth();
  }
  //вешаем событие на кнопку Войти когда произойдет клик выполнится функция
  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
  logInForm.addEventListener('submit', logIn)
}

//для проверки аторизованности
function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant({
  image,
  kitchen,
  name,
  price,
  products,
  stars,
  time_of_delivery: timeOfDelivery
}) {

  const card = `
    <a class="card card-restaurant" data-products="${products}">
    <img src="${image}" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
        ${stars}
        </div>
        <div class="price">От  ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
    </a>
  `;
  //добавляем карточку
  cardsRestaurants.insertAdjacentHTML('beforeend', card)
}

function createCardGood({
  description,
  image,
  name,
  price,
  id
}) {

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="image" class="card-image" />
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart" id="${id}">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price card-price-bold">${price} ₽</strong>
        </div>
      </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card)
}

function openGoods(event) {
  const target = event.target; //нужен чтоб определить на какую карточку кликнули
  if (login) {

    const restaurant = target.closest('.card-restaurant'); //closest()- метод который подымается по выше стоящим элементам ,пока не найдет елемент с этим селектором,если не найдет вернет null
    if (restaurant) {
      //очещаем cardsMenu
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    } else {
      toogleModalAuth();
    }
  }
}

//корзина
function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    const food = cart.find(function (item) {
      return item.id === id;
    })
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }
}

function renderCart() {
  modalBody.textContent = '';//очищаем корзину
  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${cost}</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id=${id}>-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus" data-id=${id}>+</button>
      </div>
    </div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart)
  });
  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost) * item.count); //сумируем в карзине
  }, 0);
  modalPrice.textContent = totalPrice + 'P';
}
//будем определять куда кликнули +\-
function changeCount(event) {
  const target = event.target
  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    };
    if (target.classList.contains('counter-plus')) food.count++;
    renderCart();
  }
}

function init() {
  getData(`./db/partners.json`).then(function (data) {
    data.forEach(createCardRestaurant);
  });
  //оброботчики событий
  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });
  // обнуление карзины
  buttonClearCart.addEventListener('click', function () {
    cart.length = 0;
    renderCart();

  });

  modalBody.addEventListener('click', changeCount);
  close.addEventListener("click", toggleModal);
  cardsMenu.addEventListener('click', addToCart);
  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide')
    restaurants.classList.remove('hide')
    menu.classList.add('hide')
  });

  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true,
  });
}

init();