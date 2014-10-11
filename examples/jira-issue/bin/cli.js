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
