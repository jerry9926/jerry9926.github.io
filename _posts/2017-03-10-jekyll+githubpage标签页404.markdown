---
 layout: post
 title:  "jekyll + github page标签页404"
 date:   2017-03-10
 categories: 编程相关
 tags: jekyll
---

关于jekyll+githubpage的标签页的问题，终于解决掉了，记录一下。
<!-- more -->
<br>
##说说背景


一开始希望能够给博客加上分类页的功能，google一下后根据[这篇文章](http://pizn.github.io/2012/02/23/use-category-plugin-for-jekyll-blog.html)，一步一步跟来做，在本地`jekyll server`测试的时候可以实现了（以为结束了）。但是看到文章的最后有一段，隐隐感到不靠谱。内容如下：

>六、需要注意的，还有我疑惑的（需要大家帮忙看看的）
因为添加了插件，所以要确保你的 config.yml 文件里面的 safe 属性值为 false，因为这 个属性值为 true 的时候是使自定义插件失效。
我疑惑的是，我在本地完成上面的步骤之后，分类列表的每个分类链接可以成功到达分类的详细列表页面（即 category_index.html)，然而我上传到 github，没有报错，却无法到达那个页面，显示 404 错误。求大牛帮忙解决。

后来我提交了代码到github之后，打开网页点击分类页，果然跟那位网友一样，分类页显示404……

于是继续找找别人有没有什么解决方案。很多文章都是说怎么做这个分类页的，而几乎都没有提到上面放在github上之后页面访问不了的问题。
后来我了解到github所提供的`jekyll`解析功能因为安全原因，不完全支持`jekyll`的一些插件或者扩展功能。

在[这篇文章](https://crispgm.com/page/48-tips-for-jekyll-you-should-know.html)有所提及。
>在 GitHub Pages 只可以使用部分插件
由于安全性等原因的考虑，在 GitHub Pages 平台上只能使用白名单中的 7 个 Jekyll 插件。它们分别是：Jekyll Sitemap, Jekyll SEO Tag, github-metadata, Jekyll Feed, Jekyll Redirect From, Jemoji 和 Jekyll Mentions。
详见 https://help.github.com/articles/adding-jekyll-plugins-to-a-github-pages-site/。

然后我又看到这篇文章里面说到，可以让github不解析`jekyll`。
>在根目录下创建 .nojekyll 文件可以跳过 Jekyll 解析
GitHub Pages 支持 Jekyll 或者原始文件。最初 GitHub Pages 只支持 Jekyll，后来 GitHub 允许在 Repo 根目录下添加 .nojekyll 跳过解析。详见 https://github.com/blog/572-bypassing-jekyll-on-github-pages。

在使用`jekyll server`或者`jekyll build`的时候，都是会生成`_site`文件夹的。其实里面就是这个静态网站的全部内容，包括分类页面！那么现在就可以解决404的问题了。

<br>
##解决方法

1、就是在跟目录放一个名为`.nojekyll`的文件，目的是让github不解析`jeykll`。

2、就是把这个github仓库的内容调整一下，整个内容就只要`_site`文件夹里面的内容就可以了（加上上面那个文件），其他统统都不需要。因为这个就是静态网站的全部内容了。那么其他的文件怎么处理呢。很简单，我们新建一个分支（比如名为：source），现在这个分支就是所有源码的内容，而github page对应的分支（项目博客对应`gh-pages`分支，个人或机构博客对应`master`分支）就是网站的内容。

然后把代码提交上去，刷新博客，终于不是404，出现了分类页面的了！

参考资料：
[http://pizn.github.io/2012/02/23/use-category-plugin-for-jekyll-blog.html](http://pizn.github.io/2012/02/23/use-category-plugin-for-jekyll-blog.html)

[https://crispgm.com/page/48-tips-for-jekyll-you-should-know.html](https://crispgm.com/page/48-tips-for-jekyll-you-should-know.html)

[http://stackoverflow.com/questions/13189188/how-do-i-stop-github-from-regenerating-jekyll-site](http://stackoverflow.com/questions/13189188/how-do-i-stop-github-from-regenerating-jekyll-site)
