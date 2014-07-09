var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var renderSlides = require('./src/render-slides');

// Set up a watcher for continuous slide rendering
if (argv.w) {
    var args = process.argv.slice(2);
    var i = args.indexOf('-w');
    args = args.slice(0, i).concat(args.slice(i+1));
    require('node-watch')(['slides.tmpl.md', 'src', 'examples'], function(file) {
        console.error('Re-render after change to ' + file);
        require('child_process').fork(process.argv[1], args);
    });
}

var resultHandler = argv.o ? fs.writeFile.bind(fs, argv.o) : console.log.bind(console);

if (argv['-']) { // Use --- cli arg to recieve template from stdin
    process.stdin.pipe(require('concat-stream')({encoding: 'string'}, function (data) {
        renderSlides(data, urlResolver).then(resultHandler);
    }));
} else {
    var input = argv.i;
    fs.readFile(input, {encoding : 'utf-8'}, function(err, data) {
        renderSlides(data, urlResolver).then(resultHandler);
    });
}

function urlResolver(url, callback) {
    fs.readFile(url, {encoding : 'utf-8'}, callback);
}
