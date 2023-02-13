"use strict";

const logIn = () => {
  const logInBtn = document.querySelector("#login form");
  logInBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.querySelector(`input[name="email"]`);
    const password = e.target.querySelector(`input[name="password"]`);
    const user = {
      email: email.value,
      password: password.value,
    };
    const chargeUtil = JSON.stringify(user);

    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtil,
    });
    const result = await response.json();
    
    if (result) {
      if (result.message) {
        alert(result.message);
      } else if (result.error) {
        alert("password error");
      } else {
        const TOKEN = result.token;
        localStorage.setItem("token", TOKEN);
        location.assign("index.html");
      }
    }
  });
};

logIn();
