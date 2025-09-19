export const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
}

export const defaultError = (req, res, next) => {
    const error = new Error("Page Not Found!");
    error.status = 404;
    return next(error);
}

