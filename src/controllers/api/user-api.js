import Boom from "@hapi/boom";
import { User } from "../../models/mongo/user-model.js";

export const userApi = {
  // Create a new user
  async create(request, h) {
    try {
      const user = new User(request.payload);
      const savedUser = await user.save();
      return h.response(savedUser).code(201);
    } catch (err) {
      console.error("User creation error:", err);
      return Boom.badImplementation("Could not create user");
    }
  },

  // Authenticate user (basic check)
  async authenticate(request, h) {
    try {
      const { email, password } = request.payload;
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return Boom.unauthorized("Invalid email or password");
      }

      return { success: true, user }; // Cookie auth handled elsewhere
    } catch (err) {
      return Boom.serverUnavailable("Auth error");
    }
  },

  // Get user by ID
  async getById(request, h) {
    try {
      const user = await User.findById(request.params.id).lean();
      if (!user) return Boom.notFound("No User with this id");
      return user;
    } catch (err) {
      return Boom.serverUnavailable("No User with this id");
    }
  },

  // Delete user by ID
  async delete(request, h) {
    try {
      const result = await User.findByIdAndDelete(request.params.id);
      if (!result) return Boom.notFound("User not found");
      return h.response().code(204);
    } catch (err) {
      return Boom.serverUnavailable("Failed to delete user");
    }
  },

  // Delete all users (for testing)
  async deleteAll(request, h) {
    try {
      await User.deleteMany({});
      return h.response().code(204);
    } catch (err) {
      return Boom.serverUnavailable("Could not delete users");
    }
  },
};
