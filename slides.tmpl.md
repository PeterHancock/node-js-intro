name: inverse
layout: true
class: center, middle, inverse
---
#[Remark](https://github.com/gnab/remark.git) + interactive code snippets

.footnote[
	[project on Github](https://github.com/PeterHancock/remark-code-snippets.git)
]
---

layout: false
.left-column[
  ##  By example
  ### Slide markup
]
.right-column[

```xml
{{=<% %>=}}
{{#code-snippet}}
{
	"src": "examples/main.js",
	"terminal": true
}
{{/code-snippet}}
<%={{ }}=%>

```
]

---
layout: false
.left-column[
  ##  By example
  ### Slide markup
  ### Output
]
.right-column[

```xml
{{=<% %>=}}
{{#code-snippet}}
{
	"src": "examples/main.js",
	"terminal": true
}
{{/code-snippet}}
<%={{ }}=%>
```

{{#code-snippet}}
{
	"src": "examples/main.js",
	"terminal": true
}
{{/code-snippet}}
]
---
layout: false
.left-column[
  ##  By example
  ### Slide markup
  ### Output
  ### Terminal
]
.right-column[

```xml
{{=<% %>=}}
{{#code-snippet}}
{
    "src": "examples/main.js",
    "terminal": true
}
{{/code-snippet}}
<%={{ }}=%>
```

{{#code-snippet}}
{
	"src": "examples/main.js",
	"terminal": true
}
{{/code-snippet}}

Click on terminal icon (top left) and run

```bash
node main
```

Ctrl + click on the terminal to close

]


---
#code-snippet API

- .bold[src] - .italic[String], project-relative path to the source file

- .bold[[display]] - .italic[String|Boolean], an alternative name for the file or false for no name

- .bold[[language]] - .italic[String], language

- .bold[[lines]] - .italic[Array], line numbers, start and optional end

- .bold[[highlight]] - .italic[Array[Array]], An Array of lines to highlight

- .bold[[terminal]] - .italic[Boolean|Object], whether to include a terminal or terminal config (see Terminal API)

---
# The Terminal
.red[
## Warning
By default, the terminal session has the same permissions as the process serving the slideshow.
]

This can be configured using the **shell** option when starting the server (see the project's README).

##Configuration and Control


To add a terminal to a slide without a code snippet use

.add-terminal[{
	"cwd": "."
}]

```
.add-terminal[{
	"cwd": "."
}]
```

The transparency of ther terminal can be controlled with the **-** and **+** keys (when focus is not on the terminal).

---
#The Terminal

##API
- .bold[cwd] - .italic[String], project-relative path ofthe terminals current working directory

- .bold[name] - .italic[String], a name for sharing a terminal across slides

---
#Getting Started

Fork this project and replace examples and slides.tmpl.md
