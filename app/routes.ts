import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./components/layouts/AuthenticatedProvider.tsx", [
    layout("./components/layouts/GeneralLayout.tsx", [
      index("routes/home.tsx"),
      route("search", "./routes/search.tsx"),
      route("video/:uid", "./routes/video.tsx"),
      route("me", "./routes/me.tsx"),
    ]),
  ]),
  layout("./components/layouts/AuthenLayout.tsx", [
    route("login", "./routes/login.tsx"),
    route("register", "./routes/register.tsx"),
  ]),
] satisfies RouteConfig;
