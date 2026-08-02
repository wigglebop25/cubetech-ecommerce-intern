function validateRequest(requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => !req.body[field]);

    if (missing.length > 0) {
      const error = new Error(`Missing required fields: ${missing.join(', ')}`);
      error.status = 400;
      return next(error);
    }

    next();
  };
}

module.exports = validateRequest;
