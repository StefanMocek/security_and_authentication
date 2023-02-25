const path = require('path');
const https = require('https');

const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https.createServer().listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});