export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
export function createCommentItem(
  {
    body,
    id,
    author: {
      created_at,
      email,
      email_verified_at,
      id: userId,
      is_fake,
      name,
      profile_image,
      remember_token,
      updated_at,
      username,
    },
  },
  dest
) {
  body = escapeHtml(body);
  if (Object.keys(profile_image).length === 0) {
    profile_image = "../assets/user.jpg";
  }
  const comment = document.createRange()
    .createContextualFragment(`<div class="comment-item">
              <div class="comment-header">
                <div class="comment-user" data-id=${id} >
                  <img src=${profile_image}  data-user-id=${userId} />
                  <div>
                     <h3>${name}</h3>
                     <h4>@${username}</h4>
                  </div>
                </div>
              </div>
              <div class="desc">
                ${body}
              </div>
            </div>`);
  dest.appendChild(comment);
}

function setPostActions(post, id) {
  const settingMenu = post.querySelector(".post-setting-menu");
  const descSecion = post.querySelector(".desc");
  const postImage = post.querySelector(".post-image img");
  const commentSection = post.querySelector(".comments");
  const commentBtn = post.querySelector(".comment-btn");
  const postSetting = post.querySelector(".post-setting-btn");
  postImage.addEventListener("click", () => {
    postImage.classList.toggle("show");
  });
  commentBtn.addEventListener("click", () => {
    commentSection.classList.toggle("show");
  });
  descSecion.addEventListener("click", () => {
    descSecion.classList.toggle("show");
  });
  postSetting.addEventListener("click", () => {
    settingMenu.classList.toggle("show");
  });
}

export function createPost(
  {
    body,
    comments_count,
    created_at,
    id,
    image,
    title,
    author: {
      created_at: user_created_at,
      email,
      email_verified_at,
      id: user_id,
      is_fake,
      name,
      profile_image,
      remember_token,
      updated_at,
      username,
    },
  },
  dest,
  upToDown
) {
  if (Object.keys(profile_image).length === 0) {
    profile_image = "../assets/user.jpg";
  }
  if (Object.keys(image).length === 0) {
    image = "#";
  }
  const post = document.createRange()
    .createContextualFragment(`<div class="post" data-id=${id}>
        <!-- header -->
        <div class="post-header">
          <div class="post-user" >
            <img src=${profile_image}  class="sm-image"  data-user-id=${user_id} />
            <div>
              <h3>${name}</h3>
              <div class="post-info">
                <h4>@${username}</h4>
                <h4>${created_at}</h4>
              </div>
            </div>
          </div>
          <div class="setting">
            <button class="save-changes fa-solid fa-check" data-id=${id} ></button>
            <button class="post-setting-btn fa-solid fa-ellipsis-vertical"></button>
            <div class="post-setting-menu" data-id=${id} >
                <button class="removePost" data-id=${id} >Remove Post</button>
                <button class="editPost" data-id=${id} >Edit Post</button>
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
          <div class="replace-image" >
            <input type="file" id=${id} accept="image/png, image/jpeg" />
            <i class="fa-solid fa-upload"></i>
          </div>
          <img src=${image}  />
        </div>
        <div>
          <div class="post-reaction">
            <div>
              <button class="fa-regular fa-heart"></button>
              <span class="reaction-count">0</span>
            </div>
            <div>
                <span class="comment-count" >${comments_count}</span>
                <button class="comment-btn fa-solid fa-comment" data-id=${id}></button>
            </div>
          </div>
          <div class="comments" data-id=${id} >
            
          </div>
          <!-- add comment -->
          <div class="add-comment" data-id=${id}>
            <img/>
            <input
              type="text"
              placeholder="Write something..."
              class="add-input"
              data-id=${id}
            />
            <button class="add-comment-btn fa-solid fa-paper-plane text-accent" data-id=${id}></button>
          </div>
        </div>
      </div>`);

  setPostActions(post, id);
  if (dest) {
    upToDown ? dest.appendChild(post) : dest.prepend(post);
  }
  return post;
}
