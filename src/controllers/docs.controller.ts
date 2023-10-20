import swagger from "swagger-ui-express";
import { Request, Response } from "express";

export default async function docs(req: Request, res: Response) {
  return res.send(swagger.generateHTML(await import("../../swagger.json")));
}
