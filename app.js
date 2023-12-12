// app.js

const http = require('http');

const server = http.createServer(
    (req, res) => {
        res.end('Node.js test');
    }
);
server.listen(3004)
console.log('Server start!');
