const http = require('http');
const app = require('./app');

let port = process.env.PORT;

const server = http.createServer(app);
console.log('DOMAIN_NAME: ', process.env.DOMAIN_NAME + ":" + process.env.PORT + "/");
server.listen(port);