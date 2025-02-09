const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "error", message: "Internal server error" });
};

module.exports = errorHandler; // Export the errorHandler
