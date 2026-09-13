const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    if (error.code === 11000) {
        statusCode = 409;
        const field = Object.keys(error.keyValue || {})[0] || "field";
        message = `User with this ${field} already exists`;
    } else if (error.name === "CastError") {
        statusCode = 400;
        message = `Invalid format for ${error.path}`;
    } else if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors || {}).map(e => e.message).join(", ") || "Validation Error";
    } else if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Authentication failed or token expired";
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors: error.errors || []
    });
};

export { errorHandler };
export default errorHandler;