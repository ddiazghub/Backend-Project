import express from "express";
import config from "./config";

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.status(200).send("Hello World!!!"));

app.listen(config.port, () => {
  console.log(`Server has started in http://localhost:${config.port}...`);
});
