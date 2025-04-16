const routePermission = {
  admin: {
    apiGET: [
      "https://sumondev.vercel.app/",
      "https://sumondev.vercel.app/view",
      "https://sumondev.vercel.app/add",
      "https://sumondev.vercel.app/edit",
    ],
  },
  editor: {
    apiGET: [
      "https://sumondev.vercel.app/",
      "https://sumondev.vercel.app/view", 
      "https://sumondev.vercel.app/add",
      "https://sumondev.vercel.app/edit",
    ],
  },
  user: {
    apiGET: ["https://sumondev.vercel.app/", "https://sumondev.vercel.app/view"],
  },
};

export default routePermission;
