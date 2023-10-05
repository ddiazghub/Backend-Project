import express from "express";
import mongoose from "mongoose";
import config from "./config";
import userRouter from "./routers/user.router";
import restaurantRouter from "./routers/restaurant.router";
import { EUserRole, UserRole } from "./models/user.model";
import { RestaurantCategory, ERestaurantCategory } from "./models/restaurant.model";

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/restaurants", restaurantRouter);

app.get("/", (req, res) => res.status(200).send("Hello World!!!"));

app.listen(config.PORT, async () => {
  await mongoose.connect(config.CONNECTION_STRING);
  const roles = await UserRole.find();
  const restaurantCategories = await RestaurantCategory.find();

  if (roles.length == 0 || restaurantCategories.length == 0) {
    console.log("Inserting initial data into database");

    if (roles.length == 0) {
      await UserRole.create([
        { name: EUserRole.User },
        { name: EUserRole.Admin },
      ]);
    }

    if (restaurantCategories.length == 0) {
      await RestaurantCategory.create([
        { name: ERestaurantCategory.Italian },
      ]);
    }
  }

  console.log(`Server has started in http://localhost:${config.PORT}...`);
  console.log("a");
});
