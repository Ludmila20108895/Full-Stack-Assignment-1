export const dashboardController = {
  async index(request, h) {
    return h.view("dashboard", { title: "Explorer Dashboard" });
  },
};
