var http = require('http');
var ecstatic = require('ecstatic');
var shoe = require('shoe');
var MuxDemux = require('mux-demux');
var shux = require('shux')();


var port = process.argv[2] || 8080;

var server = http.createServer(ecstatic(__dirname));

server.listen(port);

var websock = shoe(function(stream) {
    stream
        .pipe(MuxDemux(function (mstream) {
            mstream
                .pipe(shux.createShell({
                    command: ['bash', '-i'/*, '-r'*/],
                    cwd: mstream.meta,
                    columns: 200,
                    rows:35
                }))
                .pipe(mstream);
        }))
        .pipe(stream);
});

websock.install(server, '/terminal');

console.log("Listening on port " + port);
