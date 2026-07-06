import Elysia from "elysia";
import authRoutes from "./authRoutes";
import todoRoutes from "./todoRoutes";
import noteRoutes from "./noteRoutes";
import calendarRoutes from "./calendarRoutes";
import musicRoutes from "./musicRoutes";
import notificationRoutes from "./notificationRoutes";
import companyRoutes from "./companyRoutes";
import workstationRoutes from "./workstationRoutes";
import subscriptionRoutes from "./subscriptionRoutes";
import sessionRoutes from "./sessionRoutes";
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
      .use(workstationRoutes)
      .use(subscriptionRoutes)
      .use(todoRoutes)
      .use(noteRoutes)
      .use(calendarRoutes)
      .use(musicRoutes)
      .use(notificationRoutes)
      .use(sessionRoutes);
  }
}

export default new ApiRouter().apiRouter;
