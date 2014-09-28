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
