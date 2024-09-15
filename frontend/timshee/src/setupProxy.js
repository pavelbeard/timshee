const { createProxyMiddleware } = require('http-proxy-middleware')
console.log('Proxy setup file loaded');

module.exports = function (app) {
    app.use('/api', createProxyMiddleware({
        target: "http://localhost:8113/api",
        changeOrigin: true,
        secure: false
    }))
}