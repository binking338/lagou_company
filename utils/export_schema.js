var company = require('../company.json');
var fs = require('fs');

function schema(obj) {
	var type = typeof(obj);
	if (type == 'object') {
		if (obj instanceof Array) {
			type = [schema(obj[0])];
		} else {
			var sch = {};
			for (var k in obj) {
				var type = schema(obj[k]);
				sch[k] = type;
			}
			return sch;
		}
	} else {
		type = type.replace(/(\w)/, function(v) {
			return v.toUpperCase()
		});
	}
	return type;

}

fs.writeFileSync('company.json', JSON.stringify(schema(company[0]), null, 4));