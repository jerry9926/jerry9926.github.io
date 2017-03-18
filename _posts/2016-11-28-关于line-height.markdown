---
layout: post
title:    "line-height的一些知识点"
date:     2016-11-28 21:59:51
categories: CSS 
---

### 1. 基本定义 

line-height 可以有**5种值**

- normal：`body{line-height:normal;}`

- inherit：`body{line-height:inherit;}`

- 百分比：`body{line-height:120%;}`

- 长度（px、em等）：`body{line-height:25px;}`

- 纯数字：`body{line-height:1.2}`

<br>

<!-- more -->

### 2. 继承
- 不同的定义方式的继承情况有所不同

	以此为例 
{% highlight html %}

<style>
body {
	font-size: 16px;
}
p {
	font-size: 12px;
}
</style>
<body>
	<p>hello world</p>
</body>

{% endhighlight %}


- 百分比；body设置line-height: 120%

<table class="table table-striped">
	<thead>
	<tr>
		<th>元素</th>
		<th>font-size</th>
		<th>line-height</th>
		<th>计算后的line-height</th>
	</tr>
	</thead>
	<tbody>
		<tr>
			<td>body</td>
			<td>16px</td>
			<td>120%</td>
			<td>16px*120%=19.2px</td>
		</tr>
		<tr>
			<td>p</td>
			<td>12px</td>
			<td>19.2px</td>
			<td>16px*120%=19.2px</td>
		</tr>
	</tbody>
</table>

 
- 长度值；body设置line-height: 20px

<table class="table table-striped">
	<thead>
	<tr>
		<th>元素</th>
		<th>font-size</th>
		<th>line-height</th>
		<th>计算后的line-height</th>
	</tr>
	</thead>
	<tbody>
		<tr>
			<td>body</td>
			<td>16px</td>
			<td>20px</td>
			<td>20px</td>
		</tr>
		<tr>
			<td>p</td>
			<td>12px</td>
			<td>20px</td>
			<td>20px</td>
		</tr>
	</tbody>
</table>
 
- normal；body设置line-height: normal（浏览器默认normal约为1.2）

<table class="table table-striped">
	<thead>
	<tr>
		<th>元素</th>
		<th>font-size</th>
		<th>line-height</th>
		<th>计算后的line-height</th>
	</tr>
	</thead>
	<tbody>
		<tr>
			<td>body</td>
			<td>16px</td>
			<td>normal</td>
			<td>16px*约1.2=约19.2px</td>
		</tr>
		<tr>
			<td>p</td>
			<td>12px</td>
			<td>normal</td>
			<td>12px*约1.2=约13.44px</td>
		</tr>
	</tbody>
</table>

- 纯数字（系数）；body设置line-height:1.5

<table class="table table-striped">
	<thead>
	<tr>
		<th>元素</th>
		<th>font-size</th>
		<th>line-height</th>
		<th>计算后的line-height</th>
	</tr>
	</thead>
	<tbody>
		<tr>
			<td>body</td>
			<td>16px</td>
			<td>1.5</td>
			<td>16px*1.5=24px</td>
		</tr>
		<tr>
			<td>p</td>
			<td>12px</td>
			<td>1.5</td>
			<td>12px*1.5=约18px</td>
		</tr>
	</tbody>
</table>
 
所以：一般来说设置line-height为纯数字是最理想的方式，因为会随着font-size而缩放
 
<br>

### 3. 特殊的情况
 
 - 说特殊的情况之前，先说一下CSS box，以下有四种box，例如html
{% highlight html %} 

<p>
	The <em> emphasis</em>
	element is defined as "inline".
</p>

{% endhighlight %}

1. `containing box`。这里p就是一个`containing box`，包裹了其他box

2. `inline box`。每个inline元素或者文字就是被`inline box`包裹着的。这里的`inline box`有三个，[The]、[em元素]、[element is defined as "inline".]，其中[The]、[element is defined as "inline".]称为匿名`inline box`

3. `line box`。`line box`是看不见的，作用就是包裹着`inline box`。这个一行包含3个`inline box`

4. `content box`。是包围着文字的一个看不见的box，高度取决于font-size

 
 - 概念：行间距就是`line-height`减去`font-size`

	例如：font-size: 16px;line-height: 20px;行间距20-14=4px。

 - 行间距会分为两半，一半放在`content box`的顶部，一半在底部。

	例如：文字顶部有半行间距2px，底部有2px
 
 - 如果：`line-height`小于`font-size`，`inline box`的高度优先于行高。

	例如：font-size: 16px;line-height: 12px，`content box`会溢出`inline box`的顶部和底部
 
 - line box的高度取决于内部最高的inline box的高度

<br>
 
### 相关问题
		
 - 一个空的div，高度是0，如果在div里面打入空格或者文字，div就会有高度。这个高度怎么产生的？
		
	一般以为是文字撑开的。**实际上并不是！而是`line-height`撑开的**。
		
	实验是，设置了`font-size:0`后，div高度就为0了，之后在设置`line-height`，div的高度就等于`line-height`
		
	而这里`line-height`产生的高度，其实就是line box的高度。

<br>	
 
#### 行高的垂直居中性

`line-height`的最终表示的由`line box`实现的。而`line box`的高度不管是多少，里面的`inline box`总是在水平中垂线上显示的。利用这点特性就可以实现垂直居中

<br>	
 
> **1.单行文字垂直居中** 

>> 一般说设置`line-height`值和`height`值一致可以实现垂直居中，实际上并不需要height，直接把`line-height`设置成需要的高度即可（正是因为行高的垂直居中性）

{% highlight html %}

<div id="d1">
	<p>hello world</p>
</div>
<style>
div#d1 p {
	line-height: 150px;
}
</style>

{% endhighlight %}

<br>
	
> 2.多行文字垂直居中 

{% highlight html %}
<div id="d2">
	<span>hello world hello world hello world hello world hello world hello world hello world </span>
</div>
{% endhighlight %}
 
首先看看常见的错误方式

{% highlight css %}
div#d2 {
	height: 150px;
}
div#d2 span {
	vertical-align: middle;
}
{% endhighlight %}

这个思路是用height给父元素（块状元素）设置一个height，然后里面的span（行内元素）设置了`vertical-align:middle；`
		
表面上看height用在块状元素上，`vertical-align`用在行内元素上，做的都对，但是怎么不是想象中的span在div垂直居中。浏览器怎么不按照css规范来渲染呢？（事实上了解这块概念后，浏览器这样显示并没有任何问题）
		
> 具体分析一下：  
>
>
> `vertical-align`是调整`inline box`在`line box`中的垂直对齐位置，而不是`contain box`。本例中，div是`contain box`，span是`inline box`。设置`vertical-aglin`只会让span在当前行（所在的`line box`）里上下调整。
 
 知道了问题的本质之后，那如何修改。

> 思路： 
> 
> 1. 要让div变成`line-box`（事实上是让`line box`和`contain box`的高度一致）
> 
> 2. span里多行文本产生的`line-box`要被消灭
 
{% highlight css %}
div#d2 {
	border: 1px #999 dashed;
	line-height: 150px;
}
div#d2:after {
	content: ' '; // 有个空格
}
div#d2 span {
	display: inline-block;
	line-height: normal;
	vertical-align: middle;
}
{% endhighlight %}
 
> div和伪类的设置就是为了达到第一个目的；  
> 
> span的display设置为`inline-block`就是把span外部呈现inline的特性，就是一个`inline box`。同时对于自身又是一个`contain box`，所以这时span里面的`line box`不是相对div的`contain box`，而是span的`contain box`，所以达到了目的二。
> 
> 这时`vertical-align:middle`调整span为垂直居中（终于达到目的了）
> 
> 另外span的`line-height`要重新设置一下，因为父元素的`line-height`设置的值作为高度来用的，而不是行高。
 
<br>

> **3.图片垂直居中**
		
对于img元素来说，仿佛本来就是一个inline-block的元素
{% highlight html %}
<div id="d3">
		<img src="https://s1.bdp.cn/static/images/new_home/solution_sell_logo.png" alt="">
		<img src="https://s1.bdp.cn/static/images/new_home/solution_baidu_logo.png" alt="">
		<img src="https://s1.bdp.cn/static/images/new_home/solution_internet_logo.png" alt="">
</div>
<style>
div#d3 {
		line-height: 150px;
		font-size: 0;
}
div#d3 img {
		vertical-align: middle;
}
</style>
{% endhighlight %}		
 
 - 补充一个知识点：
		
	`inline-block`元素之间会自然存在一个间隙，这个不是bug。而是`inline-block`元素html代码中的空格，间隙就是空格。设置`font-size:0`可以使间隙消失。另外还有许多方式达到此目的，这里不过多讨论。
 
<br>
 
### 信息来源：
<a href="http://www.cnblogs.com/fengzheng126/archive/2012/05/18/2507632.html" target="_blank">深入了解css的行高Line Height属性</a>

<a href="http://www.zhangxinxu.com/wordpress/2009/11/css%E8%A1%8C%E9%AB%98line-height%E7%9A%84%E4%B8%80%E4%BA%9B%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E5%8F%8A%E5%BA%94%E7%94%A8/" target="_blank">css行高line-height的一些深入理解及应用</a>
