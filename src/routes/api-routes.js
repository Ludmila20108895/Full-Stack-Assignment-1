export const apiRoutes = [
  {
    method: "GET",
    path: "/api/test",
    handler: (request, h) => ({
      message: "API is working!",
    }),
  },
];
