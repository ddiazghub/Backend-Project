import swagger from "swagger-ui-express";
import { Request, Response } from "express";

export async function renderDocs(req: Request, res: Response) {
  return res.send(swagger.generateHTML(await import("../../swagger.json")));
}

export async function redirectToDocs(req: Request, res: Response) {
  res.redirect("/docs");
}
