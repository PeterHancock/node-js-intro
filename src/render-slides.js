var Mustache = require('mustache');
var asyncMustache = require('async-mustache')({mustache: Mustache});
var fs = require('fs');
var path = require('path');

var codeSnippetTmpl = fs.readFileSync(__dirname + '/codeSnippet.tmpl', 'utf8');

function renderCodeSnippet(src, code, config) {
    var model = {
        name: config.display === false ? '' : (config.display || src),
        language: config.language || 'javascript',
        code: code
    };

    if (config.terminal) {
        model.terminal = true;
        if (typeof config.terminal  === "string") {
            model.cwd = config.terminal;
        } else {
            model.cwd = path.dirname(src);
        }
    }

    if (config.lines) {
        var lines = code.split('\n');
        config.lines[1] = config.lines[1] || lines.length;
        if (lines.length  > config.lines[1] || config.lines[0] > 1) {
            model.truncated = true;
            model.from = config.lines[0];
            model.to = config.lines[1] >= lines.length ? 'end' : config.lines[1];
            model.code = lines.slice(config.lines[0] - 1, config.lines[1]).join('\n');    
        }
    }
    return Mustache.render(codeSnippetTmpl, model);
};

function createModel (urlResolver) {
    return {'code-snippet': asyncMustache.async(function (text, render, callback) {
            var config = JSON.parse(text)
            var url = config.src;
            urlResolver(url, function (err, code) {
                if (err) return callback(err);
                if (code instanceof Object) {
                    code = JSON.stringify(code, null, 2);
                }
                callback(null, renderCodeSnippet(url, code, config));
            });
        })
    };
}

module.exports = function (template, urlResolver, callback) {
    var model = createModel(urlResolver);
    return asyncMustache.render(template, model);
};
