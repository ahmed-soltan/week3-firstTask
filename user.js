import { showNotification } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const user = User.loginUser(emailInput.value, passwordInput.value, users);
      if (user) {
        showNotification("Logged in Successfully");
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "home.html";
      } else {
        showNotification("Invalid Email Or Password", "error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const user = User.registerUser(
        nameInput.value,
        emailInput.value,
        passwordInput.value,
        users
      );

      if (user) {
        showNotification("Registered Successfully");
        window.location.href = "/";
      } else {
        showNotification("Invalid Email Or Password", "error");
      }
    });
  }
});

export class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  validatePassword() {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(this.password);
  }

  static findUserByEmail(email, users) {
    return users.find((user) => user.email === email);
  }

  static loginUser(email, password, users) {
    const user = User.findUserByEmail(email, users);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  static registerUser(name, email, password, users) {
    if (!User.findUserByEmail(email, users)) {
      const newUser = new User(name, email, password);
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      return newUser;
    }
    return null;
  }
}

const initPage = () => {
  const path = window.location.pathname;
  if (
    (path === "/register.html" || path === "/") &&
    localStorage.getItem("currentUser")
  ) {
    return (window.location.href = "/home.html");
  }
};

window.onload = initPage;
