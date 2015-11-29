function __when(v, n) {
    return v && typeof v.then === 'function' ? v.then(n) : n(v);
}
var child_process = require('child_process'), Q = require('q'), fs = require('fs'), path = require('path'), Tail = require('tail').Tail, cliWidth = require('cli-width'), pipe = require('./pipe');
module.exports.exec = function (command, options, callback) {
    options = options || {};
    var promise = function () {
            return __when(Q.nfcall(fs.readFile, path.join(__dirname, '..', options.user ? 'windosu-runas.cmd' : 'windosu-elevate.cmd'), 'ascii'), function (__t0) {
                var bat = __t0;
                var id = '.windosu.' + new Date().getTime();
                var temp = path.join(options.user ? 'C:\\temp' : process.env.TEMP, id);
                var inputName, outputName;
                var temps = { error: temp + '.err' };
                var replacements = {
                        dir: process.cwd(),
                        temp: temp,
                        command: command,
                        cliWidth: cliWidth(),
                        pipe: '"' + process.execPath + '" "' + path.join(__dirname, 'pipe.js') + '"',
                        input: inputName = id + '-in',
                        output: outputName = id + '-out',
                        invisible: path.join(__dirname, '..', 'invisible.vbs'),
                        stderr_redir: process.stdout.isTTY ? '2>&1' : '2> %ERROR%'
                    };
                for (var n in temps)
                    replacements[n] = temps[n];
                for (var n in replacements) {
                    bat = bat.replace('{{ ' + n + ' }}', replacements[n]);
                }
                var batOut = temps.BAT = temp + '-elevate.bat';
                return __when(Q.nfcall(fs.writeFile, batOut, bat), function (__t1) {
                    __t1;
                    return __when(Q.nfcall(fs.writeFile, temps.error, ''), function (__t2) {
                        __t2;
                        var inputPromise = pipe(inputName, { serve: true });
                        var outputPromise = pipe(outputName, {
                                serve: true,
                                read: true
                            });
                        var tail = !process.stdout.isTTY && new Tail(temps.error);
                        if (tail) {
                            tail.on('line', function (line) {
                                console.error(line);
                            });
                            tail.on('error', function (err) {
                                console.error(err);
                            });
                        }
                        return function () {
                            return __when(options.user ? function () {
                                return __when(spawn('runas.exe', [
                                    '/netonly',
                                    '/user:' + options.user,
                                    batOut
                                ]), function (__t3) {
                                    __t3;
                                });
                            }.call(this) : function () {
                                return __when(Q.nfcall(child_process.exec, 'cmd /C ' + batOut), function (__t4) {
                                    __t4;
                                });
                            }.call(this), function (__t5) {
                                __t5;
                                return __when(outputPromise, function (__t6) {
                                    __t6;
                                });
                            });
                        }.call(this).fin(function () {
                            if (tail)
                                tail.unwatch();
                            for (var n in temps) {
                                fs.unlink(temps[n]);
                            }
                            return inputPromise.then(function (input) {
                                return input.closeAndWait();
                            });
                        });
                    });
                });
            });
        }.call(this);
    if (callback) {
        promise.then(function (r) {
            return callback(null, r);
        }, function (e) {
            return callback(e);
        });
    }
    return promise;
};
function spawn(cmd, args) {
    var d = Q.defer();
    var p = child_process.spawn(cmd, args, { stdio: 'inherit' });
    p.on('exit', function (code) {
        if (code) {
            d.reject(code);
        } else {
            d.resolve();
        }
    });
    return d.promise;
}