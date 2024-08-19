import UserActions from "./auth.js";
import { escapeHtml } from "./layout.js";
import { removeSelectedPages } from "./actions.js";
import {
  homeBtn,
  homePage,
  profileBtn,
  profilePage,
  signBtn,
  signPage,
} from "./actions.js";
import { createCommentItem, createPost } from "./layout.js";
const user = new UserActions();
// yarob11123
// 123456
const loginBtn = document.getElementById("sign-login-btn");
const registBtn = document.getElementById("register-sign");
const createPostBtn = document.getElementById("add-post-btn");
const homePosts = document.getElementById("home-posts");
const profilePosts = document.getElementById("profile-posts");
registBtn.addEventListener("click", async () => {
  const inputs = document.querySelectorAll("#register input");
  const [username, password, name, email, image] = inputs;
  let rem = (...val) => {
    for (const element of val) {
      element.classList.remove("incorrect-input");
    }
  };
  rem(username, password, name, email, image);
  const ok = await user.register(
    username.value,
    password.value,
    image.files[0],
    name.value,
    email.value
  );
  if (ok) {
    await loadPosts();
    homeBtn.click();
  } else {
    let add = (...val) => {
      for (const element of val) {
        element.classList.add("incorrect-input");
      }
    };
    add(username, password, name, email, image);
  }
});
function addCompletePosts(posts, dest) {
  for (const post of posts) {
    createPost(post, dest);
    const { profile_image } = user.getUserInfo();
    document.querySelector(`.add-comment[data-id="${post.id}"] img`).src =
      profile_image;
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
async function loadPosts() {
  const { profile_image } = user.getUserInfo();
  document.getElementById("add-post-user-image").src = profile_image;
  const posts = await user.getPosts(10);
  if (posts) {
    addCompletePosts(posts, homePosts);
  }
}
async function createPostItem() {
  const postTitle = document.getElementById("postTitle");
  const postBody = document.getElementById("postBody");
  const body = escapeHtml(postBody.value.trim());
  const title = escapeHtml(postTitle.value.trim());
  if (!body || !title) {
    const warnMsg = document.getElementById("add-post-warning");
    warnMsg.classList.add("show");
    await new Promise((r) => setTimeout(r, 2000));
    warnMsg.classList.remove("show");
    return;
  }
  const file = document.getElementById("imgUplaod").files[0];
  const post = await user.createPost(file, title, body);
  postTitle.value = "";
  postBody.value = "";
  document.getElementById("clearImages").click();
  if (post) {
    createPost(post, homePosts);
    const { profile_image } = user.getUserInfo();
    document.querySelector(`.add-comment[data-id="${post.id}"] img`).src =
      profile_image;
    const addCommentButton = document.querySelector(
      `.add-comment-btn[data-id="${post.id}"]`
    );
    addCommentButton.addEventListener("click", async () => {
      addComment(post.id);
    });
  }
}
createPostBtn.addEventListener("click", createPostItem);
async function addComment(postId) {
  const input = document.querySelector(`.add-input[data-id="${postId}"]`);
  input.parentElement.classList.remove("incorrect-input");
  const commentsSection = document.querySelector(
    `.comments[data-id="${postId}"]`
  );
  const commentCount = document.querySelector(
    `[data-id="${postId}"] .comment-count`
  );
  const body = input.value.trim();
  if (!body) {
    input.parentElement.classList.toggle("incorrect-input");
    return;
  }
  input.value = "";
  const comment = await user.createComment(postId, body);
  if (comment) {
    createCommentItem(comment, commentsSection);
    commentCount.innerText = +commentCount.innerText + 1;
  }
}
async function loadComments(postId) {
  const commentsSection = document.querySelector(
    `.comments[data-id="${postId}"]`
  );
  const commentCount = document.querySelector(
    `[data-id="${postId}"] .comment-count`
  );
  commentsSection.innerHTML = "";
  if (!commentsSection.classList.contains("show")) {
    return;
  }
  const comments = await user.getPostComments(postId);
  commentCount.innerText = comments.length;
  for (const comment of comments) {
    createCommentItem(comment, commentsSection);
  }
}
async function loadUserPosts() {
  const posts = await user.getUserPosts();
  if (posts) {
    addCompletePosts(posts, profilePosts);
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
}
async function loadContent() {
  await Promise.all([loadProfile(), loadPosts()]);
}
async function login() {
  const inputs = document.querySelectorAll("#login input");
  const [usn, pass] = inputs;
  usn.classList.remove("incorrect-input");
  pass.classList.remove("incorrect-input");
  const ok = await user.login(usn.value, pass.value);
  if (ok) {
    await loadPosts();
    homeBtn.click();
  } else {
    usn.classList.add("incorrect-input");
    pass.classList.add("incorrect-input");
  }
}
loginBtn.addEventListener("click", login);
async function loadUserLocally(userData) {
  if (await user.loginFromLocal(userData)) {
    loadPosts();
    homeBtn.click();
  } else {
    signBtn.click();
  }
}
profileBtn.addEventListener("click", async () => {
  homePosts.innerHTML = "";
  profilePosts.innerHTML = "";
  await loadProfile();
  removeSelectedPages(profileBtn.id);
  profileBtn.classList.add("icon-active");
  profilePage.style.display = "block";
});
homeBtn.addEventListener("click", async () => {
  homePosts.innerHTML = "";
  profilePosts.innerHTML = "";
  await loadPosts();
  removeSelectedPages(homeBtn.id);
  homeBtn.classList.add("icon-active");
  homePage.style.display = "block";
});
(async () => {
  const userData = localStorage.getItem("userData");
  const lastPage = localStorage.getItem("lastPage");
  if (userData) {
    loadUserLocally(userData);
  }
  if (lastPage) {
    document.getElementById(`${lastPage}`).click();
  }
})();
