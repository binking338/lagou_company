var async = require('async')
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');

var baseUrl = 'http://www.lagou.com/';
var pages = [];
for (var i = 1; i < 21; i++) {
	pages.push(i);
}
async.mapLimit(pages, 5, function(p, callback) {
	superagent
		.post(url.resolve(baseUrl, 'gongsi/6-0-0.json'))
		.type('form')
		.accept('json')
		.send({
			'first': false,
			'pn': 1,
			'sortField': 1,
			'havemark': 0
		})
		.end(function(err, res) {
			callback(null, res.body);
		});
}, function(err, result) {
	if (err) {
		console.error(err);
	} else {
		var company = [];
		for (var i = 0; i < 20; i++) {
			company = company.concat(result[i].result);
		}
		console.log(company.length);
		fs.writeFile('company.json', JSON.stringify(company), function(err) {
			if (err) console.error(err);
		});
	}
});