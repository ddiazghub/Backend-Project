import "express-async-errors";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";

dotenv.config();

function panic(message: string): never {
  throw new Error(`Error: ${message}`);
}

function generateSecret(): string {
  const secret = crypto.randomBytes(32).toString("hex");
  const data = fs.readFileSync(".env", { encoding: "utf8" });
  const lines = data.split("\n").filter(line => line != null && line != "");
  lines.push( `SECRET="${secret}"`);
  fs.writeFileSync(".env", lines.join("\n"));

  return secret;
}

const APP_NAME = "Proyecto Backend";
const PORT = Number(process.env.PORT ?? 8000);
const SECRET = process.env.SECRET ?? generateSecret();
const CONNECTION_STRING = process.env.CONNECTION_STRING ?? panic("CONNECTION_STRING env variable is required");

export default {
  PORT,
  SECRET,
  CONNECTION_STRING,
  APP_NAME
};
