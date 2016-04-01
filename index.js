'use strict';
const through = require('through2');
const fs = require('fs');
const extend = require('extend');
const PluginError = require('gulp-util').PluginError;
const File = require('gulp-util').File;

const PLUGIN_NAME = 'json2po';

const MSGID = 'msgid';
const MSGSTR = 'msgstr';

const date = new Date();
const TODAY = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

const DEFAULT_VALUES = {
	'Project-Id-Version': 'Sample Project',
	'POT-Creation-Date': TODAY,
	'PO-Revision-Date': TODAY,
	'Last-Translator': '',
	'Language-Team': '',
	'MIME-Version': '1.0',
	'Content-Type': 'text/plain; charset=utf-8',
	'Content-Transfer-Encoding': '8bit',
	'Language': 'no',
	'X-Generator': 'None'
};

const constructHeader = (props) => {
	let res = [];
	res.push(`${MSGID} ""`);
	res.push(`${MSGSTR} ""`);

	Object.keys(props).forEach((key) => {
		res.push(`"${key}: ${props[key]}\\n"`);
	});
	
	return res;
};

const writeTranslations = (file) => {
	var res = [];
	var trans = JSON.parse(file.contents.toString());

	Object.keys(trans).forEach((key) => {
		res.push('');
		res.push(`${MSGID} "${key}"`);
		res.push(`${MSGSTR} "${trans[key]}"`);
	});
	
	return res;
};

const constructPo = (props, file) => {
	let header = constructHeader(props);
	let translations = writeTranslations(file);
	return header.concat(translations).join('\n');
};

module.exports = (properties, filename) => {
	if (properties === undefined || properties === null) {
		properties = {};
	} else if (typeof properties === 'string' && filename === undefined){
		filename = properties;
		properties = {};
	}
	
	if (filename === undefined) {
		throw new Error('No filename specified');
	}

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		const props = extend({}, DEFAULT_VALUES, properties);
		try {
			const result = constructPo(props, file);
			this.push(new File({cwd: '', base: '', path: filename, contents: new Buffer(result)}));
			return cb();
		} catch (err) {
			this.emit('error', new PluginError(PLUGIN_NAME, err, {showStack: true}));
		}
	});
};
