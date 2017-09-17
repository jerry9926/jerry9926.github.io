---
 layout: post
 title:  "在express中使用markdown"
 date:   2017-09-05 16:01:01
 categories: javascript
 tags: express markdown
---

之前在github的博客中已经使用过`markdown`语法。`markdown`语法简单，适合技术文章和说明文档。这次项目中的文档希望使用`markdown`来写，把文档放在express之中。记录一下使用过程。

<!-- more -->

<br>
###安装依赖
`markdown`语法需要解析，需要使用`markdown`模块，安装模块。

{% highlight javascript %}
npm install markdown --save
{% endhighlight %}

在`app.js`中引用

{% highlight javascript %}
var markdown = require('markdown').markdown;
{% endhighlight %}

<br>
###简单粗暴的使用方式
一开始的时候，我使用了一种简单粗暴的方式。不是提倡的方式，但是思考的过程值得记录。
我把express默认的`jade`模版引擎更换为`markdown`模版引擎。
在`app.js`中修改。

{% highlight javascript %}
var fs = require('fs');

// 设置markdown模版引擎
app.engine('md', function(path, options, fn) {
    fs.readFile(path, 'utf8', function(err, str) {
        if (err) return fn(err);
        str = markdown.toHTML(str);
        fn(null, str);
    });
});
// 使用
app.set('view engine', 'md');
// 更换了模版的路径，这个路径就是放markdown文件的地方
app.set('views', path.join(__dirname, 'doc/'));
// 增加一个路由
app.get('/doc',  function(req, res) {
    res.render('index');
});
{% endhighlight %}
这里的路由使用了`index`模版，就是在`doc`文件夹中，新增的`index.md`文件。`index.md`文件里面就直接用`markdown`语法写文档的内容。

```
# 平台文档

## 功能
xxxxxxx
```
现在，访问`/doc`已经可以显示出来`markdown`的文档的，但是现在的效果并不如人意。样式很简陋，几乎就像个纯文本一样。因为确实没有设置css啊，但是现在的做法是直接读取`markdown`文件，并不能增加对css的支持。显然这并不合理。

<br>
###更合理的方式
更合理的方式不应该直接用`markdown`文件作为视图的模版文件。应该还是用`jade`作为模版文件，只是在其中增加对`markdown`的支持。
再次修改`app.js`

{% highlight javascript %}
// 还原为jade作为模版引擎
app.set('view engine', 'jade');
// 在渲染的操作前，读取markdown文件，把内容转为html
app.get('/doc',  function(req, res) {
    fs.readFile('doc/index.md', 'utf8', function(err, data) {
        var html = markdown.toHTML(data);
        res.render('doc', {mdContent: html});
    });
});
{% endhighlight %}

增加`jade`文件

{% highlight javascript %}
// layout.jade
doctype html
html
    head
        title= title
        link(rel='stylesheet', href='/public/doc/github-markdown.css')
    body
        block content
// doc.jade
extends layout

block content
    .markdown-body
        != mdContent
{% endhighlight %}

为了增加样式，添加了`github-markdown.css`文件，网上有很多配合`markdown`的样式，根据喜好选择即可。

终于显示出来的文档有模有样了！

<br>
###参考资料

[http://blog.csdn.net/elliott_yoho/article/details/53440296](http://blog.csdn.net/elliott_yoho/article/details/53440296)
