import Elysia from "elysia";
import SystemController from "@/controllers/SystemController";

const systemRoutes = new Elysia({ prefix: "/system" })
  .get("/ping", (c) => SystemController.ping(c as any));

export default systemRoutes;
