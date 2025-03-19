import bcrypt from "bcrypt";
import { User } from "../models/mongo/user-model.js";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";

export const authController = {
  async showLogin(request, h) {
    return h.view("login");
  },

  async login(request, h) {
    try {
      const { error, value } = UserCredentialsSpec.validate(request.payload, { abortEarly: false });
      if (error) {
        const formattedErrors = error.details.map((err) => ({
          message: err.message.replace(/"([^"]+)"/g, (_, key) => `"${key}"`),
        }));
        return h.view("login", { errors: formattedErrors });
      }

      const user = await User.findOne({ email: value.email });
      if (!user || !(await bcrypt.compare(value.password, user.password))) {
        return h.view("login", { errors: [{ message: "Invalid email or password" }] });
      }

      request.cookieAuth.set({ id: user._id });

      // ✅ Redirect users to the POI page after login
      return h.redirect("/pois");
    } catch (error) {
      console.error("Login error:", error);
      return h.view("login", { errors: [{ message: "Something went wrong, please try again." }] });
    }
  },

  async showSignup(request, h) {
    return h.view("signup");
  },

  async signup(request, h) {
    try {
      const { error, value } = UserSpec.validate(request.payload, { abortEarly: false });
      if (error) {
        const formattedErrors = error.details.map((err) => ({
          message: err.message.replace(/"([^"]+)"/g, (_, key) => `"${key}"`),
        }));
        return h.view("signup", { errors: formattedErrors });
      }

      const hashedPassword = await bcrypt.hash(value.password, 10);
      const newUser = new User({ ...value, password: hashedPassword });
      await newUser.save();
      return h.redirect("/login");
    } catch (error) {
      console.error("Signup error:", error);
      return h.view("signup", { errors: [{ message: "Could not create account. Try again!" }] });
    }
  },

  async logout(request, h) {
    request.cookieAuth.clear();
    return h.redirect("/");
  },
};
