class URLs {
  baseURL = "https://tarmeezacademy.com/api/v1";
  register = this.baseURL + "/register";
  login = this.baseURL + "/login";
  logout = this.baseURL + "/logout";
  updateProfile = this.baseURL + "/updatePorfile";
  users = this.baseURL + "/users";
  posts = this.baseURL + "/posts";
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
class UserActions extends URLs {
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
  async login() {}
  async register() {}
  async getPosts() {}
  async getUserPosts() {}
  async getPostComments() {}
  async getUserProfile() {}
  logout(removeLocalData = true) {
    !removeLocalData || localStorage.removeItem("userData");
  }
}
class User extends UserActions {
  username;
  name;
  email;
  id;
  profile_image;
  comments_count;
  posts_count;
  #token;
  #password;
  serialize() {
    return JSON.stringify(this);
  }
  saveLocally() {
    localStorage.setItem("userData", this.serialize());
  }
  constructor({
    username,
    name,
    email,
    id,
    profile_image,
    comments_count,
    posts_count,
    token,
    password,
  }) {
    super();
    this.username = username;
    this.name = name;
    this.email = email;
    this.id = id;
    this.profile_image = profile_image;
    this.comments_count = comments_count;
    this.posts_count = posts_count;
    this.#token = token;
    this.#password = password;
  }
}
