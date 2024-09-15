const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const url = process.env.DRF_API_URL + '/api'
const proxy = createProxyMiddleware({
    target: url,
    changeOrigin: true,
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request: ${req.url}`);
        // Uncomment if you want to set additional headers
        // proxyReq.setHeader('X-Api-Key', process.env.DRF_API_KEY);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`Received response with status: ${proxyRes.statusCode}`);
    }
})
console.log('DRF_API_URL=', url);

app.use('/api', proxy);

app.use(express.static(path.join(__dirname, 'build')));

app.use('/backend/media', express.static('/home/timshee_store_app/app/media/product_images'))

app.get('*', (rq, rs) => {
    rs.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});