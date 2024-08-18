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
        throw `Network Error : ${response.status} , ${response.url}`;
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  async createPost() {}
  async editPost() {}
  async removePost(postId) {
    const url = this.#URLs.getPost(postId);
    try {
      if (!this.#user.isAuthorized()) {
        throw "UnAuthorized";
      }
      const data = await this.#fetchURL(url, {
        method: "DELETE",
        redirect: "follow",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.#user.token}`,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async createComment(postId, body) {
    const url = this.#URLs.getComment(postId);
    try {
      if (!this.#user.isAuthorized()) {
        throw "UnAuthorized";
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
      return data.data;
    } catch (error) {
      console.log(error);
      return null;
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
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async register(username, password, image, name, email) {}
  async getPosts(limit) {
    const url = this.#URLs.getPosts(limit, this.#currentPage++);
    try {
      const data = await this.#fetchURL(url, {
        method: "GET",
        redirect: "follow",
        Accept: "application/json",
      });
      // console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  }
  async getUserPosts() {
    const url = this.#URLs.getUserPosts(this.#user.id);
    try {
      const data = await this.#fetchURL(url, {
        method: "GET",
        redirect: "follow",
        Accept: "application/json",
      });
      return data.data;
    } catch (error) {
      console.log(error);
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
      return data.data.comments;
    } catch (error) {
      return [];
    }
  }
  async getUserProfile(id) {}
  getUserInfo() {
    const { name, username, id, profile_image } = this.#user;
    return { name, username, id, profile_image };
  }
  logout(removeLocalData = true) {
    !removeLocalData || localStorage.clear();
  }
}
