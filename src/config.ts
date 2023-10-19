import "express-async-errors";
import dotenv from "dotenv";

dotenv.config();

function panic(message: string): never {
  throw new Error(`Error: ${message}`);
}

const PORT = Number(process.env.PORT ?? 8000);
const CONNECTION_STRING = process.env.CONNECTION_STRING ?? panic("CONNECTION_STRING env variable is required");

export default {
  PORT,
  CONNECTION_STRING
};
