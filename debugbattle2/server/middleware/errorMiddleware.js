const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: "Request processing error. Check backend console.",
    stack: null,
  });
};

module.exports = { errorHandler };
