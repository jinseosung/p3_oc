"use strict";

const TOKEN = localStorage.getItem("token");

const logOutBtn = document.querySelector("nav ul li:nth-child(3)");
const modalOpenBtn = document.querySelector("#portfolio .modify-btn");
const modalElement = document.querySelector(".modal");
const modalContainerElement = document.querySelector(".modal__container");
const modalBackBtn = document.querySelector(".modal__icons i:first-child");
const modalCloseBtn = document.querySelector(".modal__icons i:nth-child(2)");

const main = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  generateWorks(works);

  logOutBtn.addEventListener("click", onLogOut);

  modalOpenBtn.addEventListener("click", () => {
    openModal();
    generateModal();
  });

  modalCloseBtn.addEventListener("click", () => {
    closeModal();
  });

  modalElement.addEventListener("click", (e) => {
    const target = e.target;
    if (target.className !== "modal") {
      return;
    }
    closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (
      (modalElement.style.display === "flex" && e.key === "Escape") ||
      e.key === "Esc"
    ) {
      closeModal();
    }
  });
};

const generatePhotoEditeur = (works, photos) => {
  for (let i = 0; i < works.length; i++) {
    const article = works[i];

    const articleElement = document.createElement("article");
    articleElement.classList.add("modal__photo");
    articleElement.id = article.id;
    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-trash-can");
    const pElement = document.createElement("p");
    pElement.innerText = "éditer";
    const imageElement = document.createElement("img");
    imageElement.setAttribute("crossorigin", "anonymous");
    imageElement.src = article.imageUrl;
    imageElement.alt = article.title;

    articleElement.appendChild(iconElement);
    articleElement.appendChild(pElement);
    articleElement.prepend(imageElement);
    photos.appendChild(articleElement);
  }

  ajoutAtricleDeleteBtn();
};

const generateModal = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  modalBackBtn.classList.add("hidden");
  modalContainerElement.innerHTML = "";

  const titleElement = document.createElement("h3");
  titleElement.innerText = "Galerie photo";
  const modalPhotosElement = document.createElement("div");
  modalPhotosElement.classList.add("modal__photos");
  const modalBtnsElement = document.createElement("div");
  modalBtnsElement.classList.add("modal__btns");
  const ajoutPhotoBtn = document.createElement("button");
  ajoutPhotoBtn.innerText = "Ajouter une photo";
  const deleteGalerieBtn = document.createElement("button");
  deleteGalerieBtn.innerText = "supprimer la galerie";

  modalBtnsElement.appendChild(ajoutPhotoBtn);
  modalBtnsElement.appendChild(deleteGalerieBtn);
  modalContainerElement.appendChild(titleElement);
  modalContainerElement.appendChild(modalPhotosElement);
  modalContainerElement.appendChild(modalBtnsElement);

  generatePhotoEditeur(works, modalPhotosElement);

};

const onLogOut = () => {
  localStorage.removeItem("token");
  location.assign("index.html");
};

const openModal = () => {
  modalElement.style.display = "flex";
};

const closeModal = () => {
  modalElement.style.display = "none";
};

const ajoutAtricleDeleteBtn = () => {
  const articleDeleteBtn = document.querySelectorAll(".modal__photo i");
  articleDeleteBtn.forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const target = e.target.parentNode;
      const targetId = e.target.parentNode.id;
      await fetch(`http://localhost:5678/api/works/${targetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      }).then((response) => {
        if (response.status !== 401 && response.status !== 500) {
          const figures = document.querySelectorAll(".gallery figure");
          target.remove();
          figures.forEach((figure) => {
            if (targetId === figure.id) {
              figure.remove();
            }
          });
        }
      });
    })
  );
};

main();
