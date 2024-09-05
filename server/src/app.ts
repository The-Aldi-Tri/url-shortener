import cors from "cors";
import express from "express";
import helmet from "helmet";

// Middlewares
import { errorHandler } from "./middlewares/errorHandler";
import { unknownRouteHandler } from "./middlewares/unknownRouteHandler";
import userRouter from "./routes/userRoute";

const app = express();

// Request body parser using built-in (JSON)
app.use(express.json());

// Helps secure app by setting HTTP response headers
app.use(helmet());

// Handle cross-origin requests
app.use(cors());

app.use(userRouter);

// Middleware to handle invalid/not defined routes
app.use(unknownRouteHandler);

// Middleware to Handle errors
app.use(errorHandler);

export default app;
