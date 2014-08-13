var fs = require('fs');
var path = require('path');
var os = require('os');
var baseDir = '.';


function processHtml(fileName) {
	var fileNames = getFileNames();
	if(fileNames && fileNames.length) {
		fileNames.forEach(function(f) {
			var d = path.join(path.dirname(f), 'demo.html');
			if(fs.existsSync(d)) {
				fs.unlinkSync(d);
			}
			var content = fs.readFileSync(f)+'';
			var html = content.split(os.EOL);
			html.forEach(function(h) {
				if(h.indexOf('__include__') !== -1) {
					var ifile = /__include__\([\'\"](.+)[\'\"]\)/ig.exec(h)[1];
					h = fs.readFileSync(ifile);
				}
				fs.appendFileSync(d, h);
			});
		});
	}
	
}

function getFileNames() {
	var dir = fs.readdirSync(baseDir);
	var fileNames = [];
	if(dir && dir.length) {
		dir.forEach(function(d) {
			var stat  = fs.statSync(d);
			if(stat.isDirectory()) {
				fileNames.push(path.join(d, 'source.html'));
			}
		});
	}
	return fileNames;
}
processHtml();
