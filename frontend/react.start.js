const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

app.use('/api', createProxyMiddleware({
    target: `${process.env.DRF_API_URL}/api`,
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('X-Api-Key', process.env.DRF_API_KEY)
    }
}));

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (rq, rs) => {
    rs.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});