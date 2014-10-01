var path = require('path');
var shoe = require('shoe');
var muxDemux = require('mux-demux');
var through = require('through');
var exterminate = require('exterminate');


function Terminal(endpoint) {
    if (!(this instanceof Terminal)) return new Terminal(endpoint);
    this.sock = shoe(endpoint);
    this.mx = muxDemux();
    this.sock.pipe(this.mx).pipe(this.sock);
}

Terminal.prototype.create = function (cwd) {
    var term = exterminate(80, 25);
    term.pipe(this.mx.createStream(cwd)).pipe(term);
    term.terminal.element.style['background-color'] = 'rgba(0, 0, 0, 0)';
    return term;
};

module.exports = Terminal;
