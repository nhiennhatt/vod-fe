import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("./components/layouts/AuthenLayout.tsx", [
    route("login", "./routes/login.tsx"),
    route("register", "./routes/register.tsx"),
  ]),
] satisfies RouteConfig;
