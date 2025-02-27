const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (rq, rs) => {
    rs.sendFile(path.join(__dirname, 'dist', 'index.html'))
});

app.listen(port, () => {
  console.log(`React app is running on port: ${port}`);
});