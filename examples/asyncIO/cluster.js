var cluster = require('cluster');
var http = require('http');
var numCPUs = Math.min(4, require('os').cpus().length);

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork({workerId: i + 1, port: process.env.PORT, ip: process.env.IP});
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  require('./server')(process.env.workerId);
}