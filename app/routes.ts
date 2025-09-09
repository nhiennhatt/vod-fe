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
    ]),
  ]),
  layout("./components/layouts/AuthenLayout.tsx", [
    route("login", "./routes/login.tsx"),
    route("register", "./routes/register.tsx"),
  ]),
] satisfies RouteConfig;
