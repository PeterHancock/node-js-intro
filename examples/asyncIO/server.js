var http = require('http');
var url = require('url');
var sleep = require('sleep');
var fs = require('fs');
var Q = require('q');
var ecstatic = require('ecstatic')(__dirname + '/static');

var config = require('./static/config.json');

var run = function(nodeId) {
	var ip = process.env.IP;
	var port = process.env.PORT || 8080;
	var server = http.createServer();

	server.on('request', function(request, response) {
		var requrl = url.parse(request.url);
		var pathname = requrl.pathname;
		if (pathname === '/ajax') {
			response.setHeader("Content-Type", "application/json");
			var times = [now()];
			blockingPhase(0.1);
			return asyncPhase(config.async).done(function() {
				blockingPhase(config.sync);
				times.push(now());
				response.end(JSON.stringify({
					nodeId: nodeId,
					times: times}));
			});
		}
		ecstatic(request, response);
	});
	server.listen(port, ip);
	console.log('node#' + nodeId + ' server listening on ' + port);
};

function now() {
	return new Date().getTime();
}

function asyncPhase(t) {
	var deferred = Q.defer();
	setTimeout(function () { deferred.resolve(); }, t * 1000/* milliseconds */);
	return deferred.promise;
}

function blockingPhase(t) {
	sleep.usleep(t * 1000000 /* microseconds */);
}

if (require.main !== module) {
	module.exports = run;
} else {
	run(1);
}
