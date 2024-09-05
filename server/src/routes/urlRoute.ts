import { Router } from "express";

const urlsRouter = Router();

urlsRouter.post("/urls");
urlsRouter.get("/urls/{shortUrl}");
urlsRouter.put("/urls/{shortUrl}");
urlsRouter.delete("/urls/{shortUrl}");

export default urlsRouter;
