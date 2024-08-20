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
  if (ok.status) {
    await loadPosts();
    let clear = (...val) => {
      for (const element of val) {
        element.value = "";
      }
    };
    clear(username, password, name, email, image);
    homeBtn.click();
  } else {
    let add = (...val) => {
      for (const element of val) {
        element.classList.add("incorrect-input");
      }
    };
    const warn = document.getElementById("register-warning");
    warn.innerText = ok.message;
    warn.style.display = "block";
    add(username, password, name, email, image);
    await new Promise((r) => setTimeout(r, 4000));
    warn.style.display = "none";
    rem(username, password, name, email, image);
  }
});
async function addCompletePosts(posts, dest, upToDown) {
  for (const post of posts) {
    createPost(post, dest, upToDown);
    const userInfo = user.getUserInfo();
    let profile_image, id;
    if (userInfo.status) {
      ({ profile_image, id } = userInfo.data);
      document.querySelector(`.add-comment[data-id="${post.id}"] img`).src =
        profile_image ?? "assets/user.jpg";
    } else {
      document.querySelector(`.add-comment[data-id="${post.id}"] img`).src =
        "assets/user.jpg";
    }
    const showComments = document.querySelector(
      `.comment-btn[data-id="${post.id}"]`
    );
    const {
      author: { id: userId },
    } = post;
    const settingMenu = document.querySelector(
      `.post-setting-menu[data-id="${post.id}"]`
    );
    if (id !== userId) {
      settingMenu.parentElement.style.display = "none";
    }
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
    await new Promise((r) => setTimeout(r, 100));
  }
}
const observer = new IntersectionObserver(
  (entries) => {
    const lastPost = entries[0];
    if (!lastPost.isIntersecting) {
      return;
    }
    observer.unobserve(lastPost.target);
    loadPosts();
  },
  {
    threshold: 0.1, // Adjust threshold to ensure that more posts load only when the last post is barely visible
  }
);
async function loadPosts() {
  const posts = await user.getPosts(10);
  if (posts.status) {
    addCompletePosts(posts.data, homePosts, true).then(() => {
      if (homePosts.children.length >= 10) {
        observer.observe(homePosts.querySelector(".post:last-child"));
      }
    });
  }
}
async function createPostItem() {
  const postTitle = document.getElementById("postTitle");
  const postBody = document.getElementById("postBody");
  const body = escapeHtml(postBody.value.trim());
  const title = escapeHtml(postTitle.value.trim());
  const file = document.getElementById("imgUplaod").files[0];
  const post = await user.createPost(file, title, body);
  postTitle.value = "";
  postBody.value = "";
  document.getElementById("clearImages").click();
  if (post.status) {
    createPost(post.data, homePosts);
    const { profile_image } = user.getUserInfo().data;
    document.querySelector(`.add-comment[data-id="${post.data.id}"] img`).src =
      profile_image;
    const addCommentButton = document.querySelector(
      `.add-comment-btn[data-id="${post.data.id}"]`
    );
    addCommentButton.addEventListener("click", async () => {
      addComment(post.data.id);
    });
  } else {
    const warnMsg = document.getElementById("add-post-warning");
    warnMsg.classList.add("show");
    warnMsg.innerText = post.message;
    await new Promise((r) => setTimeout(r, 2000));
    warnMsg.classList.remove("show");
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
    await new Promise((r) => setTimeout(r, 4000));
    input.parentElement.classList.remove("incorrect-input");
    return;
  }
  input.value = "";
  const comment = await user.createComment(postId, body);
  if (comment.status) {
    createCommentItem(comment.data, commentsSection);
    commentCount.innerText = +commentCount.innerText + 1;
  } else {
    console.log(comment.message);
    input.parentElement.classList.toggle("incorrect-input");
    await new Promise((r) => setTimeout(r, 4000));
    input.parentElement.classList.remove("incorrect-input");
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
  if (comments.status) {
    commentCount.innerText = comments.data.length;
    for (const comment of comments.data) {
      createCommentItem(comment, commentsSection);
    }
  } else {
    console.log(comments.message);
  }
}
async function loadUserPosts() {
  const posts = await user.getUserPosts();
  if (posts.status) {
    addCompletePosts(posts.data, profilePosts);
  }
}
function loadProfileInfo() {
  const userImage = document.querySelector(".user-image img");
  const userName = document.querySelector("#usn");
  const nameEle = document.querySelector("#name");
  const logoutBtn = document.getElementById("logout");
  const userInfo = user.getUserInfo();
  if (!userInfo.status) {
    console.log(userInfo.message);
    return;
  }

  const { name, username, id, profile_image } = userInfo.data;
  document.getElementById("add-post-user-image").src = profile_image;
  userImage.src = profile_image ?? "assets/user.jpg";
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
async function login() {
  const inputs = document.querySelectorAll("#login input");
  const [usn, pass] = inputs;
  usn.classList.remove("incorrect-input");
  pass.classList.remove("incorrect-input");
  const ok = await user.login(usn.value, pass.value);
  if (ok.status) {
    await loadPosts();
    homeBtn.click();
  } else {
    const warn = document.getElementById("login-warning");
    warn.innerText = ok.message;
    warn.style.display = "block";
    usn.classList.add("incorrect-input");
    pass.classList.add("incorrect-input");
    await new Promise((r) => setTimeout(r, 4000));
    warn.style.display = "none";
    usn.classList.remove("incorrect-input");
    pass.classList.remove("incorrect-input");
  }
}
loginBtn.addEventListener("click", login);
async function loadUserLocally(userData) {
  if (userData && (await user.loginFromLocal(userData)).status) {
    await loadPosts();
    const lastPage = localStorage.getItem("lastPage");
    if (lastPage) {
      document.getElementById(`${lastPage}`).click();
    } else {
      homeBtn.click();
    }
  } else {
    signBtn.click();
  }
}
profileBtn.addEventListener("click", async () => {
  homePosts.innerHTML = "";
  profilePosts.innerHTML = "";
  if (user.getUserInfo().status) {
    await loadProfile();
    removeSelectedPages(profileBtn.id);
    profileBtn.classList.add("icon-active");
    profilePage.style.display = "block";
  }
});
homeBtn.addEventListener("click", async () => {
  homePosts.innerHTML = "";
  profilePosts.innerHTML = "";
  loadProfileInfo();
  await loadPosts();
  removeSelectedPages(homeBtn.id);
  homeBtn.classList.add("icon-active");
  homePage.style.display = "block";
});
function editPost(postId) {}
(async () => {
  const userData = localStorage.getItem("userData");
  loadUserLocally(userData);
})();
