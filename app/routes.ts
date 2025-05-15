import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("/api/auth/*", "./routes/auth.ts"),
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/sign-up", "routes/sign-up.tsx"),
  layout("layout/layout.tsx", { id: "layout" }, [
    route("/dashboard", "routes/dashboard.tsx"),
    route("/my", "routes/my.tsx"),
    route("/setting", "routes/setting.tsx"),
  ]),
] satisfies RouteConfig;
