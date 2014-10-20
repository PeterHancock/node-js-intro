

name: inverse
layout: true
class: center, middle, inverse
---
#An Introduction to .green[Node.js]

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


- How to get started


- The Event Loop


- Node.js for developing JS in the Browser
]

---
template: inverse

#What is .green[Node.js]?

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
- Tools (**npm** - module registry http://registry.npmjs.org/)
]

--
.right-column[

- Open source with a large community
]

---
template: inverse

#What is all the .green[Fuss] about?

---

layout: false
  ## What is all the fuss about?

.left-column[

  ### .green[JavaScript]
]

--
.right-column[
- Cross-platform
  - Browser
  - Server (Windows, OSX, *nix)
  - Mobile (Browser)
]
--
.right-column[
- Browser devs have an entry to the server-side 
]
--
.right-column[
- Server-side devs have an entry to JS
]

---
  ## What is all the fuss about?
.left-column[

  ### .green[The Event Loop]
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
> Applications can spend a lot of time waiting on IO
]

---
template: inverse

#Getting Started

---

- ##Install node.js

--

- ##Create

.code-snippet[
examples/simple-app/main.js 

```javascript
console.log('Hello ' + (process.argv[2] || 'world') + '!');
```

.add-terminal[{"name":"simple-app","cwd":"examples/simple-app"}]
]


--

- ##Run

```shell
node main
```

---
#Building .green[real] Node.js Applications

--

- ##Modular design

--

- ##Third party dependencies

--
- ##Build lifecycle - Build, Test, Deploy, Publish etc


---
#An example - .green[jira-client]

- Both a Node.js module and CLI app to retrieve the summary for a Jira issue

--

- Use Jira's Rest API

--

- Module - `require('jira-client')`

```javascript
var JiraClient = require('jira-client');

var jiraClient = new JiraClient(config /*user:, password: */);

jiraClient.getIssue(key, function (err, issue) {
  if (err) ...
  console.log(issue);
});

```

--
- CLI - `jira-issue <KEY>`

```bash
> jira-issue JI-123

JI-123: jira-issue should do something
```
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


]


---
name: main
#The Main Module

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


]


---
#The CLI Script

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
    console.log(mustache.render('{{key}}: {{summary}}', issue));
});

```


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

.add-terminal[{"name":"jira-issue","cwd":"examples/jira-issue"}]
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

.add-terminal[{"name":"jira-issue","cwd":"examples/jira-issue"}]
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

describe('JiraClient.getIssue()', function () {
    it('works for valid input!', function (done) {
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

.add-terminal[{"name":"jira-issue","cwd":"examples/jira-issue/test"}]
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

.add-terminal[{"name":"jira-issue","cwd":"examples/jira-issue/test"}]
]

]

---
.add-terminal[{
  "cwd": "examples/jira-issue"
}]

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
.add-terminal[{
  "cwd": "examples/jira-issue"
}]
# Install Globally

```
npm install -g jira-issue
```



---
template: inverse
#The .green[Event Loop]

---
#.red[The Problem]

--
- Our applications have to deal with many concurrent and long lived connections

--

- We ~~don't want to~~ can't manage multiple threads

--

- Most of the time server are waiting on IO (hitting the datastore)

---
#.green[The Solution]

- A Single-threaded programming model with evented non-blocking IO 

--

- An implementation of the Reactor Pattern

--

Node.js delegates async operations to **c** extensions (libuv)

```
while (poll external events) { // Blocks whilst polling IO
 push callback invocation to Event Queue // Stick this on the queue
}
```

--

The **Event Loop** is the *visible* process that:
>Pops callbacks from the Event Queue and executes them in the main thread 


---
template: inverse
![The Event Loop](static/images/event-loop.png)

---
>With the .green[Event Loop] we do not have to worry about orchestrating concurrent processess and we can focus on implementing what our applications actually do

---
#The Event Loop in Action

.code-snippet[
examples/eventLoop/event-loop.js 

```javascript
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

```

.add-terminal[{"cwd":"examples/eventLoop"}]
]



---
#A non-blocking web server
.code-snippet[
examples/async-io/server.js (lines 1 to 9)

```javascript
var http = require('http');
var sleep = require('sleep');
var url = require('url');
var extend = require('extend');
var ecstatic = require('ecstatic')(__dirname + '/static');

var config = require('./static/config.json');

var port = process.argv[2] || 8080;
```


]


---
#A Non-blocking web server
.code-snippet[
examples/async-io/server.js (lines 10 to 27)

```javascript

var start = function(workerId) {
	var server = http.createServer();
	server.on('request', function(request, response) {
		if ( url.parse(request.url).pathname === '/rest') {
			var conf = extend({}, config, url.parse(request.url, true).query);
			var times = [new Date().getTime()];
			return asyncPhase(conf.async, function() {
				blockingPhase(conf.sync);
				times.push(new Date().getTime());
				response.end(JSON.stringify({ workerId: workerId, times: times }));
			});
		}
		ecstatic(request, response);
	});
	server.listen(port);
	console.log('worker#' + workerId + ' server listening on ' + port);
};
```


]


---
#A Non-blocking web server
.code-snippet[
examples/async-io/server.js (lines 28 to end)

```javascript

function blockingPhase(t) {
	sleep.usleep(t * 1000000 /* microseconds */);
}

function asyncPhase(t, callback) {
	setTimeout(callback, t * 1000/* milliseconds */);
}

if (require.main === module) {
	start(1);
} else {
	module.exports = start;
}
```


]



---
template: inverse

#What about my other cores?

---

#The .green[Cluster] module - Poor person's load balancing

--

.code-snippet[
examples/async-io/cluster.js (lines 1 to 10)

```javascript
var cluster = require('cluster');

if (cluster.isMaster) {
  var numWorkers = require('os').cpus().length - 1;
  for (var i = 0; i < numWorkers; i++) {
    cluster.fork({ workerId: i + 1 });
  }
} else {
  require('./server')(process.env.workerId);
}
```


]


--
.code-snippet[
examples/async-io/server.js (lines 37 to end)

```javascript
if (require.main === module) {
	start(1);
} else {
	module.exports = start;
}
```


]


---
template: inverse

#Back to the Browser

--

##.green[This Slideshow!]

---
#package.json

.code-snippet[
package.json (lines 1 to 21)

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
```


]


---
#package.json

Building, Testing (?!), and Starting the Server

.code-snippet[
package.json (lines 22 to end)

```javascript
  "devDependencies": {
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
#The Server

.code-snippet[
server.js (lines 1 to 14)

```javascript
var http = require('http');
var ecstatic = require('ecstatic');
var shoe = require('shoe');
var MuxDemux = require('mux-demux');
var Shux = require('shux');
var argv = require('minimist')(process.argv.slice(2));

var port = argv.p || 8080;

var shellCmd =  argv.shell || '/bin/bash -i';

var server = http.createServer(ecstatic(__dirname));

server.listen(port);
```

.add-terminal[{"cwd":"."}]
]


---
#The Server

.code-snippet[
server.js (lines 16 to 39)

```javascript
var websock = shoe(function(stream) {
    var shux = Shux();
    stream
        .pipe(MuxDemux(function (mstream) {
            var shell = shux.createShell({
                    command: shellCmd.split(' '),
                    columns: 200,
                    rows:35
                });
            shell.write('cd ' + mstream.meta + ';clear\n');
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

```

.add-terminal[{"cwd":"."}]
]


---
#The Browser

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
var terminals = {};
var terminalTransparency = 0.5;
var terminalSupported = false;

$('<span class="terminal-container" tabindex="-1"></span>').appendTo('body');

terminal.on('open', function () {
    terminalSupported = true;
    $('.terminal-container').show();
});

getSlidesMarkdown()
// Then place the slides markdown where remark expects and start remark
    .then(function (slidesMd) {
```

.add-terminal[{"cwd":"src/browser"}]
]



---
#The Browser

.code-snippet[
src/browser/main.js (lines 26 to 45)

```javascript
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

function getSlidesMarkdown() {
    if (querystring.parse(global.location.search.substring(1)).dev) {
        // Load the slides template - A mustache template in a markdown format
        function urlResolver(url, callback) {
            http.get(url)
                .then(function (response) {
                    callback(null, response.data);
                });
        }
```

.add-terminal[{"cwd":"src/browser"}]
]


---
#Browserify


.footnote[
Browserify http://browserify.org/
]
--


Transform Node.js modules to JavaScript (slides.js) for Browser

--
- Use the CommonJS module system (`module.exports`, `require()`)

--

- Get `require()` in the Browser

--

# .green[Resuse] in Server and Browser!
---
#Starting the Server

.code-snippet[
package.json (lines 31 to 40)

```javascript
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
```


]


Build & Run
```bash
npm run build

npm start [-p PORT] [--shell SHELL_CMD]
```

---
template: inverse
#.green[Thank you]

.footnote[

https://github.com/PeterHancock/node-js-intro


remark.js https://github.com/gnab/remark

remark code snippets https://github.com/PeterHancock/remark-code-snippets
]