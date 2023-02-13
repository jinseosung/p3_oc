"use strict";

const management = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  const openModalBtns = document.querySelectorAll(".modify-btn");
  const logOutBtn = document.querySelector("nav ul li:nth-child(3)");
  const modalElement = document.querySelector(".modal");
  const modalContainerElement = document.querySelector(".modal__container");
  const backModalBtn = document.querySelector(".modal__icons i:first-child");

  generateManagementPage(openModalBtns, logOutBtn);
  generateWorks(works);

  logOutBtn.addEventListener("click", onLogOut);

  openModalBtns.forEach((openModalBtn) => {
    openModalBtn.addEventListener("click", () => {
      openModal(modalElement);
      generateModal(modalContainerElement, backModalBtn);
    });
  });

  const closeModalBtn = document.querySelector(".modal__icons i:nth-child(2)");
  closeModalBtn.addEventListener("click", () => {
    closeModal(modalElement);
  });

  backModalBtn.addEventListener("click", () => {
    generateModal(modalContainerElement, backModalBtn);
  });

  modalElement.addEventListener("click", (e) => {
    const target = e.target;
    if (target.className !== "modal") {
      return;
    }
    closeModal(modalElement);
  });

  window.addEventListener("keydown", (e) => {
    if (modalElement.style.display !== "flex") {
      return;
    }
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(modalElement);
    }
  });
};

const generateManagementPage = (openModalBtns, logOutBtn) => {
  const modifyHeaderElement = document.querySelector(".modify-header");
  openModalBtns.forEach((openModalBtn) => {
    openModalBtn.classList.remove("hidden");
  });

  document.querySelector("header").classList.add("header-padding");
  modifyHeaderElement.style.display = "flex";

  logOutBtn.innerText = "logout";
};

const generateModalPhotos = (works, photos) => {
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

  addTrashBtns();
};

const addHiddenClass = (backModalBtn) => {
  backModalBtn.classList.add("hidden");
};

const deleteHiddenClass = (backModalBtn) => {
  backModalBtn.classList.remove("hidden");
};

const resetModal = (modalContainerElement) => {
  modalContainerElement.innerHTML = "";
};

const generateModal = async (modalContainerElement, backModalBtn) => {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  addHiddenClass(backModalBtn);
  resetModal(modalContainerElement);

  const titleElement = document.createElement("h3");
  titleElement.innerText = "Galerie photo";
  const photosDivElement = document.createElement("div");
  photosDivElement.classList.add("modal__photos");
  const lineDivElement = document.createElement("div");
  lineDivElement.classList.add("modal__line");
  const btnsDivElement = document.createElement("div");
  btnsDivElement.classList.add("modal__btns");
  const addPhotoBtn = document.createElement("button");
  addPhotoBtn.innerText = "Ajouter une photo";
  const deleteGalerieBtn = document.createElement("button");
  deleteGalerieBtn.innerText = "supprimer la galerie";

  btnsDivElement.appendChild(addPhotoBtn);
  btnsDivElement.appendChild(deleteGalerieBtn);
  modalContainerElement.appendChild(titleElement);
  modalContainerElement.appendChild(photosDivElement);
  modalContainerElement.appendChild(lineDivElement);
  modalContainerElement.appendChild(btnsDivElement);

  generateModalPhotos(works, photosDivElement);

  addPhotoBtn.addEventListener("click", () => {
    openAddPhotoModal(modalContainerElement, backModalBtn);
  });
};

const onLogOut = () => {
  localStorage.removeItem("token");
  location.assign("index.html");
};

const openModal = (modalElement) => {
  modalElement.style.display = "flex";
};

const closeModal = (modalElement) => {
  modalElement.style.display = "none";
};

const addTrashBtns = () => {
  const trashBtns = document.querySelectorAll(".modal__photo i");
  trashBtns.forEach((trashBtn) =>
    trashBtn.addEventListener("click", async (e) => {
      const target = e.target.parentNode;
      const targetId = e.target.parentNode.id;
      const TOKEN = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5678/api/works/${targetId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );
      if (response) {
        if (response.status === 401 || response.status === 500) {
          return;
        }

        const figures = document.querySelectorAll(".gallery figure");
        target.remove();
        figures.forEach((figure) => {
          if (targetId === figure.id) {
            figure.remove();
          }
        });
      }
    })
  );
};

const generateCategoryOption = async (selectElement) => {
  const category = await fetch("http://localhost:5678/api/categories");
  const categories = await category.json();

  generateCategory(categories, "option", selectElement);
};

const onFormSubmit = (formElement) => {
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    const TOKEN = localStorage.getItem("token");
    const formData = new FormData(formElement);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData,
    });
    const result = await response.json();

    if (result) {
      const modalElement = document.querySelector(".modal");
      closeModal(modalElement);

      const gallery = document.querySelector(".gallery");
      generateFigure(result, gallery);
    }
  });
};

const changeBtnColor = (file, title, select, btn) => {
  const onChange = () => {
    file.value && title.value && select.value
      ? btn.classList.remove("not-valid")
      : btn.classList.add("not-valid");
  };

  file.addEventListener("change", onChange);
  title.addEventListener("input", onChange);
  select.addEventListener("change", onChange);
};

const previewInputImg = (file, div, icon, label, p) => {
  const displayNon = (element) => (element.style.display = "none");

  file.addEventListener("change", (e) => {
    const file = e.target.files;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file[0]);
    fileReader.addEventListener("load", (e) => {
      displayNon(icon);
      displayNon(label);
      displayNon(p);
      const img = document.createElement("img");
      img.src = e.target.result;
      div.appendChild(img);
    });
  });
};

const openAddPhotoModal = (modalContainerElement, backModalBtn) => {
  deleteHiddenClass(backModalBtn);
  resetModal(modalContainerElement);

  const titleElement = document.createElement("h3");
  titleElement.innerText = "Ajout photo";
  const formElement = document.createElement("form");
  formElement.classList.add("modal__form");
  const fileDivElement = document.createElement("div");
  fileDivElement.classList.add("modal__file");
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
  const lineDivElement = document.createElement("div");
  lineDivElement.classList.add("modal__line-ajout");
  const btnsDivElement = document.createElement("div");
  btnsDivElement.classList.add("modal__btns");
  const validBtnElement = document.createElement("button");
  validBtnElement.setAttribute("type", "submit");
  validBtnElement.classList.add("modal__btn-valid", "not-valid");
  validBtnElement.innerText = "Valider";

  fileDivElement.appendChild(fileIconElement);
  fileDivElement.appendChild(fileLabelElement);
  fileDivElement.appendChild(fileInputElement);
  fileDivElement.appendChild(pElement);
  selectElement.appendChild(optionElement);
  btnsDivElement.appendChild(validBtnElement);
  formElement.appendChild(fileDivElement);
  formElement.appendChild(titleLabelElement);
  formElement.appendChild(titleInputElement);
  formElement.appendChild(categoryLabelElement);
  formElement.appendChild(selectElement);
  formElement.appendChild(lineDivElement);
  formElement.appendChild(btnsDivElement);
  modalContainerElement.appendChild(titleElement);
  modalContainerElement.appendChild(formElement);

  generateCategoryOption(selectElement);
  onFormSubmit(formElement);

  previewInputImg(
    fileInputElement,
    fileDivElement,
    fileIconElement,
    fileLabelElement,
    pElement
  );

  changeBtnColor(
    fileInputElement,
    titleInputElement,
    selectElement,
    validBtnElement
  );
};
