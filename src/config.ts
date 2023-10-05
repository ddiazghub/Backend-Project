import dotenv from "dotenv";
import mongoose, { ClientSession } from "mongoose";

dotenv.config();

function panic(message: string): never {
  throw new Error(`Error: ${message}`);
}

const PORT = Number(process.env.PORT ?? 8000);
const CONNECTION_STRING = process.env.CONNECTION_STRING ?? panic("CONNECTION_STRING env variable is required");

/*
async function database<T>(transaction: (session: ClientSession) => Promise<T>): Promise<T> {
  const connection = await mongoose.createConnection(CONNECTION_STRING).asPromise();
  const session = await connection.startSession();

  try {
    session.startTransaction();
    const result = await transaction(session);
    await session.commitTransaction();
    await session.endSession();
    connection.close();

    return result;
  } catch (e) {
    await session.abortTransaction();
    await session.endSession();
    connection.close();

    throw e;
  }
}
*/

export default {
  PORT,
  CONNECTION_STRING
};
