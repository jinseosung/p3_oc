"use strict";

const TOKEN = localStorage.getItem("token");

const logOutBtn = document.querySelector("nav ul li:nth-child(3)");
const openModalBtn = document.querySelector("#portfolio .modify-btn");
const modalElement = document.querySelector(".modal");
const modalContainerElement = document.querySelector(".modal__container");
const backModalBtn = document.querySelector(".modal__icons i:first-child");
const closeModalBtn = document.querySelector(".modal__icons i:nth-child(2)");

const main = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  generateWorks(works);

  logOutBtn.addEventListener("click", onLogOut);

  openModalBtn.addEventListener("click", () => {
    openModal();
    generateModal();
  });

  closeModalBtn.addEventListener("click", () => {
    closeModal();
  });

  backModalBtn.addEventListener("click", () => {
    generateModal();
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

  addTrashBtn();
};

const resetModal = () => {
  backModalBtn.classList.toggle("hidden");
  modalContainerElement.innerHTML = "";
};

const generateModal = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  resetModal();

  const titleElement = document.createElement("h3");
  titleElement.innerText = "Galerie photo";
  const modalPhotosElement = document.createElement("div");
  modalPhotosElement.classList.add("modal__photos");
  const modalLineElement = document.createElement("div");
  modalLineElement.classList.add("modal__line");
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
  modalContainerElement.appendChild(modalLineElement);
  modalContainerElement.appendChild(modalBtnsElement);

  generatePhotoEditeur(works, modalPhotosElement);

  ajoutPhotoBtn.addEventListener("click", openAjoutPhotoModal);
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

const addTrashBtn = () => {
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

const generatecategoryoption = async (selectElement) => {
  const category = await fetch("http://localhost:5678/api/categories");
  const categories = await category.json();

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const optionElement = document.createElement("option");
    optionElement.value = category.id;
    optionElement.innerText = category.name;
    selectElement.appendChild(optionElement);
  }
};

const onFormSubmit = (formElement) => {
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formElement);

    await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        const gallery = document.querySelector(".gallery");

        const figureElement = document.createElement("figure");
        figureElement.id = result.id;
        const imageElement = document.createElement("img");
        imageElement.setAttribute("crossorigin", "anonymous");
        imageElement.src = result.imageUrl;
        imageElement.alt = result.title;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = result.title;

        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);
        gallery.appendChild(figureElement);
      });
  });
};

const changeBtnColor = (file, title, select, btn) => {
  const onChange = () => {
    if (file.value && title.value && select.value) {
      btn.classList.remove("not-valid");
    } else {
      btn.classList.add("not-valid");
    }
  };
  file.addEventListener("change", onChange);
  title.addEventListener("input", onChange);
  select.addEventListener("change", onChange);
};

const openAjoutPhotoModal = () => {
  resetModal();

  const titleElement = document.createElement("h3");
  titleElement.innerText = "Ajout photo";
  const formElement = document.createElement("form");
  formElement.classList.add("modal__form");
  const modalFileElement = document.createElement("div");
  modalFileElement.classList.add("modal__file");
  const fileIconElement = document.createElement("i");
  fileIconElement.classList.add("fa-regular", "fa-image");
  const fileLabelElement = document.createElement("label");
  fileLabelElement.setAttribute("for", "file");
  fileLabelElement.innerText = "+ Ajouter photo";
  const fileInputElement = document.createElement("input");
  fileInputElement.setAttribute("type", "file");
  fileInputElement.setAttribute("accept", "image/*");
  fileInputElement.setAttribute("id", "file");
  fileInputElement.setAttribute("name", "image");
  fileInputElement.setAttribute("required", "required");
  const pElement = document.createElement("p");
  pElement.innerText = "jpg, png : 4mo max";
  const titleLabelElement = document.createElement("label");
  titleLabelElement.setAttribute("for", "title");
  titleLabelElement.innerText = "Titre";
  const titleInputElement = document.createElement("input");
  titleInputElement.setAttribute("type", "text");
  titleInputElement.setAttribute("name", "title");
  titleInputElement.setAttribute("id", "title");
  titleInputElement.setAttribute("required", "required");
  const categoryLabelElement = document.createElement("label");
  categoryLabelElement.setAttribute("for", "category");
  categoryLabelElement.innerText = "Catégorie";
  const selectElement = document.createElement("select");
  selectElement.setAttribute("id", "category");
  selectElement.setAttribute("name", "category");
  selectElement.setAttribute("required", "required");
  const optionElement = document.createElement("option");
  const modalLineElement = document.createElement("div");
  modalLineElement.classList.add("modal__line-ajout");
  const modalBtnsElement = document.createElement("div");
  modalBtnsElement.classList.add("modal__btns");
  const modalValidBtnElement = document.createElement("button");
  modalValidBtnElement.setAttribute("type", "submit");
  modalValidBtnElement.classList.add("modal__btn-valid", "not-valid");
  modalValidBtnElement.innerText = "Valider";

  modalFileElement.appendChild(fileIconElement);
  modalFileElement.appendChild(fileLabelElement);
  modalFileElement.appendChild(fileInputElement);
  modalFileElement.appendChild(pElement);
  selectElement.appendChild(optionElement);
  modalBtnsElement.appendChild(modalValidBtnElement);
  formElement.appendChild(modalFileElement);
  formElement.appendChild(titleLabelElement);
  formElement.appendChild(titleInputElement);
  formElement.appendChild(categoryLabelElement);
  formElement.appendChild(selectElement);
  formElement.appendChild(modalLineElement);
  formElement.appendChild(modalBtnsElement);
  modalContainerElement.appendChild(titleElement);
  modalContainerElement.appendChild(formElement);

  generatecategoryoption(selectElement);
  onFormSubmit(formElement);

  changeBtnColor(
    fileInputElement,
    titleInputElement,
    selectElement,
    modalValidBtnElement
  );
};

main();
