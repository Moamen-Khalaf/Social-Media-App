class URLs {
  #baseURL = "https://tarmeezacademy.com/api/v1";
  register = this.#baseURL + "/register";
  login = this.#baseURL + "/login";
  logout = this.#baseURL + "/logout";
  updateProfile = this.#baseURL + "/updatePorfile";
  users = this.#baseURL + "/users";
  posts = this.#baseURL + "/posts";
  getUser(id) {
    return `${this.users}/${id}`;
  }
  getUserPosts(id) {
    return `${this.users}/${id}/posts`;
  }
  getPosts(limit, pageNumber) {
    return `${this.posts}?limit=${limit}&page=${pageNumber}`;
  }
  getPost(id) {
    return `${this.posts}/${id}`;
  }
  getComment(id) {
    return `${this.posts}/${id}/comments`;
  }
}
class User {
  username;
  name;
  email;
  id;
  profile_image;
  comments_count;
  posts_count;
  password;
  token;
  serialize() {
    return JSON.stringify(this);
  }
  saveLocally() {
    localStorage.setItem("userData", this.serialize());
  }
  isAuthorized() {
    return this.token ? true : false;
  }
  setUser(
    { username, name, email, id, profile_image, comments_count, posts_count },
    token,
    password
  ) {
    this.username = username;
    this.name = name;
    this.email = email;
    this.id = id;
    if (Object.keys(profile_image).length === 0) {
      profile_image = "assets/user.jpg";
    }
    this.profile_image = profile_image;
    this.comments_count = comments_count;
    this.posts_count = posts_count;
    this.password = password;
    this.token = token;
    this.saveLocally();
  }
}
export default class UserActions {
  #currentPage = 1;
  #user;
  #URLs;
  constructor() {
    this.#user = new User();
    this.#URLs = new URLs();
  }
  async #fetchURL(url, config) {
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const msg = await response.json();
        throw {
          status: `Network Error : ${response.status} , ${response.url}`,
          message: msg.message,
        };
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  async getFriendData(friendId) {
    const url = this.#URLs.getUser(friendId);
    try {
      const data = await this.#fetchURL(url, {
        method: "GET",
        redirect: "follow",
        Accept: "application/json",
      });
      return { data: data.data, status: true, message: "OK" };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  }

  async createPost(imageFile, title, body) {
    const url = this.#URLs.posts;
    try {
      if (!this.#user.isAuthorized()) {
        throw { message: "Unauthorized User" };
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const data = await this.#fetchURL(url, {
        method: "POST",
        redirect: "follow",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.#user.token}`,
        },
      });
      return { data: data.data, status: true, message: "OK" };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  }
  async register(username, password, image, name, email) {
    const url = this.#URLs.register;
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("name", name);
      formData.append("email", email);
      if (image) {
        formData.append("image", image);
      }
      const data = await this.#fetchURL(url, {
        method: "POST",
        redirect: "follow",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      this.#user.setUser(data.user, data.token, password);
      return { status: true, message: "OK" };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  }
  /**
   * function fail because the server response with the same data before edit
   * @param {*} imageFile
   * @param {*} title
   * @param {*} body
   * @param {*} postId
   * @returns { data: data.data, status: true, message: "OK" } || { status: false, message: error.message }
   */
  async editPost(imageFile, title, body, postId) {
    const url = this.#URLs.getPost(postId);
    try {
      if (!this.#user.isAuthorized()) {
        throw { message: "Unauthorized User" };
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const data = await this.#fetchURL(url, {
        method: "PUT",
        redirect: "follow",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.#user.token}`,
        },
      });
      return { data: data.data, status: true, message: "OK" };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  }
  async removePost(postId) {
    const url = this.#URLs.getPost(postId);
    try {
      if (!this.#user.isAuthorized()) {
        throw { message: "Unauthorized User" };
      }
      const data = await this.#fetchURL(url, {
        method: "DELETE",
        redirect: "follow",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.#user.token}`,
        },
      });
      return { status: true, message: "OK" };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  }
  async createComment(postId, body) {
    const url = this.#URLs.getComment(postId);
    try {
      if (!this.#user.isAuthorized()) {
        throw { message: "Unauthorized User" };
      }
      const data = await this.#fetchURL(url, {
        method: "POST",
        redirect: "follow",
        body: JSON.stringify({ body: body }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#user.token}`,
        },
      });
      return { data: data.data, status: true, message: "OK" };
    } catch (error) {
      return { status: false, message: error.message };
    }
  }
  async loginFromLocal(userData) {
    const parsedData = JSON.parse(userData);
    this.#user.setUser(parsedData, parsedData.token, parsedData.password);
    return await this.login(this.#user.username, this.#user.password);
  }
  async login(username, password) {
    const body = JSON.stringify({
      username: username,
      password: password,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
      redirect: "follow",
    };

    const url = this.#URLs.login;

    try {
      const data = await this.#fetchURL(url, requestOptions);
      this.#user.setUser(data.user, data.token, password);
      return { status: true, message: "OK" };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  }
  async getPosts(limit) {
    const url = this.#URLs.getPosts(limit, this.#currentPage++);
    try {
      const data = await this.#fetchURL(url, {
        method: "GET",
        redirect: "follow",
        Accept: "application/json",
      });
      return { data: data.data, status: true, message: "OK" };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  }
  async getUserPosts(userId) {
    const url = this.#URLs.getUserPosts(userId);
    try {
      if (!this.#user.isAuthorized()) {
        throw { message: "Unauthorized User" };
      }
      const data = await this.#fetchURL(url, {
        method: "GET",
        redirect: "follow",
        Accept: "application/json",
      });
      return { data: data.data, status: true, message: "OK" };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  }
  async getPostComments(postId) {
    const url = this.#URLs.getPost(postId);
    try {
      const data = await this.#fetchURL(url, {
        method: "GET",
        redirect: "follow",
        Accept: "application/json",
      });
      return { data: data.data.comments, status: true, message: "OK" };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  }
  getUserInfo() {
    const { name, username, id, profile_image } = this.#user;

    if (!this.#user.isAuthorized()) {
      return {
        status: false,
        message: "Unauthorized User",
        data: null,
      };
    }
    return {
      status: true,
      message: "OK",
      data: { name, username, id, profile_image },
    };
  }
  logout(removeLocalData = true) {
    !removeLocalData || localStorage.clear();
  }
}
