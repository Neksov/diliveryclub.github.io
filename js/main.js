const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//DAY1//
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');
const labelAuth = document.querySelector('.label-auth');


let login = localStorage.getItem('Delivery');
/*modalAuth.classList.add('Hello');
console.log(modalAuth.classList.contains('Hello')); //есть такой класс или нет и возвращает true или false
modalAuth.classList.remove('.modal-auth');
modalAuth.classList.toggle('Hello');// добавляет или удаляет*/

//console.dir(modalAuth); //dir-выводит в консоле в виде обьекта

function toogleModalAuth() {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle('is-open');
}

function authorized() {
  //для обнуления строки
  function logOut() {
    login = null;
    localStorage.removeItem('Delivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }
  console.log('Авторизован');
  userName.textContent = login; //свойство которое содержит текст внутри этого элемента
  buttonAuth.style.display = 'none'; //скрываем кнопку после того как авториз
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}

function maskInput(string) {
  return !!string.trim();
}

function notAuthorized() {
  console.log('Не авторизован');

  function logIn(event) {
    event.preventDefault(); //чтоб не перезагружалась страница

    if (maskInput(loginInput.value)) { //метод trim удаляет пробелы
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
      loginInput.style.borderColor = 'red'
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
checkAuth();