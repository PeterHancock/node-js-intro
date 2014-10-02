name: inverse
layout: true
class: center, middle, inverse
---
#node.js

.footnote[
	[nodejs.org - project site](http://nodejs.org/)
]

---
layout: false
.left-column[
  ## Overview
]
.right-column[

- What is it?

- What is all the fuss about?

- Where to start?

- Tools and Community (npm)

- Back to the Browser
]

---
layout: false
.left-column[
  ## What is it?
]
.right-column[

- A cross-platform runtime environment for server-side and networking applications written in JavaScript

- A single threaded application code and non-blocking IO

- Tools (npm registry http://registry.npmjs.org/)

- Strong OS Community
]

???
APIs for acessing File System, Networking

---
Well coming from web development to application/ server development

JS for all it's warts has
function references
- higher order functions/ functional programming (Java is catching up/ over taking with Lambda support)

- The single threaded event loop - a model for concurrent programming

Node.js is a route for app devs to learn JavaScript - example


---
template: inverse

#Anatomy of a node.js application

---
#At it's simplest

- Install node.js (~5mins)

- Create

.code-snippet[
examples/simple-app/main.js 

```javascript
console.log('Simple as ...');
```

.add-console[examples/simple-app]
]


- run it

```shell
>node main
```

---
#How about  _real_  apps?

- Modular design

- Third party dependencies

- Building, testing etc


---
#jira-issue

module/cli app to retrieve the summary off a Jira issue

```bash
>jira-issue id-123

id-123: WTF
```

- Use Jira's Rest API

- Embeddable

```javascript
var JiraClient = require('jira-client');
...
```

---
#package.json

Used by node and npm (and other tools) to build, test, publish etc

.code-snippet[
examples/jira-issue/package.json 

```javascript
{
  "name": "jira-issue",
  "version": "0.0.0",
  "description": "Get summary for a Jira issue",
  "main": "index.js",
  "scripts": {
    "test": "jasmine-node test"
  },
  "bin": "bin/cli",
  "dependencies": {
    "JSONStream": "^0.9.0",
    "mustache": "^0.8.2",
    "through": "^2.3.6"
  },
  "devDependencies": {
    "jasmine-node": "^1.14.5",
    "proxyquire": "^1.0.1"
  }
}

```

.add-console[examples/jira-issue]
]


---
#Application code - main module

.code-snippet[
examples/jira-issue/index.js (lines 1 to 11)

```javascript
// Core modules
var https = require('https');
var url = require('url');
//Modules from central npm registry
var JSONStream = require('JSONStream');
var through = require('through');

var JiraClient = function (config) {
    this.host = config.host;
    this.auth = config.user + ':' + config.password;
};
```

.add-console[examples/jira-issue]
]


---
#Application code - main module

.code-snippet[
examples/jira-issue/index.js (lines 13 to end)

```javascript
JiraClient.prototype.getIssue = function (key, callback/*(err, result)*/) {
    if (!key) throw 'No key specified';

    var opts = url.parse('https://' + this.host + '/rest/api/2/search?jql=key=' + key);
    opts.auth = this.auth;
    opts.headers = {'Content-Type': 'application/json'};

    https.get(opts, function (response) {
        response
            .pipe(JSONStream.parse('issues.*'))
            .pipe(through(function (issue) {
                if (key === issue.key) {
                    callback(null, { key: issue.key, summary: issue.fields.summary });
                }
            }));
    }).on('error', callback);
 };

module.exports = JiraClient;

```

.add-console[examples/jira-issue]
]


---
#Application code - cli

.code-snippet[
examples/jira-issue/bin/cli 

```javascript
#!/usr/bin/env node
var JiraClient = require('../index.js');

var mustache = require('mustache');

var host = process.env.JIRA_HOST || process.argv[3];
var key = process.argv[2];
var user = process.env.JIRA_USER;
var password = process.env.JIRA_PASSWORD;

var jiraClient = new JiraClient({ host: host, user: user, password: password });

jiraClient.getIssue(key, function (err, issue) {
    if (err) {
        return console.error(err);
    }
    console.log(mustache.render('{{key}}: {{summary}}', issue));
});

```

.add-console[examples/jira-issue/bin]
]


---


layout: false
.left-column[
  ## Modules
]

.right-column[
Node applications are composed of Modules:
- Module loading follows CommonJS
- Encapsulation/reuse
]

---
layout: false
.left-column[
  ## Modules
  ### - Local
]

.right-column[
- With any non-trivial app it helps to splitting into cohesive groups by function etc

main.js
```javascript
var logger = require('logger')(true);

logger.log('info');
logger.error('error');
```

logger.js
```javascript

module.exports = function(level /* boolean */) {
	if (level) {
		return console;
	} else {
		return {
			log: function() { /* NOP */ },
			error: console.error.bind(console)
		};
	}
};
```

Modules do not leak local vars, however global vars are just that (Lint tools can help us to exclude these)
]
---
.left-column[
  ## Modules
  ### - Local
  ### - Third party modules
]

.right-column[


NPM (Node Package Manager) is the defacto way to aquire modules (we will )

```json
{
	"name": "node",
	"version": "0.1.0"
}
```

```shell
npm install -save underscore
```

```javascript
var _ = require('underscore');

console.log(_('123456').reverse());
```

]

npm downloads modules to node_modules

---
#Builds

npm is your friend

```
>npm init
```


---
template: inverse
#The Event Loop and non-blocking IO



---
layout: false
## Event Loop and non-blocking IO
.left-column[
### Single threaded
]

.right-column[
Node code is executed in a single thread
]

---
layout: false
## Event Loop and non-blocking IO
.left-column[
### Single threaded
### IO is asyncronous
]

.right-column[
IO operations are non-blocking and evented
]
---

DIAGRAM

---
#Event loop in action:

.code-snippet[
examples/eventLoop/tick.js 

```javascript
function main() {
    process.stdout.write('enter main\n');
    process.nextTick(function(){
        process.stdout.write('done something...\n');
    })
    console.log('return from main');
}

main();

```

.add-console[examples/eventLoop]
]


---
Asyncronous IO
The canonical TCP example
Demonstrates
- non-blocking IO
- Many coneections/ process

---
#Demo
.code-snippet[
examples/async-io/server.js (lines 1 to 9)

```javascript
var http = require('http');
var url = require('url');
var sleep = require('sleep');
var fs = require('fs');
var Q = require('q');
var ecstatic = require('ecstatic')(__dirname + '/static');

var config = require('./static/config.json');
var ip = process.env.IP, port = process.env.PORT || 8080;
```


]


---
#Demo
.code-snippet[
examples/async-io/server.js (lines 11 to 29)

```javascript
var start = function(nodeId) {
	nodeId = nodeId || 1;
	var server = http.createServer();
	server.on('request', function(request, response) {
		if ( url.parse(request.url).pathname === '/ajax') {
			response.setHeader("Content-Type", "application/json");
			var times = [now()];
			blockingPhase(0.1);
			return asyncPhase(config.async).done(function() {
				blockingPhase(config.sync);
				times.push(now());
				response.end(JSON.stringify({ nodeId: nodeId, times: times }));
			});
		}
		ecstatic(request, response);
	});
	server.listen(port, ip);
	console.log('node#' + nodeId + ' server listening on ' + port);
};
```


]


---
#Demo
.code-snippet[
examples/async-io/server.js (lines 31 to end)

```javascript
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

if (require.main === module) {
	start();
} else {
	module.exports = start;
}

```


]



---
#What about my other 7 cores?
The cluster module covers this- one node () handles requests and workers service the requests by being passed a handle to the connection

Demo

web page visualizing

---
template: inverse

#Back to the Browser

An example ...

---
#slides

.code-snippet[
package.json (lines 1 to 22)

```javascript
{
  "name": "node-js-intro",
  "version": "0.0.0",
  "private": true,
  "description": "An introduction to node.js",
  "authors": [
    "Peter Hancock <peter.hancock@gmail.com>"
  ],
  "dependencies": {
    "http-server": "~0.6.1",
    "browser-http": "^3.0.1",
    "jquery": "~2.1.1",
    "mustache": "~0.8.2",
    "async-mustache": "~0.1.0",
    "shux": "^0.2.0",
    "shoe": "0.0.15",
    "mux-demux": "^3.7.9",
    "ecstatic": "^0.5.4",
    "through": "^2.3.4",
    "minimist": "^1.1.0"
  },
  "devDependencies": {
```


]


---
#slides - server

Building, testing (?!), and starting the server

.code-snippet[
package.json (lines 23 to end)

```javascript
    "browserify": "^5.11.1",
    "exterminate": "^1.4.1",
    "brfs": "~1.2.0",
    "watchify": "^1.0.5",
    "concat-stream": "^1.4.6",
    "node-watch": "^0.3.4",
    "minimist": "~1.1.0"
  },
  "scripts": {
    "start": "node server",
    "build": "npm run browserify && npm run render",
    "start-dev": "npm run watch & node server 8081",
    "watch": "npm run watchify & npm run render-watch",
    "browserify": "browserify -t brfs src/browser/main.js -o static/js/slides.js",
    "watchify": "watchify -t brfs src/browser/main.js -o static/js/slides.js",
    "render": "node render -i slides.tmpl.md -o static/slides.md",
    "render-watch": "node render -i slides.tmpl.md -o static/slides.md -w"
  },
  "license": "MIT"
}

```


]


---
#slides - server

.code-snippet[
server.js (lines 1 to 12)

```javascript
var http = require('http');
var ecstatic = require('ecstatic');
var shoe = require('shoe');
var MuxDemux = require('mux-demux');
var Shux = require('shux');
var argv = require('minimist')(process.argv.slice(2));

var port = argv.p || 8080;

var shellCmd = argv.docker ? 'docker run -it --rm ' + argv.docker + ' /bin/bash' : '/bin/bash -i';

var server = http.createServer(ecstatic(__dirname));
```

.add-console[.]
]


---
#slides - server

.code-snippet[
server.js (lines 14 to 40)

```javascript
server.listen(port);

var websock = shoe(function(stream) {
    var shux = Shux();
    stream
        .pipe(MuxDemux(function (mstream) {
            var shell = shux.createShell({
                    command: shellCmd.split(' '),
                    columns: 200,
                    rows:35
                });
            shell.write('PS1=">";cd ' + mstream.meta + ';clear\n');
            mstream
                .pipe(shell)
                .pipe(mstream);
        }))
        .pipe(stream);
    stream.on('close', function() {
        shux.list().forEach( function (id) { shux.attach(id).end('exit\n'); }); // Yuck!
    });
});

websock.install(server, '/terminal');

console.log("Listening on port " + port);

if (argv.docker) {
```

.add-console[.]
]


---
#slides - browser

.code-snippet[
src/browser/main.js (lines 1 to 24)

```javascript
var http = require('browser-http');
var $ = require('jquery');
var querystring = require('querystring');
var renderSlides = require('../render-slides');
var terminal = require('./terminal')('/terminal');

var slideShow;
var slides = {};
var activeSlide;

getSlidesMarkdown()
// Then place the slides markdown where remark expects and start remark
    .then(function (slidesMd) {
        $('#source').text(slidesMd);
        slideShow = window.slideShow = remark.create({
            highlightStyle: 'monokai',
            highlightLanguage: 'remark'
        });
        return slideShow;
    })
    .then(setupSlideShow)
    .catch(function (err) { // Oh, here again :-)
        console.error(err);
    });
```

.add-console[src/browser]
]



---
#slides - browser

.code-snippet[
src/browser/main.js (lines 26 to 45)

```javascript
function getSlidesMarkdown() {
    if (querystring.parse(global.location.search.substring(1)).dev) {
        // Load the slides template - A mustache template in a markdown format
        function urlResolver(url, callback) {
            http.get(url)
                .then(function (response) {
                    callback(null, response.data);
                });
        }
        return http.get('slides.tmpl.md')
        // load and render any code snippets etc
        .then(function (response) {
            return renderSlides(response.data, urlResolver);
        });
    } else {
        return http.get('static/slides.md').then(function (response) {
            return response.data;
        });
    }
}
```

.add-console[src/browser]
]


---
References