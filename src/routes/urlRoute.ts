import { RequestHandler, Router } from "express";
import passport from "passport";
import { UrlController } from "../controllers/UrlController";
import payloadValidator from "../middlewares/payloadValidator";
import { urlPayloadSchema } from "../schemas/urlSchema";

const urlRouter = Router();

urlRouter.post(
  "/urls",
  passport.authenticate("accessToken", {
    session: false,
  }) as RequestHandler,
  payloadValidator(urlPayloadSchema),
  UrlController.addUrl
);
urlRouter.get("/urls/:shortUrl", UrlController.getUrl);
urlRouter.patch(
  "/urls/:shortUrl",
  passport.authenticate("accessToken", {
    session: false,
  }) as RequestHandler,
  payloadValidator(urlPayloadSchema.partial()),
  UrlController.updateUrl
);
urlRouter.delete(
  "/urls/:shortUrl",
  passport.authenticate("accessToken", {
    session: false,
  }) as RequestHandler,
  UrlController.deleteUrl
);

export default urlRouter;
