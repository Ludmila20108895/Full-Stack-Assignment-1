export const dashboardController = {
  index: async function (request, h) {
    return h.view("dashboard", { title: "Explorer Dashboard" });
  },
};
