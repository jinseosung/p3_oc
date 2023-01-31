"use strict";

const main = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  const category = await fetch("http://localhost:5678/api/categories");
  const categories = await category.json();

  generateCategories(categories);
  generateWorks(works);

  const categoriesListElement = document.querySelector(".categories-list");
  categoriesListElement.addEventListener("click", (e) => {
    const target = e.target;
    const focusedClassName = document.querySelector(".focused");
    if (target.tagName === "LI" && focusedClassName) {
      focusedClassName.classList.remove("focused");
      target.classList.add("focused");
      if (!target.id) {
        generateWorks(works);
      } else {
        const worksFiltres = works.filter(
          (work) => work.categoryId === parseInt(target.id)
        );
        generateWorks(worksFiltres);
      }
    }
  });
};

const generateCategories = (categories) => {
  const mesProjetsElement = document.querySelector("#portfolio h2");
  const categoriesListElement = document.createElement("ul");
  categoriesListElement.classList.add("categories-list");
  const tousListElement = document.createElement("li");
  tousListElement.classList.add("focused");
  tousListElement.innerText = "Tous";
  categoriesListElement.appendChild(tousListElement);
  mesProjetsElement.after(categoriesListElement);
  for (let i = 0; i < categories.length; i++) {
    const categorie = categories[i];

    const listElement = document.createElement("li");
    listElement.id = categorie.id;
    listElement.innerText = categorie.name;
    categoriesListElement.appendChild(listElement);
  }
};

main();
