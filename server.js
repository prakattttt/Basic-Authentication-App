import express from "express";
import morgan from 'morgan';
import path from "path";
import url from "url";
import userRoute from "./routes/userRoute.js";
import dataRoute from "./routes/userDataRoute.js";
import { errorHandler, defaultError } from "./middlewares/errorHandler.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, 'public')));

app.use("/user", userRoute);
app.use("/user", dataRoute);

app.use(defaultError);
app.use(errorHandler);

app.listen(5000, () => console.log("Server running on PORT 5000"));
