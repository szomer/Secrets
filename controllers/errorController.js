const STATUS_CODES = {
  200: 'OK',
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};

// Handle error response
function sendError(res, code, msg) {
  res.writeHead(code, { 'Content-Type': 'text/plain' });
  res.end(`[ERROR ${code} ${STATUS_CODES[code]}]\n${msg}`);
}

module.exports = sendError;
