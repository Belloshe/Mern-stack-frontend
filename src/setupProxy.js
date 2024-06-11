const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://mern-stack-zhce.onrender.com',
      changeOrigin: true,
    })
  );
};
