---
 layout: post
 title:  "原生javascript API实现HTML5浏览器全屏"
 date:   2017-03-07 13:34:51
 categories: javascript
 tags: javascript
---

<br>

在网上摘录的原生javascript API实现HTML5浏览器全屏方案，记录一下。
<!-- more -->

###Javascript

{% highlight javascript %}
// 自定义API对象，以便兼容使用
var fullScreenApi = {
    supportsFullScreen: false, //是否支持全屏
    isFullScreen: function() { return false; }, //是否全屏状态
    requestFullScreen: function() {}, //触发全屏
    cancelFullScreen: function() {}, //取消全屏
    fullScreenEventName: '', //全屏事件名
    prefix: '' //浏览器前缀
}
var browserPrefixes = 'webkit moz o ms khtml'.split(' '); //浏览器前缀列表

// 检测浏览器是否支持全屏API
if (typeof document.cancelFullScreen != 'undefined') {
    fullScreenApi.supportsFullScreen = true;
} else {
    //检测支持全屏的浏览器前缀，该API各浏览器厂商在该方法加了自己的前缀
    for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
        fullScreenApi.prefix = browserPrefixes[i];
        if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
            fullScreenApi.supportsFullScreen = true;
            break;
        }
    }
}

// 进入全屏，退出全屏，以及全屏事件名的兼容检测
if (fullScreenApi.supportsFullScreen) {
    fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

    fullScreenApi.isFullScreen = function() {
        switch (this.prefix) {
            case '':
                return document.fullScreen;
            case 'webkit':
                return document.webkitIsFullScreen;
            default:
                return document[this.prefix + 'FullScreen'];
        }
    }
    fullScreenApi.requestFullScreen = function(el) {
        return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
    }
    fullScreenApi.cancelFullScreen = function(el) {
        return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
    }
}
{% endhighlight %}
<br>
###css
{% highlight css %}
/* Mozilla草案 (有中划线) */
.elem:full-screen { width:100%; height:100%;}

/* W3C草案 (无中划线) */
.elem:fullscreen { width:100%; height:100%;}

/* 当前可用的供应商前缀 */
.elem:-webkit-full-screen,
.elem:-moz-full-screen { width:100%; height:100%; }
{% endhighlight %}
<br>
###html
{% highlight html %}

<div id="elem" class="elem">
    <h1>全屏DEMO</h1>
    <p>测试javascript现实全屏</p>
    <button id="btn">全屏</button>
</div>
{% endhighlight %}

<br>
###完整实例

{% highlight html %}
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>全屏</title>
	<style type="text/css">
		html, body {
		   width: 100%;
		   height: 100%;
		   margin: 0;
		   padding: 0;
		}
		.elem {
		   width: 600px;
		   height: 400px;
		   /*line-height: 400px;*/
		   background: #ccc;
		   font-size: 20px;
		   text-align: center;
		}
		/*.elem * {
		   line-height: normal;
		}*/
		h1 {
		   font-size: 24px;
		}
		button {
		   display: inline-block;
		   height: 50px;
		   width: 120px;
		}
		/* Mozilla草案 (有中划线) */
		.elem:full-screen { width:100%; height:100%;}

		/* W3C草案 (无中划线) */
		.elem:fullscreen { width:100%; height:100%;}

		/* 当前可用的供应商前缀 */
		.elem:-webkit-full-screen,
		.elem:-moz-full-screen { width:100%; height:100%; }
    </style>
</head>
<body>
    <div id="elem" class="elem">
        <h1>全屏DEMO</h1>
        <p>测试javascript现实全屏</p>
        <button id="btn">全屏</button>
    </div>

<script type="text/javascript">
    // 自定义API对象，以便兼容使用
    var fullScreenApi = {
        supportsFullScreen: false, //是否支持全屏
        isFullScreen: function() { return false; }, //是否全屏状态
        requestFullScreen: function() {}, //触发全屏
        cancelFullScreen: function() {}, //取消全屏
        fullScreenEventName: '', //全屏事件名
        prefix: '' //浏览器前缀
    }
    var browserPrefixes = 'webkit moz o ms khtml'.split(' '); //浏览器前缀列表

    // 检测浏览器是否支持全屏API
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        //检测支持全屏的浏览器前缀，该API各浏览器厂商在该方法加了自己的前缀
        for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
                fullScreenApi.supportsFullScreen = true;
                break;
            }
        }
    }

    // 进入全屏，退出全屏，以及全屏事件名的兼容检测
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function(el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function(el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }

    var elem = document.getElementById('elem');

    var btn = document.getElementById('btn');
    btn.addEventListener('click', function(event) {
        // console.info(event.target);
        if (fullScreenApi.isFullScreen()) {
            event.target.innerHTML = '全屏';
            fullScreenApi.cancelFullScreen(elem);
        } else {
            event.target.innerHTML = '退出全屏';
            fullScreenApi.requestFullScreen(elem);
        }
    }, false);

</script>
</body>
</html>
{% endhighlight %}
