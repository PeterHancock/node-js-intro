var http = require('http');
var _ = require('underscore');
var async = require('async');

http.globalAgent.maxSockets = 100;

var requestIds = _.range(1,51);
var requests = _(requestIds).map(function (id) {
	return function (callback) {
		var requestTime = new Date().getTime();
		setImmediate(function () {
			http.get('http://localhost:8080/api/test?id=' + id, function(res) {
			  res.setEncoding('utf8');
			  res.on('data', function (data) {
			  	callback(null, {id: id, requestTime: requestTime, response: JSON.parse(data)});
			  });
			});
		});
	};
});

async.parallel(requests, function (err, responses) {
	console.log(JSON.stringify(responses));
});

