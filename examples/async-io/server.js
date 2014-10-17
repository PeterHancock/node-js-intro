var http = require('http');
var sleep = require('sleep');
var url = require('url');
var extend = require('extend');
var ecstatic = require('ecstatic')(__dirname + '/static');

var config = require('./static/config.json');

var port = process.argv[2] || 8080;

var start = function(workerId) {
	var server = http.createServer();
	server.on('request', function(request, response) {
		if ( url.parse(request.url).pathname === '/rest') {
			var conf = extend({}, config, url.parse(request.url, true).query);
			var times = [new Date().getTime()];
			return asyncPhase(conf.async, function() {
				blockingPhase(conf.sync);
				times.push(new Date().getTime());
				response.end(JSON.stringify({ workerId: workerId, times: times }));
			});
		}
		ecstatic(request, response);
	});
	server.listen(port);
	console.log('worker#' + workerId + ' server listening on ' + port);
};

function blockingPhase(t) {
	sleep.usleep(t * 1000000 /* microseconds */);
}

function asyncPhase(t, callback) {
	setTimeout(callback, t * 1000/* milliseconds */);
}

if (require.main === module) {
	start(1);
} else {
	module.exports = start;
}