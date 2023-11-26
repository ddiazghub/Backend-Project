import config from "./config";
import app from "./app";
import mongoose from "mongoose";
import { UserRole } from "./models/user.model";
import { RestaurantCategory } from "./models/restaurant.model";
import { seedEnum } from "./controllers/controller";
import { ProductCategory } from "./models/product.model";
import { OrderState } from "./models/order.model";

app.listen(config.PORT, async () => {
  const enums = [UserRole, RestaurantCategory, ProductCategory, OrderState];
  await mongoose.connect(config.CONNECTION_STRING);
  await Promise.all(enums.map(seedEnum));

  console.log(`Server has started at http://localhost:${config.PORT}...`);
});
