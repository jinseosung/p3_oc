"use strict";

const generateCategory = (categories, childName, parentElement) => {
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const childElement = document.createElement(childName);
    childElement.value = category.id;
    childElement.innerText = category.name;
    parentElement.appendChild(childElement);
  }
};

const generateFigure = (figure, gallery) => {
  const figureElement = document.createElement("figure");
  figureElement.id = figure.id;
  const imageElement = document.createElement("img");
  imageElement.setAttribute("crossorigin", "anonymous");
  imageElement.src = figure.imageUrl;
  imageElement.alt = figure.title;
  const figcaptionElement = document.createElement("figcaption");
  figcaptionElement.innerText = figure.title;

  figureElement.appendChild(imageElement);
  figureElement.appendChild(figcaptionElement);
  gallery.appendChild(figureElement);
};

const generateWorks = (works) => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const figure = works[i];

    generateFigure(figure, gallery);
  }
};
