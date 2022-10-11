import express from "express";
import { bixiAround } from "./app/bixi-around";

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Bixi-around is running on ${port}.`);
});

app.get("/bixi-around", bixiAround);
