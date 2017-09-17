var fs = require('fs');
var path = require('path');
var readline = require('linebyline');

var DIR = '_posts';
// 2016-02-19-webpack入门笔记;
// 2017-03-10-jekyll + github page标签页404
// 2017-03-07-原生javascript API实现HTML5浏览器全屏
// 2017-09-5-在express中使用markdown
// 2017-09-14-Babel小记
var FILE_PATH = '2017-09-14-Babel小记';

var SUFFIX = '.markdown';

fs.readdir(DIR, function(err, files) {
	for (var i = 0; i < files.length; i++) {
		var file = files[i];

		// console.log(file);
		// console.log(FILE_PATH);

		// console.log(file.indexOf(FILE_PATH));

		if (file.indexOf(FILE_PATH) === 0) {
			var filePath =  path.join(DIR, file);
			var isOpen = true;

			var fileBaseName = path.basename(file, SUFFIX);
			var filePathNew = path.join(DIR, fileBaseName + ' - 2') + SUFFIX;

			console.log(filePath);
			console.log(filePathNew);

			var ws = fs.createWriteStream(filePathNew);
			var rl = readline(filePath);

			rl.on('line', function(line, lineCount, byteCount) {

// console.log('line - ' + lineCount + ', ' + line);

				if (line.match(/(^#{2,3})(?!#)/)) {
					console.log('line - ' + lineCount + ', ' + line);

// console.log('get ###');
					line = '<br>' + '\n' + line;
				}

				if (line.match(/^```$/)) {
					if (isOpen) {
						line = '{% highlight javascript %}';
						isOpen = false;
					} else {
						line = '{% endhighlight %}';
						isOpen = true;
					}
				}

				ws.write(line + '\n');

			}).on('error', function(e) {
				console.error(e);
			}).on('close', function() {
				ws.end();
				console.log('file close');
			})
		}

	};
});

