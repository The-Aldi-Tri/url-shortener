import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

// Define a type for an async route handler
type AsyncHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<Response | void>;

/**
 * An Express middleware wrapper for asynchronous route handlers.
 * This wrapper ensures that any errors thrown during the asynchronous operation
 * are caught and passed to the next middleware function (typically an error handler).
 *
 * @param handler - The asynchronous route handler to wrap. It should return a `Promise` that resolves to `Response` or `void`.
 *
 * @returns A middleware function that catches any errors from the `handler` and passes them to the next middleware.
 *
 */
export const asyncRouteHandlerWrapper = (handler: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch((err: unknown) => next(err));
  };
};

/**
 * Wraps an asynchronous callback that returns a Promise<void> into a synchronous function.
 * The synchronous function can be called without dealing with the promise directly.
 * Any errors that occur during the execution of the async callback will be handled by the provided onError handler.
 *
 * @param asyncCallback - An asynchronous function that returns a Promise<void>.
 * @param onError - An optional error handler function that will be called if the asyncCallback fails. Defaults to logging errors to the console.
 * @returns A synchronous function that, when called, executes the asyncCallback and handles errors using onError.
 */
export const asyncCallbackWrapper = <
  Param,
  T extends (...args: Param[]) => Promise<void>,
>(
  asyncCallback: T,
  onError: (error: unknown) => void = (error) => {
    logger.error("Default error handler:", error);
  }
): ((...args: Param[]) => void) => {
  return (...args: Param[]) => {
    asyncCallback(...args).catch(onError);
  };
};
