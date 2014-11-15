var http = require('http');
var ecstatic = require('ecstatic');
var shoe = require('shoe');
var MuxDemux = require('mux-demux');
var Shux = require('shux');
var argv = require('minimist')(process.argv.slice(2));

var port = argv.p || 8080;

var shellCmd =  argv.shell || '/bin/bash -i';

var server = http.createServer(ecstatic(__dirname));

server.listen(port);

var websock = shoe(function(stream) {
    var shux = Shux();
    stream
        .pipe(MuxDemux(function (mstream) {
            var shell = shux.createShell({
                    command: shellCmd.split(' '),
                    columns: 200,
                    rows:35
                });
            shell.write('cd ' + mstream.meta + ';clear\n');
            mstream
                .pipe(shell)
                .pipe(mstream);
        }))
        .pipe(stream);
    stream.on('close', function() {
        shux.list().forEach( function (id) { shux.attach(id).end('exit\n'); }); // Yuck!
    });
});

websock.install(server, '/terminal');

console.log("Listening on port " + port);

if (argv.shell) {
    process.on('SIGINT', function() {
        console.log('\n Don\'t forget any shell cleanup!');
        process.exit(1);
    });
}
