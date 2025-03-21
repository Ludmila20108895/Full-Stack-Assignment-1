import moment from "moment"; // Install moment.js for formatting Date
import mongoose from "mongoose";
import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import Cookie from "@hapi/cookie";
import dotenv from "dotenv";
import Handlebars from "handlebars";
import Path from "path";
import { routes } from "./routes/routes.js";
import { poiRoutes } from "./routes/poi-routes.js";
import { User } from "./models/mongo/user-model.js";

//  Load environment variables
dotenv.config();

//  Create Hapi Server
const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: "localhost",
  routes: {
    files: {
      relativeTo: Path.join(process.cwd(), "public"),
    },
  },
});

//  Register plugins
async function init() {
  try {
    await server.register(Inert);
    await server.register(Vision);
    await server.register(Cookie);

    //  Configure Handlebars for Views
    server.views({
      engines: { hbs: Handlebars },
      relativeTo: Path.resolve("src"),
      path: "views",
      layout: "layout",
      layoutPath: "views/layouts",
      partialsPath: "views/partials",
    });

    //  Configure authentication strategy
    server.auth.strategy("session", "cookie", {
      cookie: {
        name: process.env.COOKIE_NAME,
        password: process.env.COOKIE_PASSWORD,
        isSecure: false,
      },
      redirectTo: "/login",
      validate: async (request, session) => {
        try {
          const user = await User.findById(session.id);
          if (!user) {
            return { isValid: false };
          }
          return { isValid: true, credentials: user };
        } catch (error) {
          console.error(" Session validation error:", error);
          return { isValid: false };
        }
      },
    });

    //  Set default authentication
    server.auth.default({
      strategy: "session",
      mode: "try",
    });

    //  Load all routes (General + POI routes)
    server.route([...routes, ...poiRoutes]);

    //  Serve Static Files
    server.route({
      method: "GET",
      path: "/images/{file*}",
      handler: {
        directory: {
          path: Path.join(process.cwd(), "public/images"),
          listing: false,
        },
      },
      options: { auth: false }, //  Allow public access
    });

    // Handlebars Helper to Format Dates
    Handlebars.registerHelper("formatDate", (dateString) => {
      if (!dateString) return "Unknown Date";

      return moment(dateString).format("DD-MM-YYYY");
    });

    //  Start Server
    await server.start();
    console.log(` Server running on ${server.info.uri}`);
  } catch (error) {
    console.error(" Error starting server:", error);
    process.exit(1);
  }
}

//  Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(" Unhandled Promise Rejection:", err);
  process.exit(1);
});

//  Connect to MongoDB (Ensuring Proper Connection Handling)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1); // Stop the server if DB connection fails
  });

init();
