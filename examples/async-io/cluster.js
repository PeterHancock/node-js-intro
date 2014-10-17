var cluster = require('cluster');

if (cluster.isMaster) {
  var numWorkers = require('os').cpus().length - 1;
  for (var i = 0; i < numWorkers; i++) {
    cluster.fork({ workerId: i + 1 });
  }
} else {
  require('./server')(process.env.workerId);
}

if (cluster.isMaster) {
	cluster.on('exit', function(worker, code, signal) {
    	console.log('worker ' + worker.process.pid + ' died');
  	});
}