import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { helmet } from "elysia-helmet";
import apiRoutes from "./routes/apiRoutes";
import swaggerPlugin from "./swagger";

const app = new Elysia()
  .use(
    helmet({
      contentSecurityPolicy: false,
    }),
  )
  .use(cors({ origin: "*" }))
  .get("/", () => "Hello Elysia! Bun js")
  .use(apiRoutes)
  .use(swaggerPlugin);

export default app;
