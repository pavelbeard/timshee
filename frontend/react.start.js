const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const apiUrl = process.env.DRF_API_URL + '/api';
const proxyApi = createProxyMiddleware({
    target: apiUrl,
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
});

app.use('/api', proxyApi);

app.use(express.static(path.join(__dirname, 'build')));


app.get('*', (rq, rs) => {
    rs.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});