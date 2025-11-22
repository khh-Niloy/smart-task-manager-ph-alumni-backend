import { Router } from "express";
import { userRoutes } from "./app/modules/user/user.route";
import { authRoutes } from "./app/modules/auth/auth.route";
import { projectRoutes } from "./app/modules/project/project.route";
import { teamRoutes } from "./app/modules/team/team.route";
import { activityRoutes } from "./app/modules/activity/activity.route";
import { dashboardRoutes } from "./app/modules/dashboard/dashboard.route";


export const routes = Router();

const allRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/project",
    route: projectRoutes,
  },
  {
    path: "/team",
    route: teamRoutes,
  },
  {
    path: "/activity",
    route: activityRoutes,
  },
  {
    path: "/dashboard",
    route: dashboardRoutes,
  },
];

allRoutes.forEach(({ path, route }) => routes.use(path, route));
