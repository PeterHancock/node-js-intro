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

- Where to start?

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

#Anatomy of a node.js application

---
#At it's simplest

- Install node.js (~5mins)

- Create

[[#code-snippet]]{
	"src": "examples/simple-app/main.js",
	"terminal": true
}[[/code-snippet]]

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

[[#code-snippet]]{
    "src": "examples/jira-issue/package.json",
    "terminal": true
}[[/code-snippet]]

---
#Application code - main module

[[#code-snippet]]{
    "src": "examples/jira-issue/index.js",
    "lines": [1, 11],
    "terminal": true
}[[/code-snippet]]

---
#Application code - main module

[[#code-snippet]]{
    "src": "examples/jira-issue/index.js",
    "lines": [13],
    "terminal": true
}[[/code-snippet]]

---
#Application code - cli

[[#code-snippet]]{
    "src": "examples/jira-issue/bin/cli",
    "terminal": true
}[[/code-snippet]]

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