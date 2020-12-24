//Получение DOM - элементов
const wrapper = document.querySelector(".wrapper");
const search = document.querySelector(".search");
const reset = document.querySelector(".reset");
const emptyUsers = document.querySelector(".empty");
const loader = document.querySelector(".loader");
let table = document.createElement("table");
wrapper.appendChild(table);

//Добавление функции форматирования даты в прототип
Object.prototype.convertionData = function () {
    return this.split("T")[0].split("-").reverse().join("-");
}

//Функция debounce для минимизации лишних перерисовок
const debounce = (fn, ms) => {
    let timeout;
    return function () {
        const func = () => {
            fn.apply(null, arguments)
        };
        clearTimeout(timeout);
        timeout = setTimeout(func, ms);
    }
}

generationUserInPage = debounce(generationUserInPage, 1000);

//Получение списка пользователей с api
async function getUsers() {
    loaderOn();
    const request = await fetch("https://randomuser.me/api/?results=15");
    const users = await request.json();
    window.usersAll = users.results;
    generationUserInPage(users.results);
}

getUsers();


//Формирование данных с пользователями
function generationUserInPage(users) {
    document.querySelectorAll("table tr").forEach(el => el.remove());
    if (users.length) {
        users.map((user, index) => {
            generationTableUsers(user, index);
        });
        image();
        loaderOff();
        emptyUsers.innerHTML = "";
    } else {
        table.classList.remove("table-load");
        emptyUsers.innerHTML = "Пользователи не найдены";
    }
}

//Генерация таблицы пользователей
function generationTableUsers(user, index) {
    table.innerHTML += `<tr>
                <td>${user.name.first} ${user.name.last}</td>
                <td><div class="image-wrapper"><img class="image" id="img-${index}" src="${user.picture.thumbnail}"><div class="tooltip"></div></div></td>
                <td>${user.location.state} ${user.location.city}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.registered.date.convertionData()}</td>
                </tr>`;
    table.classList.add("table-load");
}

//Отслеживание событий поля поиска
search.addEventListener("input", (e) => {
    let arr = window.usersAll.filter(it => it.name.first === e.target.value.trim());
    generationUserInPage(arr);
});

//Тултип для изображения
function image() {
    const imageWrapper = document.querySelectorAll(".image-wrapper");
    imageWrapper.forEach((el, index) => el.addEventListener("mouseenter", function (e) {
        const tooltip = e.target.childNodes[1];
        tooltip.style.visibility = "visible";
        tooltip.innerHTML = `<img src="${window.usersAll[index].picture.large}">`;
    }))
    imageWrapper.forEach((el, index) => el.addEventListener("mouseleave", function (e) {
        console.log("leave");
        e.target.childNodes[1].style.visibility = "hidden";
    }))
}

//Отслеживание событий кнопки сброса
reset.addEventListener("click", function () {
    generationUserInPage(window.usersAll);
    search.value = "";
})

//Включение индикатора загрузки
function loaderOn() {
    loader.style.display = "block";
}

//Выключение индикатора загрузки
function loaderOff() {
    loader.style.display = "none";
}




