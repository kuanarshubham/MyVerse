import express, { json } from "express";
import { router } from "./routes/v1/index.route.js";
import client from "@repo/db/client";

const app = express();

app.use(express.json());

app.use("/api/v1", router);

app.listen(process.env.PORT || 3000); 

