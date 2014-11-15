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
        var terminalConfig;
        if (config.terminal  === true) {
            terminalConfig = { cwd: path.dirname(src) };
        } else {
            terminalConfig = config.terminal;
            if (!terminalConfig.cwd) {
                terminalConfig.cwd = path.dirname(src);
            }
        }
        model.terminal = JSON.stringify(terminalConfig);
    }

    if (config.highlight || config.lines) {
        model.code = _transformLines(code, config, model);
    }

    return Mustache.render(codeSnippetTmpl, model);
};

function _transformLines(code, config, model) {
    var lines = code.split('\n');
    if (config.highlight) {
        var highlighted = _createMask(lines.length, config.highlight);
        var lastLine = config.highlight[1];
        lines = lines.map(function (line, index) {
            return highlighted[index] ? '*' + line : line;
        });
    }
    if (config.lines) {
        config.lines[1] = config.lines[1] || lines.length;
        if (lines.length  > config.lines[1] || config.lines[0] > 1) {
            model.truncated = true;
            model.from = config.lines[0];
            model.to = config.lines[1] >= lines.length ? 'end' : config.lines[1];
            lines = lines.slice(config.lines[0] - 1, config.lines[1]);
        }
    }
    return lines.join('\n');
}

function _createMask(size, ranges) {
    var mask = Array.apply(null, Array(size));
    ranges.forEach(function (range) {
        var line = 0;
        var firstLine = range[0];
        var lastLine = range[1] || firstLine;
        if (firstLine > lastLine) {
            return;
        }
        for (line = firstLine; line <= lastLine; line++) {
                mask[line - 1] = true;
        }
    });
    return mask;
}

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
