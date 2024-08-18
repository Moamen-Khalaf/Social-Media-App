import UserActions from "./auth.js";
import { profileBtn, profilePage, signBtn, signPage } from "./actions.js";
import { createCommentItem, createPost } from "./layout.js";
const user = new UserActions();
// yarob11123
// 123456
const loginBtn = document.getElementById("sign-login-btn");

async function loadPosts() {}
async function addComment(postId) {
  const commentsSection = document.querySelector(
    `.comments[data-id="${postId}"]`
  );
  const commentCount = document.querySelector(
    `[data-id="${postId}"] .comment-count`
  );
  const body = document
    .querySelector(`.add-input[data-id="${postId}"]`)
    .value.trim();
  const comment = await user.createComment(postId, body);
  console.log(comment);
  if (comment) {
    createCommentItem(comment, commentsSection);
    commentCount.innerText = +commentCount.innerText + 1;
  }
}
async function loadComments(postId) {
  const comments = await user.getPostComments(postId);
  for (const comment of comments) {
    const commentsSection = document.querySelector(
      `.comments[data-id="${postId}"]`
    );
    createCommentItem(comment, commentsSection);
  }
}

async function loadUserPosts() {
  const posts = await user.getUserPosts();
  for (const post of posts) {
    createPost(post, profilePage);

    const showComments = document.querySelector(
      `.comment-btn[data-id="${post.id}"]`
    );
    showComments.addEventListener("click", () => {
      loadComments(post.id);
    });
    const addCommentButton = document.querySelector(
      `.add-comment-btn[data-id="${post.id}"]`
    );
    addCommentButton.addEventListener("click", async () => {
      addComment(post.id);
    });
    document
      .querySelector(`.removePost[data-id="${post.id}"]`)
      .addEventListener("click", () => {
        if (user.removePost(post.id)) {
          document.querySelector(`.post[data-id="${post.id}"]`).remove();
        }
      });
  }
}
function loadProfileInfo() {
  const userImage = document.querySelector(".user-image img");
  const userName = document.querySelector("#usn");
  const nameEle = document.querySelector("#name");
  const logoutBtn = document.getElementById("logout");
  const { name, username, id, profile_image } = user.getUserInfo();
  userImage.src = profile_image;
  userName.innerText = username;
  nameEle.innerText = name;
  logoutBtn.addEventListener("click", () => {
    user.logout(true);
    window.location.reload();
    signPage.click();
  });
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
