export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Database errors
  if (err.code === "23505") {
    statusCode = 409;
    message = "Duplicate entry. Record already exists.";
  }

  if (err.code === "23503") {
    statusCode = 400;
    message = "Invalid reference. Related record does not exist.";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};
