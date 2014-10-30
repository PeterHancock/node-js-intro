var events = require('events');
var path = require('path');
var shoe = require('shoe');
var muxDemux = require('mux-demux');
var through = require('through');
var exterminate = require('exterminate');

function Terminal(endpoint) {
	var scope = this;
    if (!(this instanceof Terminal)) return new Terminal(endpoint);
    this.sock = shoe(endpoint);
    this.sock.sock.addEventListener('open', function () {
  	    scope.emit('open');
    });
    this.mx = muxDemux();
    this.sock.pipe(this.mx).pipe(this.sock);
}

Terminal.prototype = new events.EventEmitter();

Terminal.prototype.create = function (config) {
    var term = exterminate(80, 25);
    term.pipe(this.mx.createStream(config.cwd)).pipe(term);
    term.terminal.element.style['background-color'] = 'rgba(0, 0, 0, 0)';
    return term;
};

module.exports = Terminal;
