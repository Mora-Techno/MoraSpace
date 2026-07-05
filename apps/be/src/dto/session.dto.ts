import { t } from "elysia";
//
export const SessionParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID Sesssion" }),
});
