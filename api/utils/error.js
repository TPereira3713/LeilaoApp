export const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
};
