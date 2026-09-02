const errorHandler = (error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
    });
}