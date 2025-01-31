import express from "express";
import { router } from "./routes/v1/index.route";

const app = express();

app.use("/api/v1", router);

app.listen(process.env.PORT || 3000);

