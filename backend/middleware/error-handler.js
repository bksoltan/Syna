module.exports = {
  errorHandler,
};

function errorHandler(err, req, res, next) {
  let statusCode = 400;
  if (typeof err === "string") {
    // custom application error
    const lowerErr = err.toLowerCase();
    if (lowerErr.endsWith("not found")) statusCode = 404;
    if (lowerErr.includes("already")) statusCode = 409;
    console.error(`status: ${statusCode}, ${err}`);
    return res.status(statusCode).json({ message: err });
  } else {
    console.error(`${err.name}, ${err.message}`);
    return res.status(500).json({
      message: err.message,
    });
  }
}
