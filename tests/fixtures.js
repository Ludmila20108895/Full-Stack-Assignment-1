import dotenv from "dotenv";

dotenv.config();

export const serviceUrl = "http://localhost:3000"; // API base URL

export const testUser = {
  firstName: "Ludmila",
  lastName: "Bulat",
  email: "ludmila@example.com",
  password: "password123456",
};

export const testPoi = {
  name: "Eiffel Tower",
  category: "City",
  visitDate: "2024-03-20",
  latitude: 48.8584,
  longitude: 2.2945,
};
