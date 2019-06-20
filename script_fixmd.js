const fs = require('fs')
const path = require('path')
const readline = require('linebyline')

const DIR = '_posts'
// 2016-02-19-webpack入门笔记
// 2017-03-10-jekyll + github page标签页404
// 2017-03-07-原生javascript API实现HTML5浏览器全屏
// 2017-09-5-在express中使用markdown
// 2017-09-14-Babel小记
// 2017-10-10-扩展echarts图表类型
// 2017-07-05-Swagger+Node搭建API文档系统
// 2019-05-15-eslint+husky实现代码校验
const FILE_PATH = '2019-05-15-eslint+husky实现代码校验'

const SUFFIX = '.markdown'

fs.readdir(DIR, function(err, files) {
	files.map((file) => {
		if (file.indexOf(FILE_PATH + SUFFIX) === 0) {
			const filePath =  path.join(DIR, file)
			const fileBaseName = path.basename(file, SUFFIX)
			const filePathNew = path.join(DIR, fileBaseName + '.new') + SUFFIX
			let isHTMLOpen = false
			let isJsOpen = false

			console.log(filePath)
			console.log(filePathNew)

			const ws = fs.createWriteStream(filePathNew)
			const rl = readline(filePath)

			rl.on('line', function(line, lineCount, byteCount) {

			// console.log('line - ' + lineCount + ', ' + line)

				// ## ### 前面增加 换行
				if (line.match(/(^#{2,3})(?!#)/)) {
					console.log('line - ' + lineCount + ', ' + line)
					line = '<br>' + '\n' + line
				}

				// 单行是引用链接时增加 换行
				if (line.match(/^\[.+\]\(.+\)$/)) {
					console.log('line - ' + lineCount + ', ' + line)
					line = '<br>' + '\n' + line					
				}

				// js的代码高亮
				if (line.match(/^```js$/)) {
					line = '{% highlight javascript %}'
					isJsOpen = true
				} else if (line.match(/^```$/) && isJsOpen) {
					line = '{% endhighlight %}'
					isJsOpen = false					
				}

				// html的代码高亮
				if (line.match(/^```html$/)) {
					line = '{% highlight html %}'
					isHTMLOpen = true
				} else if (line.match(/^```$/) && isHTMLOpen) {
					line = '{% endhighlight %}'
					isHTMLOpen = false					
				}

				ws.write(line + '\n')

			}).on('error', function(e) {
				console.error(e)
			}).on('close', function() {
				ws.end()
				console.log('file close')
			})
		}
	})
})

