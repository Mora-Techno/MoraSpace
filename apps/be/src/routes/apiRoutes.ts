import Elysia from "elysia";
import authRoutes from "./authRoutes";
import todoRoutes from "./todoRoutes";
import noteRoutes from "./noteRoutes";
import calendarRoutes from "./calendarRoutes";
import musicRoutes from "./musicRoutes";
import notificationRoutes from "./notificationRoutes";
import companyRoutes from "./companyRoutes";
import subscriptionRoutes from "./subscriptionRoutes";
import sessionRoutes from "./sessionRoutes";
import departmentRoutes from "./departmentRoutes";
import teamRoutes from "./teamRoutes";
import positionRoutes from "./positionRoutes";
import memberRoutes from "./memberRoutes";
import invitationRoutes from "./invitationRoutes";
import roleRoutes from "./roleRoutes";
import permissionRoutes from "./permissionRoutes";
import taskRoutes from "./taskRoutes";
import pomodoroRoutes from "./pomodoroRoutes";
import systemRoutes from "./systemRoutes";
import trackCatalogRoutes from "./trackCatalogRoutes";
import { InternalApiKey } from "@/middlewares/apiKey";
import { errorPlugin, loggerPlugin, metricsPlugin } from "@/plugins";

class ApiRouter {
  public apiRouter;

  constructor() {
    this.apiRouter = new Elysia({ prefix: "/api/v1" }).derive(() => ({
      json(data: any, status = 200) {
        return new Response(JSON.stringify(data), {
          status,
          headers: { "Content-Type": "application/json" },
        });
      },
    }));
    this.routes();
  }

  private routes() {
    this.apiRouter
      .use(InternalApiKey)
      .use(loggerPlugin)
      .use(errorPlugin)
      .use(authRoutes)
      .use(companyRoutes)
      .use(subscriptionRoutes)
      .use(todoRoutes)
      .use(noteRoutes)
      .use(calendarRoutes)
      .use(musicRoutes)
      .use(notificationRoutes)
      .use(sessionRoutes)
      .use(departmentRoutes)
      .use(teamRoutes)
      .use(positionRoutes)
      .use(memberRoutes)
      .use(invitationRoutes)
      .use(roleRoutes)
      .use(permissionRoutes)
      .use(taskRoutes)
      .use(pomodoroRoutes)
      .use(systemRoutes)
      .use(trackCatalogRoutes);
  }
}

export default new ApiRouter().apiRouter;
