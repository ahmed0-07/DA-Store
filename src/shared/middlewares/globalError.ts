import { type Request, type Response, type NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "Error",
    message: "Route: " + req.originalUrl + " not found",
  });
};

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid data provided";
  }

  res.status(statusCode).json({
    status: "Error",
    message: message,
  });
}