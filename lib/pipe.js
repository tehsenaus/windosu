var net = require('net'), Q = require('q');
function pipe(path, options) {
    var d = Q.defer();
    path = '\\\\.\\pipe\\' + path;
    function onConnect(socket) {
        if (options.read) {
            socket.pipe(process.stdout);
            socket.on('end', function () {
                d.resolve();
            });
        } else {
            var piper = function (data) {
                    socket.write(data);
                }, ender = function () {
                    socket.end();
                };
            process.stdin.resume();
            process.stdin.on('data', piper);
            process.stdin.on('end', ender);
            socket.closeAndWait = function () {
                socket.end();
                process.stdin.pause();
                process.stdin.removeListener('data', piper);
                process.stdin.removeListener('end', ender);
            };
            d.resolve(socket);
        }
    }
    if (options.serve) {
        var server = net.createServer(function (socket) {
                onConnect(socket);
                d.promise.fin(function () {
                    return server.close();
                });
            }).listen(path);
    } else {
        var socket = net.connect(path, function () {
                return onConnect(socket);
            });
        return socket;
    }
    return d.promise;
}
module.exports = pipe;
if (module === require.main) {
    if (!process.argv[4]) {
        console.error('Incorrect arguments!');
        process.exit(-1);
    }
    pipe(process.argv[4], {
        read: process.argv[2] == 'read',
        serve: process.argv[3] == 'server'
    });
}