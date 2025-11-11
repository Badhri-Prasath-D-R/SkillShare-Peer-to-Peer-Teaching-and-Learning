// src/utils.js
export const createPageUrl = (pageName) => {
  const routes = {
    Dashboard: "/",
    BrowseSessions: "/browse",
    CreateSession: "/create",
    Profile: "/profile"
  };
  return routes[pageName] || "/";
};