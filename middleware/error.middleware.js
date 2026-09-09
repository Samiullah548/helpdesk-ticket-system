const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
        errors: error.errors || []
    });
};

export { errorHandler };
export default errorHandler;