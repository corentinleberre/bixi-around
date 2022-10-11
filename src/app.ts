import express from "express";
import { bixiAround } from "./bixi-around";

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`App is running on ${port}.`);
});

app.get("/bixi-around", bixiAround);
