import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const baseUrl = "http://localhost:3000";

export const ExplorerService = {
  token: null,

  setAuthHeader(token) {
    this.token = token;
    axios.defaults.headers.common.Authorization = `Bearer ${token}`; // dot notation
  },

  clearAuth() {
    this.token = null;
    delete axios.defaults.headers.common.Authorization; // dot notation
  },

  // user methods
  async createUser(user) {
    const response = await axios.post(`${baseUrl}/api/users`, user);
    return response.data;
  },

  async authenticate(user) {
    const response = await axios.post(`${baseUrl}/api/users/authenticate`, user);
    return response.data;
  },

  async getUser(id) {
    const response = await axios.get(`${baseUrl}/api/users/${id}`);
    return response.data;
  },

  async deleteUser(id) {
    return axios.delete(`${baseUrl}/api/users/${id}`); // no need for await here as we delete
  },

  async deleteAllUsers() {
    return axios.delete(`${baseUrl}/api/users`);
  },

  // poi methods
  async createPoi(poi) {
    const response = await axios.post(`${baseUrl}/api/pois`, poi);
    return response.data;
  },

  async getPoiById(id) {
    const response = await axios.get(`${baseUrl}/api/pois/${id}`);
    return response.data;
  },

  async getAllPois() {
    const response = await axios.get(`${baseUrl}/api/pois`);
    return response.data;
  },

  async deletePoi(id) {
    return axios.post(`${baseUrl}/pois/delete/${id}`);
  },

  async deleteAllPois() {
    return axios.delete(`${baseUrl}/api/pois`);
  },

  // added places (for POI details)
  async getAddedPlace(id) {
    const response = await axios.get(`${baseUrl}/api/added-places/${id}`);
    return response.data;
  },

  // image upload
  async uploadImageToPoi(poiId, filePath) {
    const form = new FormData();
    form.append("images", fs.createReadStream(filePath));

    const response = await axios.post(`${baseUrl}/api/pois/${poiId}/upload`, form, {
      headers: form.getHeaders(),
    });

    return response;
  },
};
