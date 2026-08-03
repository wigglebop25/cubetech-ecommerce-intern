// Request logging middleware
// Logs all incoming requests with timing

function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url, ip } = req;

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    // Color code based on status
    let statusColor = '\x1b[32m'; // Green for 2xx
    if (statusCode >= 400 && statusCode < 500) statusColor = '\x1b[33m'; // Yellow for 4xx
    if (statusCode >= 500) statusColor = '\x1b[31m'; // Red for 5xx

    console.log(
      `${statusColor}${method}\x1b[0m ${url} ${statusColor}${statusCode}\x1b[0m ${duration}ms - ${ip}`
    );
  });

  next();
}

module.exports = requestLogger;
