const routePermission = {
  admin: {
    apiGET: [
      "http://localhost:5173/",
      "http://localhost:5173/view",
      "http://localhost:5173/add",
      "http://localhost:5173/edit",
    ],
  },
  editor: {
    apiGET: [
      "http://localhost:5173/",
      "http://localhost:5173/view",
      "http://localhost:5173/add",
      "http://localhost:5173/edit",
    ],
  },
  user: {
    apiGET: ["http://localhost:5173/", "http://localhost:5173/view"],
  },
};

export default routePermission;
