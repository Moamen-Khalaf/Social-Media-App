"use strict";
const addPostbtn = document.getElementById("add-post-btn");
const imageFileLoader = document.getElementById("imgUplaod");
const clearImages = document.getElementById("clearImages");
const preview = document.getElementById("file-preview");
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
function createCommentItem({
  id,
  userId,
  profile_image,
  name,
  userName,
  reactionCount,
  body,
}) {
  body = escapeHtml(body);
  const comment = document.createRange()
    .createContextualFragment(`<div class="comment-item">
              <div class="comment-header">
                <div class="comment-user" data-id=${id} data-user-id=${userId}>
                  <img src=${profile_image}  />
                  <div>
                     <h3>${name}</h3>
                     <h4>${userName}</h4>
                  </div>
                </div>
                <div>
                  <span>${reactionCount}</span>
                  <button class="fa-regular fa-heart"></button>
                </div>
              </div>
              <div class="desc">
                ${body}
              </div>
            </div>`);
  return comment;
}

function addComments(comments, commentSection, commentCount) {
  for (const element of Object.values(comments)) {
    commentSection.appendChild(createCommentItem(element));
    commentCount.textContent = +commentCount.textContent + 1;
  }
}

function setFunctionlaity(post, commentSection, commentCount, id) {
  const addCommentInput = post.querySelector(`.add-input`);
  const settingMenu = post.querySelector(".post-setting-menu");
  const descSecion = post.querySelector(".desc");

  post.querySelector(".comment-btn").addEventListener("click", () => {
    commentSection.classList.toggle("show");
  });
  descSecion.addEventListener("click", () => {
    descSecion.classList.toggle("show");
  });
  post.querySelector(".add-comment-btn").addEventListener("click", () => {
    const body = escapeHtml(addCommentInput.value.trim());
    addCommentInput.value = "";
    if (!body) {
      return;
    }
    const comment = {
      id: "23",
      userId: "123",
      profile_image: "../assets/design.png",
      name: "2wer",
      userName: "werg",
      reactionCount: "0",
      body: body,
    };
    commentSection.appendChild(createCommentItem(comment));
    commentCount.textContent = +commentCount.textContent + 1;
  });
  post.querySelector(".post-setting-btn").addEventListener("click", () => {
    settingMenu.classList.toggle("show");
  });
  post.querySelector(".removePost").addEventListener("click", () => {
    document.querySelector(`.post[data-id="${id}"]`).remove();
  });
}

function createPost({
  name,
  userName,
  id,
  userImge,
  userId,
  profile_image,
  body,
  title,
  image,
  reactionCount,
  comments,
}) {
  const post = document.createRange()
    .createContextualFragment(`<div class="post" data-id=${id} data-user-id=${userId}>
        <!-- header -->
        <div class="post-header">
          <div class="post-user">
            <img src=${profile_image}  class="sm-image" />
            <div>
              <h3>${name}</h3>
              <h4>${userName}</h4>
            </div>
          </div>
          <div class="relative">
            <button class="post-setting-btn fa-solid fa-ellipsis-vertical"></button>
            <div class="post-setting-menu">
                <button class="removePost">Remove Post</button>
            </div>
          </div>
        </div>
        <!-- desc -->
        <h4 class="title">${title}</h4>
        <div class="desc">
          ${body}
        </div>
        <!-- post image -->
        <div class="post-image">
          <img src=${image}  />
        </div>
        <div>
          <div class="post-reaction">
            <div>
              <button class="fa-regular fa-heart"></button>
              <span class="reaction-count">${reactionCount}</span>
            </div>
            <div>
                <span class="comment-count" >0</span>
                <button class="comment-btn fa-solid fa-comment"></button>
            </div>
          </div>
          <div class="comments">
            
          </div>
          <!-- add comment -->
          <div class="add-comment">
            <img src=${userImge} alt="userImge" />
            <input
              type="text"
              placeholder="Write something..."
              class="add-input"
            />
            <button class="add-comment-btn fa-solid fa-paper-plane text-accent"></button>
          </div>
        </div>
      </div>`);
  const commentCount = post.querySelector(".comment-count");
  const commentSection = post.querySelector(".comments");

  addComments(comments, commentSection, commentCount);
  setFunctionlaity(post, commentSection, commentCount, id);
  return post;
}

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

function addPost() {
  const addPostInput = document.querySelector("#add-post textarea");
  const body = escapeHtml(addPostInput.value.trim());
  if (!body) {
    return;
  }
  const image = preview.getAttribute("src") || "#";
  let post = {
    name: "moam",
    userName: "test",
    id: "123",
    userImge: "../assets/design.png",
    userId: "34",
    profile_image: "../assets/design.png",
    body: body,
    image: image,
    reactionCount: "0",
    commentCount: "0",
    comments: {},
  };
  clearImages.click();
  addPostInput.value = "";
  document.getElementById("add-post").after(createPost(post));
}
addPostbtn.addEventListener("click", addPost);

const homePage = document.getElementById("home");
const profilePage = document.getElementById("profile");
const signPage = document.getElementById("sign-page");
const homeBtn = document.getElementById("home-btn");
const profileBtn = document.getElementById("profile-btn");
const signBtn = document.getElementById("sign-page-btn");
function removeSelectedPages() {
  profileBtn.classList.remove("icon-active");
  homeBtn.classList.remove("icon-active");
  signBtn.classList.remove("icon-active");
  homePage.style.display = "none";
  profilePage.style.display = "none";
  signPage.style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
homeBtn.addEventListener("click", () => {
  removeSelectedPages();
  homeBtn.classList.add("icon-active");
  homePage.style.display = "block";
});
profileBtn.addEventListener("click", () => {
  removeSelectedPages();
  profileBtn.classList.add("icon-active");
  profilePage.style.display = "block";
});
signBtn.addEventListener("click", () => {
  removeSelectedPages();
  signBtn.classList.add("icon-active");
  signPage.style.display = "block";
});
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const loginPage = document.getElementById("login");
const registerPage = document.getElementById("register");
loginBtn.addEventListener("click", () => {
  loginPage.style.display = "flex";
  registerPage.style.display = "none";
});
registerBtn.addEventListener("click", () => {
  registerPage.style.display = "flex";
  loginPage.style.display = "none";
});
(async () => {
  if (!localStorage.getItem("userData")) {
    // signBtn.click();
    homeBtn.click();
  }
  let post = {
    name: "moam",
    userName: "test",
    id: "123",
    userImge: "../assets/design.png",
    userId: "34",
    profile_image: "../assets/design.png",
    body: `class UserActions extends URLs {
  async #fetchURL(url, config) {
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        
      }
      return await response.json();
    } catch (error) {
      
    }
  }
  async login() {}
  async register() {}
  async getPosts() {}
  async getUserPosts() {}
  async getPostComments() {}
  async getUserProfile() {}
  logout(removeLocalData = true) {
    !removeLocalData || localStorage.removeItem("userData");
  }
}`,
    title: "Lorem",
    image: "../assets/design.png",
    reactionCount: "12",
    commentCount: "5",
    comments: {
      1: {
        id: "23",
        userId: "123",
        profile_image: "../assets/design.png",
        name: "2wer",
        userName: "werg",
        reactionCount: "22",
        body: "23wergfkmlmkl",
      },
      2: {
        id: "23",
        userId: "123",
        profile_image: "../assets/design.png",
        name: "2wer",
        userName: "werg",
        reactionCount: "22",
        body: "23wergfkmlmkl",
      },
    },
  };
  homePage.appendChild(createPost(post));
  homePage.appendChild(createPost(post));
  homePage.appendChild(createPost(post));
  profilePage.appendChild(createPost(post));
  profilePage.appendChild(createPost(post));
  profilePage.appendChild(createPost(post));
})();
