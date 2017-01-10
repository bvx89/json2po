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

const isObject = (obj) => obj === Object(obj);

const populateTranslation = (res, trans, prevKey) => {
	Object.keys(trans).forEach((key) => {
		const id = (prevKey ? prevKey + '.' + key : key);
		if ((isObject(trans[key]))) {
			populateTranslation(res, trans[key], id);
		} else {
			res.push('');
			res.push(`${MSGID} "${id}"`);
			res.push(`${MSGSTR} ${JSON.stringify(trans[key])}`);
		}
	});
};

const writeTranslations = (content) => {
	let res = [];
	let trans = JSON.parse(content);

	populateTranslation(res, trans);
	return res;
};

const constructPo = (content, properties = {}) => {
	const props = Object.assign({}, DEFAULT_VALUES, properties);
	let header = constructHeader(props);
	let translations = writeTranslations(content);
	return header.concat(translations).join('\n');
};

module.exports = constructPo;