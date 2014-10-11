

name: inverse
layout: true
class: center, middle, inverse
---
#An Introduction to node.js

.footnote[
	[nodejs.org - project site](http://nodejs.org/)
]

---
layout: false
.left-column[
  ## Overview
]
.right-column[

- What is node.js?


- What is all the fuss about?


- Getting started?


- The Tools and Community


- Back to the Browser
]

---
template: inverse

#What is node.js?

---
layout: false

.left-column[
  ## What is node.js?
]
.right-column[
- A cross-platform runtime environment for server-side and networking applications written in JavaScript
]

--
.right-column[
- Built on [V8](https://code.google.com/p/v8/), Chrome's JavaScript runtime
]

--
.right-column[
- Tools (*npm* registry http://registry.npmjs.org/)
]

--
.right-column[

- Open source with a large community
]

---
template: inverse

#What is all the fuss about?

---

layout: false

.left-column[
  ## What is all the fuss about?
  ### JavaScript
]
.right-column[
- Cross platform - Browser, Server (Windows, OSX, *nix)
]

--
.right-column[
- Browser devs have a route to server-side 
]

--
.right-column[
- Server-side devs have an excuse to dabble with JS
]

---
.left-column[
  ## What is all the fuss about?
  ### JavaScript
  ### The Event Loop
]

.right-column[
- Applications are single threaded
]

--

.right-column[
- IO is event-driven and non-blocking
]
--
.right-column[
- Designed to address the fact that most time is spent blocking on IO
]

---
template: inverse

#Getting started

---
#At it's simplest

- Install node.js (~5mins)

- Create

.code-snippet[
examples/simple-app/main.js 

```javascript
console.log('Hello %s!', process.argv[2] || 'world');
```

.add-console[examples/simple-app]
]


- run it

```shell
>node main
```

---
#Building a  _real_ Node.js applications

--

- Modular Design?

--

- Third Party Dependencies?

--
- Build Lifecycle - Build, Test, Deploy, Publish etc


---
#A real (simple) example - _jira-client_

Both a Node.js module and CLI app to retrieve the summary for a Jira issue

- Module

```javascript
var JiraClient = require('jira-client');

var jiraClient = new JiraClient(config /*user:, password: */);

console.log(jiraClient.getIssue(key));

```
- CLI

```bash
>jira-issue id-123

id-123: When I run 'jira-issue' something should happen
```


- Use Jira's Rest API

---
#package.json

Used by node and npm (and other tools) to build, test, publish etc

.code-snippet[
examples/jira-issue/package.json 

```javascript
{
  "name": "jira-issue",
  "version": "0.0.1",
  "description": "Get summary for a Jira issue",
  "main": "index.js",
  "scripts": {
    "test": "jasmine-node test"
  },
  "bin": "bin/cli.js",
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
name: main
#The main module

---
template: main
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
template: main
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
#The CLI script

.code-snippet[
examples/jira-issue/bin/cli.js 

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
    	console.error(err);
    	return console.error('Are your Jira credentails correct?');
    }
    console.log(mustache.render(': ', issue));
});

```

.add-console[examples/jira-issue/bin]
]


---
# Build Lifecycle

.left-column[
  ### Build
]

.right-column[

```
npm install
```

.code-snippet[
examples/jira-issue/package.json (lines 10 to end)

```javascript
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

]

---
# Build Lifecycle

.left-column[
  ### Test
]

.right-column[

```
npm test
```

.code-snippet[
examples/jira-issue/package.json (lines 6 to 8)

```javascript
  "scripts": {
    "test": "jasmine-node test"
  },
```

.add-console[examples/jira-issue]
]

]

---
# Build Lifecycle

.left-column[
  ### Test
]

.right-column[

.code-snippet[
examples/jira-issue/test/JiraClientSpec.js (lines 1 to 22)

```javascript
var proxyquire = require('proxyquire');
var Readable = require('stream').Readable;
var EventEmitter = require('events').EventEmitter;

describe('JiraClient', function () {
    it('getIssue works!', function (done) {
        var key = 'PROJ-123', summary = "It's broke";
        var mockJiraJson = JSON.stringify({
            issues: [{ key: key, fields: { summary: summary} }]
        });
        var mockHttps = createMockHttps(mockJiraJson);
        var JiraClient = proxyquire('../index.js',
            { https: mockHttps });
        var sut = new JiraClient({
            host: 'whatever',
            user: 'whatever',
            password: '***'});
        sut.getIssue(key, function (err, issue) {
            expect(issue.summary).toBe(summary);
            done();
        });
    });
```

.add-console[examples/jira-issue/test]
]

]

---
# Build Lifecycle

.left-column[
  ### Test
]

.right-column[

.code-snippet[
examples/jira-issue/test/JiraClientSpec.js (lines 25 to end)

```javascript
function createMockHttps(responseData) {
    return {
        get: function (opts, callback) {
            var rs = new Readable;
            rs.push(responseData);
            rs.push(null);
            callback(rs);
            return new EventEmitter;
        }
    };
}

```

.add-console[examples/jira-issue/test]
]

]

---
.add-console[examples/jira-issue]

# Build Lifecycle

.left-column[
  ### Publish to NPM
]

.right-column[

```
npm publish
```
]
---
.add-console[examples/jira-issue]
# Install 

```
npm install -g jira-issue
```



---
template: inverse
#The Event Loop



---
layout: false
## The Event Loop
.left-column[
### Single threaded
]

.right-column[
Node code is executed in a single thread
]

---
layout: false
## The Event Loop
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
    "start-dev": "npm run watch & node server",
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

var shellCmd = argv.shell ? argv.shell : '/bin/bash -i';

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