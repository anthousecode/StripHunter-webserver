var http = require('http');

http.createServer(function (req, res) {

    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end('success');

}).listen(5000);