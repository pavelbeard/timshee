const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const apiUrl = process.env.DRF_API_URL + '/api';
app.use('/api', createProxyMiddleware({
    target: apiUrl,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq) => {
            console.log('setting security header..')
            proxyReq.setHeader('X-Api-Key', process.env.DRF_API_KEY);
        }
    }
}));

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (rq, rs) => {
    rs.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});