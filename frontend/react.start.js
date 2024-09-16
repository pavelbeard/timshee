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
});

app.use('/api', (req, res, next) => {
    req.headers['X-Api-Key'] = process.env.DRF_API_KEY;
    next();
}, proxyApi);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (rq, rs) => {
    rs.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});