"use strict";
const addPostbtn = document.getElementById("add-post-btn");
const imageFileLoader = document.getElementById("imgUplaod");
const clearImages = document.getElementById("clearImages");
const preview = document.getElementById("file-preview");

function createCommentItem({
  id,
  userId,
  profile_image,
  name,
  userName,
  reactionCount,
  body,
}) {
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
  post.querySelector(".comment-btn").addEventListener("click", () => {
    commentSection.classList.toggle("show");
  });
  post.querySelector(".add-comment-btn").addEventListener("click", () => {
    const body = addCommentInput.value.trim();
    addCommentInput.value = "";
    console.log(body);
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
  post.querySelector(".post-setting-btn").onclick = () => {
    settingMenu.classList.toggle("show");
  };
  post.querySelector(".removePost").onclick = () => {
    document.querySelector(`.post[data-id="${id}"]`).remove();
  };
}

function createPost({
  name,
  userName,
  id,
  userImge,
  userId,
  profile_image,
  body,
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

clearImages.onclick = () => {
  preview.setAttribute("src", "");
  clearImages.style.display = "none";
};

imageFileLoader.onchange = () => {
  const file = imageFileLoader.files;
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      preview.setAttribute("src", event.target.result);
      clearImages.style.display = "block";
    };
    fileReader.readAsDataURL(file[0]);
  }
};

function addPost() {
  const addPostInput = document.querySelector("#add-post textarea");
  const body = addPostInput.value.trim();
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

const profileBtn = document.getElementById("profile-btn");
const homeBtn = document.getElementById("home-btn");
const homePage = document.getElementById("home");
const profilePage = document.getElementById("profile");
const loginPage = document.getElementById("login");
const loginBtn = document.getElementById("login-btn");
homeBtn.onclick = () => {
  profileBtn.classList.remove("icon-active");
  homeBtn.classList.add("icon-active");
  homePage.style.display = "block";
  profilePage.style.display = "none";
};
profileBtn.onclick = () => {
  homeBtn.classList.remove("icon-active");
  profileBtn.classList.add("icon-active");
  homePage.style.display = "none";
  profilePage.style.display = "block";
};

(async () => {
  let post = {
    name: "moam",
    userName: "test",
    id: "123",
    userImge: "../assets/design.png",
    userId: "34",
    profile_image: "../assets/design.png",
    body: "lorefgkjh nfdkdmfjn",
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
  //   document.getElementById("add-post").after(createPost(post));
})();
