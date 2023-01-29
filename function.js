// Select všech slotů
const slots = document.querySelectorAll(".slot");
// najdi Vyskakovací okno s galerií ikon
let modalOkno = document.getElementById("icon-modal");
//najdi grid element pro ikony
const iconGrid = document.querySelector("#icon-grid");
// ikona pro zavření modal
let newDiv;
// default okno
let isModalOpen = false;
// prázdná variable pro vybraný slot
let selectedSlot;
// default obrázek
const defaultSrc = "https://img.icons8.com/ios/512/plus-2-math.png";
// url prefix
const url = "https://eletak.oresi.cz/files/Icons/CZ/";
//api
const api = "http://82.142.87.102/extAPI/api/icon/read.php?parent=2";
console.log(slots);

//funkce pro přidání eventu na každý slot
for (const slot of slots) {
  slot.addEventListener("click", openIconModal.bind(slot));
}

//funkce pro logiku html slotu
function openIconModal() {
  modalOkno.classList.toggle("hidden");

  //označení zrovna aktivního slotu
  selectedSlot = this;
  console.log(selectedSlot);

  //znovu check localstorage
  let storedImgSrc = localStorage.getItem(`imgSrc-${selectedSlot.id}`);
  let storedDataIcon = localStorage.getItem(`dataIcon-${selectedSlot.id}`);
  if (storedImgSrc) {
    selectedSlot.querySelector("img").src = storedImgSrc;
  }
  if (storedDataIcon) {
    selectedSlot.setAttribute("data-icon", storedDataIcon);
  }

  //podmínka - prázdná data-icon?
  if (selectedSlot.getAttribute("data-icon")) {
    //podmínka - existuje už button na odstranění?
    if (iconGrid.querySelector(".slot_remove")) {
      return;
    }
    //vytvoř nový div
    let newDiv = document.createElement("div");
    //pojmenuj ho class:
    newDiv.classList.add("slot_remove");
    //ikona odstranit uvnitř
    newDiv.innerHTML = `<img src="https://img.icons8.com/ios/512/minus.png" class="icon__close">`;
    //přidej do html
    iconGrid.prepend(newDiv);
    //funkce na klik - nastav default obrázek, odstraň data-icon ze slotu, odstraň samotný button, uprav localstorage, zavři modal
    newDiv.addEventListener("click", function () {
      selectedSlot.querySelector("img").src = defaultSrc;
      selectedSlot.removeAttribute("data-icon");
      iconGrid.removeChild(newDiv);
      localStorage.removeItem(`imgSrc-${selectedSlot.id}`);
      localStorage.removeItem(`dataIcon-${selectedSlot.id}`);
      modalOkno.classList.toggle("hidden");
    });
  }
}

// API FETCH
fetch(api)
  .then((response) => response.json())
  .then((data) => {
    // Loop všemi daty,vytvoř element img se src url + jméno ikony, přiřaď data-id s id ikony, class icon
    data.forEach((icon) => {
      const iconElement = `<img src="${url}${icon.filename}" data-id="${icon.id}" alt="${icon.name}" class="icon-modal">`;
      iconGrid.innerHTML += iconElement;
    });
    //přidej event na každou vytvořenou ikonu
    const icons = document.querySelectorAll(".icon-modal");
    for (let i = 0; i < icons.length; i++) {
      icons[i].addEventListener("click", handleIconClick);
    }
  });

//funkce pro logiku při kliknutí na ikonu z API
function handleIconClick(event) {
  const icon = event.target;
  // Id zvolené ikony
  const iconId = icon.getAttribute("data-id");
  console.log(iconId);
  //přiřaď data-icon atribut vybranému slotu
  selectedSlot.setAttribute("data-icon", iconId);

  // přiřazení values
  imgSrc = icon.src;
  dataIcon = iconId;
  selectedSlot.querySelector("img").src = imgSrc;
  // local storage uložení
  localStorage.setItem(`imgSrc-${selectedSlot.id}`, imgSrc);
  localStorage.setItem(`dataIcon-${selectedSlot.id}`, dataIcon);

  modalOkno.classList.toggle("hidden");

  console.log(selectedSlot);
}


//----------SEARCH-----------------

const iconSearch = document.querySelector(".icon-search");
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Hledat...";
iconSearch.appendChild(searchInput);

const allBtn = document.createElement("button");
allBtn.classList.add("allBtn");
allBtn.textContent = "Vše";
iconSearch.appendChild(allBtn);

const energyBtn = document.createElement("button");
energyBtn.classList.add("energyBtn");
energyBtn.textContent = "Energie";
iconSearch.appendChild(energyBtn);

searchInput.addEventListener("input", function (event) {
  const searchTerm = event.target.value.toLowerCase();
  const iconGrid = document.querySelector("#icon-grid");
  const icons = iconGrid.querySelectorAll(".icon-modal");

  icons.forEach(function (icon) {
    if (icon.getAttribute("alt").toLowerCase().includes(searchTerm)) {
      icon.classList.toggle("hidden", false);
    } else {
      icon.classList.toggle("hidden", true);
    }
  });
});

allBtn.addEventListener("click", function () {
  const iconGrid = document.querySelector("#icon-grid");
  const icons = iconGrid.querySelectorAll(".icon-modal");
  allBtn.classList.add("btn-active");
  energyBtn.classList.remove("btn-active");
  icons.forEach(function (icon) {
    icon.classList.toggle("hidden", false);
  });
});

energyBtn.addEventListener("click", function () {
  const iconGrid = document.querySelector("#icon-grid");
  const icons = iconGrid.querySelectorAll(".icon-modal");
  energyBtn.classList.add("btn-active");
  allBtn.classList.remove("btn-active");
  icons.forEach(function (icon) {
    if (icon.getAttribute("alt").toLowerCase().includes("energie")) {
      icon.classList.toggle("hidden", false);
    } else {
      icon.classList.toggle("hidden", true);
    }
  });
});
