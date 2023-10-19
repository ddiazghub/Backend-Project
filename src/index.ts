import express from "express";
import mongoose from "mongoose";
import config from "./config";
import userRouter from "./routers/user.router";
import restaurantRouter from "./routers/restaurant.router";
import productRouter from "./routers/product.router";
import orderRouter from "./routers/order.router";
import { UserRole } from "./models/user.model";
import { RestaurantCategory } from "./models/restaurant.model";
import { seedEnum } from "./controllers/controller";
import { ProductCategory } from "./models/product.model";
import { OrderState } from "./models/order.model";

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/restaurants", restaurantRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

app.get("/", (_, res) => res.status(200).send("Hello World!!!"));

app.listen(config.PORT, async () => {
  const enums = [UserRole, RestaurantCategory, ProductCategory, OrderState];
  await mongoose.connect(config.CONNECTION_STRING);
  await Promise.all(enums.map(seedEnum));
  console.log(`Server has started at http://localhost:${config.PORT}...`);
});
