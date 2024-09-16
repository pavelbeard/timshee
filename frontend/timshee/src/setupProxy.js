const { createProxyMiddleware } = require('http-proxy-middleware')
console.log('Proxy setup file loaded');

module.exports = function (app) {
    app.use('/api', (req, res, next) => {
        req.headers['X-Api-Key'] = 'change_me';
        next();
    }, createProxyMiddleware({
        target: "http://localhost:8113/api",
        changeOrigin: true,
        secure: false,
        logger: console,
    }));
};