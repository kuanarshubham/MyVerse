import express, { json } from "express";
import { router } from "./routes/v1/index.route.js";
import client from "@repo/db/client";
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/v1", router);

app.listen(process.env.PORT || 3000); 

