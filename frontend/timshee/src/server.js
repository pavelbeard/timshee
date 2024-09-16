const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/api', createProxyMiddleware({
    target: "http://localhost:8113/api",
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq) => {
            console.log('setting header...')
            proxyReq.setHeader('X-Api-Key', 'change_me')
        }
    }
}));

app.listen(3100, () => console.log('app is working on: http://localhost:3100'))