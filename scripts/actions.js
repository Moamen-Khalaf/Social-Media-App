"use strict";

const imageFileLoader = document.getElementById("imgUplaod");
const clearImages = document.getElementById("clearImages");
const preview = document.getElementById("file-preview");
// sign
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const loginPage = document.getElementById("login");
const registerPage = document.getElementById("register");
// Pages
const homePage = document.getElementById("home");
const profilePage = document.getElementById("profile");
const signPage = document.getElementById("sign-page");
const homeBtn = document.getElementById("home-btn");
const profileBtn = document.getElementById("profile-btn");
const signBtn = document.getElementById("sign-page-btn");
// Mode
const toggleModeBtn = document.getElementById("toggle-mode");
export { signBtn, homeBtn, profileBtn };
export { homePage, profilePage, signPage };
clearImages.addEventListener("click", () => {
  preview.setAttribute("src", "");
  clearImages.style.display = "none";
});
imageFileLoader.addEventListener("change", () => {
  const file = imageFileLoader.files;
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      preview.setAttribute("src", event.target.result);
      clearImages.style.display = "block";
    };
    fileReader.readAsDataURL(file[0]);
  }
});

export function removeSelectedPages(id) {
  profileBtn.classList.remove("icon-active");
  homeBtn.classList.remove("icon-active");
  signBtn.classList.remove("icon-active");
  homePage.style.display = "none";
  profilePage.style.display = "none";
  signPage.style.display = "none";
  localStorage.setItem("lastPage", id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

signBtn.addEventListener("click", () => {
  removeSelectedPages(signBtn.id);
  signBtn.classList.add("icon-active");
  signPage.style.display = "block";
});

loginBtn.addEventListener("click", () => {
  loginPage.style.display = "flex";
  registerPage.style.display = "none";
});
registerBtn.addEventListener("click", () => {
  registerPage.style.display = "flex";
  loginPage.style.display = "none";
});
toggleModeBtn.addEventListener("click", () => {
  toggleModeBtn.toggleAttribute("dark");
  document.documentElement.classList.toggle("dark");
  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("prefMode", "dark");
  } else {
    localStorage.setItem("prefMode", "light");
  }
});

(() => {
  const userData = localStorage.getItem("userData");
  const prefMode = localStorage.getItem("prefMode");

  if (!userData) {
    signBtn.click();
  }
  if (prefMode) {
    prefMode === "light" || toggleModeBtn.click();
  }
})();
