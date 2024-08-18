import UserActions from "./auth.js";
import { profileBtn, profilePage, signBtn } from "./actions.js";
import { createPost } from "./layout.js";
const user = new UserActions();
// yarob11123
// 123456
const loginBtn = document.getElementById("sign-login-btn");
async function loadPosts() {}
async function loadUserPosts() {
  const posts = await user.getUserPosts();
  for (const post of posts) {
    createPost(post, profilePage);
  }
}
function loadProfileInfo() {
  const userImage = document.querySelector(".user-image img");
  const userName = document.querySelector("#usn");
  const nameEle = document.querySelector("#name");
  const { name, username, id, profile_image } = user.getUserInfo();
  userImage.src = profile_image;
  userName.innerText = username;
  nameEle.innerText = name;
}
async function loadProfile() {
  loadProfileInfo();
  await loadUserPosts();
  profileBtn.click();
}
async function loadContent() {
  await loadProfile();
  await loadPosts();
}
async function login() {
  const inputs = document.querySelectorAll("#login input");
  const [usn, pass] = inputs;
  usn.classList.remove("incorrect-input");
  pass.classList.remove("incorrect-input");
  const ok = await user.login(usn.value, pass.value);
  if (ok) {
    await loadContent();
  } else {
    usn.classList.add("incorrect-input");
    pass.classList.add("incorrect-input");
  }
}
loginBtn.addEventListener("click", login);
async function loadUserLocally(userData) {
  if (await user.loginFromLocal(userData)) {
    await loadContent();
  } else {
    signBtn.click();
  }
}
(async () => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    loadUserLocally(userData);
  }
})();
