var fs = require('fs');
var path = require('path');
var readline = require('linebyline');

var DIR = '_posts';
// 2016-02-19-webpack入门笔记;
// 2017-03-10-jekyll + github page标签页404
// 2017-03-07-原生javascript API实现HTML5浏览器全屏
// 2017-09-5-在express中使用markdown
// 2017-09-14-Babel小记
// 2017-10-10-扩展echarts图表类型
// 2017-07-05-Swagger+Node搭建API文档系统
var FILE_PATH = '2017-07-05-Swagger+Node搭建API文档系统';

var SUFFIX = '.markdown';

fs.readdir(DIR, function(err, files) {
	for (var i = 0; i < files.length; i++) {
		var file = files[i];

		// console.log(file);
		// console.log(FILE_PATH);
		// console.log(file.indexOf(FILE_PATH));

		if (file.indexOf(FILE_PATH + SUFFIX) === 0) {
			var filePath =  path.join(DIR, file);
			// var isOpen = true;
			var isJsEnd = false;
			var isCodeEnd = true;

			var fileBaseName = path.basename(file, SUFFIX);
			var filePathNew = path.join(DIR, fileBaseName + ' - 2') + SUFFIX;

			console.log(filePath);
			console.log(filePathNew);

			var ws = fs.createWriteStream(filePathNew);
			var rl = readline(filePath);

			rl.on('line', function(line, lineCount, byteCount) {

// console.log('line - ' + lineCount + ', ' + line);

				// ## ### 前面增加 换行
				if (line.match(/(^#{2,3})(?!#)/)) {
					console.log('line - ' + lineCount + ', ' + line);
					line = '<br>' + '\n' + line;
				}

				// 单行是引用链接时增加 换行
				if (line.match(/^\[.+\]\(.+\)$/)) {
					console.log('line - ' + lineCount + ', ' + line);
					line = '<br>' + '\n' + line;					
				}

				// js的代码高亮
				if (line.match(/^```js$/)) {
					line = '{% highlight javascript %}';
					isJsEnd = true;
				} else if (line.match(/^```$/) && isJsEnd) {
					line = '{% endhighlight %}';
					isJsEnd = false;					
				}

				// if (line.match(/^```$/)) {
				// 	if (isOpen) {
				// 		line = '{% highlight javascript %}';
				// 		isOpen = false;
				// 	} else {
				// 		line = '{% endhighlight %}';
				// 		isOpen = true;
				// 	}
				// }

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

