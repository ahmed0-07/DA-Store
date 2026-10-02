import { Prisma } from "@prisma/client";
import { type Request, type Response, type NextFunction } from "express";
import APIError from "../utils/APIError.js";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "Error",
    message: "Route: " + req.originalUrl + " not found",
  });
};

const handlePrismaValidationError = (err: Prisma.PrismaClientValidationError): APIError => {
  return new APIError("Invalid input data. Please check your request.", 400);
};

const handlePrismaClientKnownRequestError = (err: Prisma.PrismaClientKnownRequestError): APIError => {
  let statusCode = 400
  let message = "Database error"
  
  if (err.code === "P2002") {
    statusCode = 409
    message = "A record with these values already exists"
  } else if (err.code === "P2025") {
    statusCode = 404
    message = "Record not found"
  } else if (err.code === "P2003") {
    statusCode = 400
    message = "Related record does not exist"
  }

  return new APIError(message, statusCode)
}

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Prisma.PrismaClientValidationError) {
    err = handlePrismaValidationError(err)
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    err = handlePrismaClientKnownRequestError(err)
  }
  
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "Error",
    message: message,
  });
}