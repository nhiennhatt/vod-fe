import {
  type RouteConfig,
  index,
  layout,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./components/layouts/AuthenticatedProvider.tsx", [
    layout("./components/layouts/GeneralLayout.tsx", [
      index("routes/home.tsx"),
      route("search", "./routes/search.tsx"),
      route("video/:uid", "./routes/video.tsx"),
      route("profile/:username?", "./routes/profile.tsx"),
      ...prefix("media", [
        index("./routes/media.index.tsx"),
        route("upload", "./routes/media.upload.tsx"),
        route("manage/:uid", "./routes/media.manage.tsx"),
      ]),
      ...prefix("settings", [
        layout("./components/layouts/SettingLayout.tsx", [
          index("./routes/settings.index.tsx"),
          route("profile", "./routes/settings.profile.tsx"),
          route("username", "./routes/settings.username.tsx"),
          route("email", "./routes/settings.email.tsx"),
          route("password", "./routes/settings.password.tsx"),
        ]),
      ]),
    ]),
  ]),
  layout("./components/layouts/AuthenLayout.tsx", [
    route("login", "./routes/login.tsx"),
    route("register", "./routes/register.tsx"),
  ]),
  route("404", "./routes/notfound.tsx"),
] satisfies RouteConfig;
