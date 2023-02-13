"use strict";

const justifyConnection = () => {
  if (!localStorage.getItem("token")) {
    main();
  } else {
    management();
  }
};

const main = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  const category = await fetch("http://localhost:5678/api/categories");
  const categories = await category.json();

  const logInBtn = document.querySelector("nav ul li:nth-child(3)");

  generateCategories(categories);
  generateWorks(works);

  const categoriesListElement = document.querySelector(".categories-list");
  categoriesListElement.addEventListener("click", (e) => filterWorks(e, works));

  logInBtn.addEventListener("click", () => location.assign("login.html"));
};

const filterWorks = (e, works) => {
  const target = e.target;
  const filteredWorks = works.filter(
    (work) => work.categoryId === parseInt(target.value)
  );
  const focusedCategory = document.querySelector(".focused");

  if (target.tagName === "LI" && focusedCategory) {
    focusedCategory.classList.remove("focused");
    target.classList.add("focused");

    !target.value ? generateWorks(works) : generateWorks(filteredWorks);
  }
};

const generateCategories = (categories) => {
  const portfolioTitleElement = document.querySelector(".portfolio-title");
  const categoriesListElement = document.createElement("ul");
  categoriesListElement.classList.add("categories-list");
  const tousListElement = document.createElement("li");
  tousListElement.classList.add("focused");
  tousListElement.innerText = "Tous";
  categoriesListElement.appendChild(tousListElement);
  portfolioTitleElement.after(categoriesListElement);

  generateCategory(categories, "li", categoriesListElement);
};

justifyConnection();
