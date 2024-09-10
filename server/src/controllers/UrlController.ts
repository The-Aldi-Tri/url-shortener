import { Request, Response } from "express";
import { urlPatchPayloadType, urlPostPayloadType } from "../schemas/urlSchema";
import { UrlService } from "../services/postgres/UrlService";
import { asyncRouteHandlerWrapper } from "../utils/asyncWrapper";

export class UrlController {
  static addUrl = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = req.user as Record<string, string>;
      const result = await UrlService.addUrl(
        user.id,
        req.body as urlPostPayloadType
      );
      res.status(201).json(result);
    }
  );

  static getUrl = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      const result = await UrlService.getOriUrl(req.params.shortUrl);
      res.status(301).redirect(result);
    }
  );

  static updateUrl = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = req.user as Record<string, string>;
      const result = await UrlService.updateUrl(
        user.id,
        req.params.shortUrl,
        req.body as urlPatchPayloadType
      );
      res.status(200).json(result);
    }
  );

  static deleteUrl = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = req.user as Record<string, string>;
      const result = await UrlService.deleteUrl(user.id, req.params.shortUrl);
      res.status(200).json(result);
    }
  );
}
