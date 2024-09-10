import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import "./configs/passport"; // import passport strategy for auth
import secrets from "./configs/secrets";
import { errorHandler } from "./middlewares/errorHandler";
import { globalLimiter } from "./middlewares/rateLimiter";
import { requestLogger } from "./middlewares/requestLogger";
import { unknownRouteHandler } from "./middlewares/unknownRouteHandler";
import router from "./routes/index";

const app = express();

// Set trust proxy to allow request from reverse proxy like nginx
// Change true to Specify trusted proxies, e.g., 'loopback' = same machine, '10.0.0.0/24' = ip range, 69.69.69.69 = specific ip, etc.
app.set("trust proxy", secrets.app.reverseProxyIP);

// Apply the rate limit globally
app.use(globalLimiter);

// Request body parser using built-in (JSON)
app.use(express.json());

// Request cookie parser (signed with cookie secret)
app.use(cookieParser(secrets.app.cookieSecret));

// Helps secure app by setting HTTP response headers
app.use(helmet());

// Handle cross-origin requests
app.use(cors());

app.use(requestLogger);

app.use(router);

// Middleware to handle invalid/not defined routes
app.use(unknownRouteHandler);

// Middleware to Handle errors
app.use(errorHandler);

export default app;
