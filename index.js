var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');
var assert = require('assert');

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
			'pn': p,
			'sortField': 1,
			'havemark': 0
		})
		.end(function(err, res) {
			callback(null, res.body);
		});
}, function(err, result) {
	assert.equal(err, null);

	var company = [];
	for (var i = 0; i < 20; i++) {
		company = company.concat(result[i].result);
	}
	console.log(company.length);
	async.mapLimit(company, 10, function(p, cb) {
		getDetail(p.companyId, function(addr) {
			p.addr = addr;
			cb(null, addr);
		});
	}, function(err, result) {
		assert.equal(err, null);

		fs.writeFile('company.json', JSON.stringify(company), function(err) {
			if (err) console.error(err);
		});
	});

});

function getDetail(id, callback) {
	superagent
		.get("http://www.lagou.com/gongsi/" + id + ".html")
		.end(function(err, res) {
			assert.equal(err, null);
			var $ = cheerio.load(res.text);
			var addr = [];
			$('#location_container ul li.mlist_ul_li').each(function(i, ele) {
				var title = $(this).find('.mlist_li_title .li_title_text').text().replace(/\s/g,'');
				var desc = $(this).find('.mlist_li_desc').text().replace(/\s/g,'');
				addr.push({
					'area': title,
					'address': desc
				});
			});
			callback(addr);
		});
}