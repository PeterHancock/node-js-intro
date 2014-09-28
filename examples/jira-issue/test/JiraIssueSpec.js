var proxyquire = require('proxyquire');
var Readable = require('stream').Readable;
var EventEmitter = require('events').EventEmitter;

var createMockHttps = function(responseData) {
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

describe('JiraClient', function () {
    it('getIssue works!', function (done) {
        var key = 'PROJ-123';
        var summary = "It's broke";

        var jiraIssueJson = JSON.stringify({
            issues: [
                { key: key, fields: { summary: summary} }
            ]
        });

        var mockHttps = createMockHttps(jiraIssueJson);

        var JiraClient = proxyquire('../index.js', { https: mockHttps });

        var sut = new JiraClient({host: 'whatever', user: 'whatever', password: '***'});

        sut.getIssue(key, function (err, issue) {
            expect(issue.summary).toBe(summary);
            done();
        });
    });
});