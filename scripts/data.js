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
function editPost(postId) {
  const saveChanges = document.querySelector(
    `.save-changes[data-id="${postId}"]`
  );
  const titleInput = document.querySelector(
    `.post[data-id="${postId}"] .title`
  );
  const settingMenu = document.querySelector(
    `.post-setting-menu[data-id="${postId}"]`
  );
  const descInput = document.querySelector(`.post[data-id="${postId}"] .desc`);
  const replaceImage = document.querySelector(
    `.post[data-id="${postId}"] .replace-image`
  );

  const imageInput = replaceImage.querySelector("input");
  imageInput.onchange = () => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      replaceImage.parentElement
        .querySelector("img")
        .setAttribute("src", event.target.result);
    };
    fileReader.readAsDataURL(imageInput.files[0]);
  };
  replaceImage.classList.add("show");
  settingMenu.classList.remove("show");
  saveChanges.classList.add("show");
  titleInput.setAttribute("contenteditable", "true");
  descInput.setAttribute("contenteditable", "true");
  saveChanges.onclick = async () => {
    replaceImage.classList.remove("show");
    saveChanges.classList.remove("show");
    titleInput.removeAttribute("contenteditable");
    descInput.removeAttribute("contenteditable");
    const response = await user.editPost(
      imageInput.files[0],
      titleInput.innerText,
      descInput.innerText,
      postId
    );
    if (response.status) {
      const { created_at, image, body, title } = response.data;
      document.querySelector(`.time[data-id="${postId}"]`).innerText =
        created_at;
      replaceImage.parentElement
        .querySelector("img")
        .setAttribute("src", image);
      titleInput.innerText = title;
      descInput.innerText = body;
    } else {
      console.log(response.status);
    }
  };
}
async function saveProfileEdits(imageFile, name, email) {
  const response = await user.editProfile(imageFile, name, email);
  if (response.status) {
    loadProfileInfo(user.getUserInfo().data.id);
  } else {
    const warnMsg = document.getElementById("profile-warning");
    warnMsg.classList.add("show");
    warnMsg.innerText = response.message + "!";
    await new Promise((r) => setTimeout(r, 5000));
    warnMsg.classList.remove("show");
  }
}
function updateProfileInfo() {
  const editBtn = document.getElementById("edit-profile");
  const saveBtn = document.getElementById("save-profile");
  editBtn.classList.remove("show");
  saveBtn.classList.add("show");

  const userImage = document.querySelector(".user-image img");
  const editOverlay = document.querySelector(".user-image > label");
  editOverlay.style.display = "flex";
  const nameEle = document.querySelector("#name");
  const logoutBtn = document.getElementById("logout");
  const userEmail = document.querySelector(".profile-header .email");
  const toggleEdit = (...eles) => {
    eles.forEach((ele) => {
      ele.toggleAttribute("contenteditable");
    });
  };
  logoutBtn.classList.remove("show");
  toggleEdit(userImage, nameEle, userEmail);
  const imageInput = editOverlay.querySelector("input");
  imageInput.onchange = () => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      userImage.setAttribute("src", event.target.result);
    };
    fileReader.readAsDataURL(imageInput.files[0]);
  };
  saveBtn.onclick = () => {
    toggleEdit(userImage, nameEle, userEmail);
    saveProfileEdits(
      imageInput.files[0],
      nameEle.innerText,
      userEmail.innerText
    );
    editOverlay.style.display = "none";
    saveBtn.classList.remove("show");
    editBtn.classList.add("show");
    logoutBtn.classList.add("show");
  };
}
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
function setPostEvents(post) {
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
  const settingMenu = document.querySelector(
    `.post-setting-menu[data-id="${post.id}"]`
  );
  const {
    author: { id: userId },
  } = post;
  if (id !== userId) {
    settingMenu.parentElement.style.display = "none";
  }
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
    .querySelector(`.editPost[data-id="${post.id}"]`)
    .addEventListener("click", () => {
      editPost(post.id);
    });
  document.querySelector(`.removePost[data-id="${post.id}"]`).onclick = () => {
    if (user.removePost(post.id)) {
      document.querySelector(`.post[data-id="${post.id}"]`).remove();
    }
  };
  const userImage = document.querySelector(
    `.post[data-id="${post.id}"] .post-user img`
  );
  userImage.addEventListener("click", async () => {
    const freindId = userImage.getAttribute("data-user-id");
    const response = await user.getFriendData(freindId);
    if (response.status) {
      loadUser(freindId);
    }
  });
}
function loadUser(userId) {
  profilePosts.innerHTML = "";
  homePosts.innerHTML = "";
  removeSelectedPages();
  profileBtn.classList.add("icon-active");
  profilePage.style.display = "block";
  if (user.getUserInfo().data.id == userId) {
    document.getElementById("logout").classList.add("show");
    document.getElementById("edit-profile").classList.add("show");
  } else {
    document.getElementById("logout").classList.remove("show");
    document.getElementById("edit-profile").classList.remove("show");
  }
  loadProfile(userId);
}
async function addCompletePosts(posts, dest, upToDown) {
  for (const post of posts) {
    createPost(post, dest, upToDown);
    setPostEvents(post);
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
    setPostEvents(post.data);
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
      const userImage = document.querySelector(
        `.comment-user[data-id="${comment.id}"] img`
      );
      userImage.addEventListener("click", async () => {
        const response = await user.getFriendData(comment.author.id);
        if (response.status) {
          loadUser(comment.author.id);
        }
      });
    }
  } else {
    console.log(comments.message);
  }
}
async function loadUserPosts(userId) {
  const posts = await user.getUserPosts(userId);
  if (posts.status) {
    addCompletePosts(posts.data.reverse(), profilePosts, true);
  }
}
async function loadProfileInfo(userId) {
  const userInfo = await user.getFriendData(userId);
  if (!userInfo.status) {
    console.log(userInfo.message);
    return;
  }
  const userImage = document.querySelector(".user-image img");
  const userName = document.querySelector("#usn");
  const nameEle = document.querySelector("#name");
  const logoutBtn = document.getElementById("logout");
  const userEmail = document.querySelector(".profile-header .email");
  const commentCount = document.querySelector(
    ".profile-header .comments_count"
  );
  const postsCount = document.querySelector(".profile-header .posts_count");
  let {
    name,
    username,
    id,
    profile_image,
    posts_count,
    comments_count,
    email,
  } = userInfo.data;
  document.getElementById("add-post-user-image").src = profile_image;

  userImage.src = profile_image ?? "assets/user.jpg";
  userName.innerText = `@${username}`;
  nameEle.innerText = name;
  userEmail.innerText = email;
  commentCount.innerText = comments_count;
  postsCount.innerText = posts_count;
  logoutBtn.addEventListener("click", () => {
    user.logout(true);
    window.location.reload();
    signPage.click();
  });
  document
    .getElementById("edit-profile")
    .addEventListener("click", updateProfileInfo);
}
async function loadProfile(userId) {
  loadProfileInfo(userId);
  loadUserPosts(userId);
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
    loadPosts();
    homeBtn.click();
  } else {
    signBtn.click();
  }
}
profileBtn.addEventListener("click", async () => {
  if (user.getUserInfo().status) {
    loadUser(user.getUserInfo().data.id);
  }
});
homeBtn.addEventListener("click", async () => {
  homePosts.innerHTML = "";
  profilePosts.innerHTML = "";
  loadProfileInfo(user.getUserInfo().data.id);
  await loadPosts();
  removeSelectedPages();
  homeBtn.classList.add("icon-active");
  homePage.style.display = "block";
});
signBtn.addEventListener("click", () => {
  removeSelectedPages();
  signBtn.classList.add("icon-active");
  signPage.style.display = "block";
});
(async () => {
  const userData = localStorage.getItem("userData");
  loadUserLocally(userData);
})();
