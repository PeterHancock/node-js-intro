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
    var sh = this.mx.createStream(cwd);
    sh.write('PS1=">";clear\n');
    term.pipe(sh).pipe(term);
    term.terminal.element.style['background-color'] = 'rgba(0, 0, 0, 0)';
    return term;
};

module.exports = Terminal;
