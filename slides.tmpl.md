{{ The default Mustache delimeters clash with remark :-( }}
{{=[[ ]]=}}

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

[[#code-snippet]]{
	"src": "examples/simple-app/main.js",
	"terminal": { "name": "simple-app" }
}[[/code-snippet]]

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

[[#code-snippet]]{
    "src": "examples/jira-issue/package.json",
    "terminal": { "name": "jira-issue" }
}[[/code-snippet]]

---
name: main
#The main module

---
template: main
[[#code-snippet]]{
    "src": "examples/jira-issue/index.js",
    "lines": [1, 11],
    "terminal": { "name": "jira-issue" }
}[[/code-snippet]]

---
template: main
[[#code-snippet]]{
    "src": "examples/jira-issue/index.js",
    "lines": [13],
     "terminal": { "name": "jira-issue" }
}[[/code-snippet]]

---
#The CLI script

[[#code-snippet]]{
    "src": "examples/jira-issue/bin/cli.js",
     "terminal": { "name": "jira-issue" }
}[[/code-snippet]]

---
# Build Lifecycle

.left-column[
  ### Build
]

.right-column[

```
npm install
```

[[#code-snippet]]{
    "src": "examples/jira-issue/package.json",
     "terminal": { "name": "jira-issue" },
    "lines": [10]
}[[/code-snippet]]
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

[[#code-snippet]]{
    "src": "examples/jira-issue/package.json",
     "terminal": { "name": "jira-issue" },
    "lines": [6,8]
}[[/code-snippet]]
]

---
# Build Lifecycle

.left-column[
  ### Test
]

.right-column[

[[#code-snippet]]{
    "src": "examples/jira-issue/test/JiraClientSpec.js",
     "terminal": { "name": "jira-issue" },
    "lines": [1,22]
}[[/code-snippet]]
]

---
# Build Lifecycle

.left-column[
  ### Test
]

.right-column[

[[#code-snippet]]{
    "src": "examples/jira-issue/test/JiraClientSpec.js",
     "terminal": { "name": "jira-issue" },
    "lines": [25
    ]
}[[/code-snippet]]
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

[[#code-snippet]]{
	"src": "examples/eventLoop/tick.js",
	"terminal": true
}[[/code-snippet]]

---
Asyncronous IO
The canonical TCP example
Demonstrates
- non-blocking IO
- Many coneections/ process

---
#Demo
[[#code-snippet]]{
    "src": "examples/async-io/server.js",
    "lines": [1, 9]
}[[/code-snippet]]

---
#Demo
[[#code-snippet]]{
    "src": "examples/async-io/server.js",
    "lines": [11, 29]
}[[/code-snippet]]

---
#Demo
[[#code-snippet]]{
    "src": "examples/async-io/server.js",
    "lines": [31]
}[[/code-snippet]]


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

[[#code-snippet]]{
	"src": "package.json",
	"lines": [1,22]
}[[/code-snippet]]

---
#slides - server

Building, testing (?!), and starting the server

[[#code-snippet]]{
	"src": "package.json",
	"lines": [23]
}[[/code-snippet]]

---
#slides - server

[[#code-snippet]]{
	"src": "server.js",
	"terminal": true,
	"lines": [1, 12]
}[[/code-snippet]]

---
#slides - server

[[#code-snippet]]{
	"src": "server.js",
	"terminal": true,
	"lines": [14, 40]
}[[/code-snippet]]

---
#slides - browser

[[#code-snippet]]{
	"src": "src/browser/main.js",
	"terminal": true,
	"lines": [1, 24]
}[[/code-snippet]]


---
#slides - browser

[[#code-snippet]]{
	"src": "src/browser/main.js",
	"terminal": true,
	"lines": [26, 45]
}[[/code-snippet]]

---
References