import swagger from "swagger-ui-express";
import express from "express";
import morgan from "morgan";
import { renderDocs, redirectToDocs } from "./controllers/docs.controller";
import orderRouter from "./routers/order.router";
import productRouter from "./routers/product.router";
import restaurantRouter from "./routers/restaurant.router";
import userRouter from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use("/docs", swagger.serve, renderDocs);
app.use("/users", userRouter);
app.use("/restaurants", restaurantRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.get("/", redirectToDocs);

export default app;
