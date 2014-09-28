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

]

---
#code-snippet API

- .bold[src] - .italic[String], project-relative path to the source file

- .bold[display] - .italic[String|Boolean], an alternative name for the file or false for no name

- .bold[language] - .italic[String], language 

- .bold[lines] - .italic[Array], line numbers, start and optional end

- .bold[terminal] - .italic[Boolean], whetther to include a terminal

## .red[Warning]

Terminal is non-restricted and for user runnning the server

---
#Getting Started

Fork this project and replace examples and slides.tmpl.md 