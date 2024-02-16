const requestLoggerMiddleware = (req, res, next) => {
  console.log("Logs middleware is hit");
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const accessToken = req.headers.authorization || "N/A";

  console.log(
    `[${timestamp}] ${method}: ${url}, AccessToken: "${accessToken}"`
  );
  next();
};
module.exports = requestLoggerMiddleware;
