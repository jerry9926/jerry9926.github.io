---
layout: post
title:  "用javascript获取viewport/window的尺寸（宽高）"
date:   2016-02-17 09:54:34
categories: Javascript

---

CSS媒体查询和javascript的window宽度不相等

<!-- more -->

**CSS使用的是设备宽度，JS使用的是document的宽度。**

要点：

**标准浏览器**
{% highlight javascript %}
viewportwidth = window.innerWidth,
viewportheight = window.innerHeight
{% endhighlight %}

**IE6**

{% highlight javascript %}
viewportwidth = document.documentElement.clientWidth,
viewportheight = document.documentElement.clientHeight
{% endhighlight %}

**IE6以下**

{% highlight javascript %}
viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
viewportheight = document.getElementsByTagName('body')[0].clientHeight
{% endhighlight %}

可以使用以下方法
  
  
简短版：
{% highlight javascript %}
function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}
{% endhighlight %}


长版：
{% highlight javascript %}

 var viewportwidth;
 var viewportheight;

 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

 if (typeof window.innerWidth != 'undefined')
 {
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
 }

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

 else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
 {
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
 }

 // older versions of IE

 else
 {
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
 }
{% endhighlight %}
  
  

参考：<a href="https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript" target="_blank">get-viewportwindow-size-width-and-height-javascript</a>
