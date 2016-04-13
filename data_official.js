var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


var insertCompany = function(company, db, callback) {
	db.collection('company').insertOne(company, function(err, result) {
		assert.equal(err, null);
		callback(result);
	});
};

var findCompany = function(company, db, callback) {
	db.collection('company').findOne({
		'companyId': company.companyId
	}, {}, function(err, result) {
		assert.equal(err, null);
		callback(result);
	});
};

var insertCompanies = function(companies, db, callback) {
	async.mapLimit(companies, 1, function(company, cb) {
		findCompany(company, db, function(r) {
			if (r == null) {
				insertCompany(company, db, function(e) {
					cb(null, e);
				});
			} else {
				cb(null, false);
			}
		});
	}, function(err, result) {
		assert.equal(err, null);
		callback(result);
	})
};

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
	console.log("Connected correctly to server.");
	var companies = require('./company.json');
	insertCompanies(companies, db, function(result){
		console.log(result);
		db.close();
	});
});
