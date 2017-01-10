const assert = require('assert');
const converter = require('../lib/converter');

const testData = {
	"CHANGE_STATUS": "Endre status",
	"STEP": {
		"FIRST": "Første",
		"SECOND": "Andre",
		"INDENT": {
			"FIRST": "Første indent",
			"SECOND": "Andre indent"
		}
	},
	"REGULAR": "Vanlig"
};
const stringified = JSON.stringify(testData);
const message = 'Convert error';
assert.doesNotThrow(
	() => converter(stringified),
	Error,
	message
);
