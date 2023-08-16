"use strict";
let data = [],
  page = 1, //номер открытой страницы
  maxPage = 1, // номер максимальной страницы
  value = "", //значение в input
  sort = 0, //сортировка - 1 - по дате по убыванию, 2- по дате по возрастанию, 3- по рейтингу по убыванию, 4 - по рейтингу по возрастанию
  mouseDown = false, // для отслеживания mouseDown на модальном окне
  id = -1; // id для удаления из таблицы

function trueMouseDown(event) {
  mouseDown = true;
  event.stopPropagation();
}

function falseMouseDown(event) {
  mouseDown = false;
  event.stopPropagation();
}

function openModal(index) {
  id = Number(index);
  let modal = document.getElementById("modal");
  modal.classList.remove("vHidden");
  modal.focus();
}

function deleteRow() {
  data = data.filter((i) => Number(i.id) !== id);
  mouseDown = true;
  closeModal();
  createTable();
}

function closeModal() {
  if (mouseDown) {
    document.getElementById("modal");
    modal.classList.add("vHidden");
    id = -1;
  }
}

function createTable() {
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = tbody.children[0].outerHTML; // очищаем таблицу кроме заголовка
  let copyData = structuredClone(
    data.filter((e) => {
      if (
        e.username.toLowerCase().includes(value.toLowerCase()) ||
        e.email.toLowerCase().includes(value.toLowerCase())
      ) {
        return true;
      } else return false;
    })
  ); //копирую список фильтруя по поиску
  maxPage = Math.ceil(copyData.length / 5) || 1; // меняю максимальное значение страниц
  if (page > maxPage) {
    page = maxPage;
  }
  createPages();
  copyData
    .sort((a, b) => {
      if (sort === 1) {
        return new Date(b.registration_date) - new Date(a.registration_date);
      } else if (sort === 2) {
        return new Date(a.registration_date) - new Date(b.registration_date);
      } else if (sort === 3) {
        return b.rating - a.rating;
      } else if (sort === 4) {
        return a.rating - b.rating;
      }
    })
    .slice(5 * page - 5, 5 * page)
    .forEach((el) => {
      let tr = document.createElement("tr");
      tr.classList.add("table-row");
      tr.innerHTML =
        `<td class="table-user">${el.username}</td>` +
        `<td>${el.email}</td>` +
        `<td>${new Date(el.registration_date).toLocaleDateString("RU")}</td>` +
        `<td>${el.rating}</td>` +
        '<td class="wrapper-btn_close">' +
        `<button class="btn_close" type="button" onclick="openModal(${el.id})" ><img src="image/cancel.svg" alt="удалить"  class="table-cancel"/></button>` +
        "</td>";

      tbody.appendChild(tr);
    }); // заполняю таблицу
  if (!copyData.length) {
    let tr = document.createElement("tr");
    tr.classList.add("table-row");
    tr.innerHTML = '<th colSpan="5">Нет пользователей</th>';
    tbody.appendChild(tr);
  } // если нет значений отображаю что пользователей нет
}

function createPages() {
  if (page !== 1) {
    document.getElementById("back").classList.remove("vHidden");
  } else {
    document.getElementById("back").classList.add("vHidden");
  }
  if (page < maxPage) {
    document.getElementById("next").classList.remove("vHidden");
  } else {
    document.getElementById("next").classList.add("vHidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("input").addEventListener("input", (e) => {
    value = e.target.value;
    e.target.value = value;
    page = 1;
    visibleClear();
  });
  document.getElementById("back").addEventListener("click", () => {
    page--;
    createTable();
  });

  document.getElementById("next").addEventListener("click", () => {
    page++;
    createTable();
  });

  document.getElementById("clean").addEventListener("click", () => clean());

  document
    .querySelectorAll(".sort-p")
    .forEach((el) => el.addEventListener("click", (e) => sorted(e)));

  function sorted(e) {
    const act = document.querySelector(".active");
    if (act) {
      act.classList.remove("active");
    }
    e.target.classList.add("active");
    if (sort === Number(e.target.value)) {
      sort++;
    } else sort = Number(e.target.value);
    visibleClear();
  }

  function visibleClear() {
    const clear = document.getElementById("clean");
    if (document.querySelector(".active") || value) {
      clear.classList.remove("vHidden");
    } else clear.classList.add("vHidden");
    createTable();
  }

  function clean() {
    value = "";
    sort = 0;
    const active = document.querySelectorAll(".active");
    const input = document.getElementById("input");
    input.value = value;
    active.forEach((el) => {
      el.classList.remove("active");
    });
    visibleClear();
  }

  function loadData() {
    fetch("https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users")
      .then((data) => data.json())
      .then((res) => {
        data = res;
        createTable();
      });
  }

  loadData();
});
