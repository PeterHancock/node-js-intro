var colors = require('colors');

console.log('\n\u2193 Invoke "main"'.green);

setTimeout(function () { // React to event
    console.log('\u2193 Invoke "callback I"'.red)
    console.log('\u2191 return\n'.red);
}, 3000);

setTimeout(function () { // React to event
    console.log('\u2193 Invoke "callback II"'.yellow);
    console.log('\u2191 return\n'.yellow);
}, 1000);

console.log('\u2191 return\n'.green);
