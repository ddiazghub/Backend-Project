import express from "express";
import mongoose from "mongoose";
import config from "./config";
import userRouter from "./routers/user.router";
import { EUserRole, UserRole } from "./models/user.model";

const app = express();

app.use(express.json());
app.use("/users", userRouter);

app.get("/", (req, res) => res.status(200).send("Hello World!!!"));

app.listen(config.PORT, async () => {
  await mongoose.connect(config.CONNECTION_STRING);
  const roles = await UserRole.find();

  if (roles.length == 0) {
    console.log("Inserting initial data into database");

    await UserRole.create([
      { name: EUserRole.User },
      { name: EUserRole.Admin },
    ]);
  }

  console.log(`Server has started in http://localhost:${config.PORT}...`);
  console.log("a");
});
