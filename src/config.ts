import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

function panic(message: string): never {
  throw new Error(message);
}

const PORT = Number(process.env.PORT ?? 8000);
const CONNECTION_STRING = process.env.CONNECTION_STRING ?? panic("CONNECTION_STRING env variable is required");

export default {
  port: PORT,
  db: {
    connect: async () => await mongoose.connect(CONNECTION_STRING),
  },
};
