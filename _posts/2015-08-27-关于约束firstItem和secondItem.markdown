---
layout: post
title: 	"关于约束firstItem和secondItem"
date: 	2015-08-27 17:57:51
categories: iOS
tags: AutoLayout
---

今天在一个autolayout 的问题上面，发现了约束里面的firstItem和secondItem的区别。
先看看定义是怎么说的

{% highlight Objective-C %}
FirstItem.Attribute1 = (SecondItem.Attribute2 * Multiplier) + Constant
{% endhighlight %}

firstItem的属性等于secondItem的属性乘以比例加上约束的值。  
这个定义其实我们都是知道的了。需要注意的是，我们一直关注的就是两个约束之间的关系，但是还有一个重要的信息没有关注的。就是`firstItem是等号左边的值`，也就是说通过这个约束，`根据secondItem的属性（比例和约束值）可以得到firstItem的属性`。

这个结论对实际问题有什么影响呢。就在今天遇到的一个问题就有关系。说一下这个场景。
有一个UITableviewCell，里面有许多信息，主要关注就是一段文字和一个图片。文字是不知道有多少行的，需要动态的换行。图片呢，就是有一个固定的比列的，比例为1280：720。整个UI就如图所示：
![示例图片]({{ site.url }}/assets/images/fisrtItemAndSecondItem_1.jpg)

文字的约束设置：有上下左右的约束，如图：
![示例图片]({{ site.url }}/assets/images/fisrtItemAndSecondItem_2.jpg)

图片的约束设置：也是有上下左右的约束，并且有一个比例的约束，如图：
![示例图片]({{ site.url }}/assets/images/fisrtItemAndSecondItem_3.jpg)

就是这样的设置，看起来是没有问题的。  
这个UITableviewCell的显示的过程，就是先要确定高度，然后再渲染内容。
那根据现在的约束是不是可以正确的计算出高度呢。计算高度是使用系统的方法：

{% highlight Objective-C %}
[cell.contentView systemLayoutSizeFittingSize:UILayoutFittingCompressedSize]
{% endhighlight %}

计算高度前就做了必要的设置：
{% highlight Objective-C %}
// 设置文本应该换行的宽度
[self.textView setPreferredMaxLayoutWidth:self.contentView.frame.size.width - CELL_PADDING];
// 设置文本内容
self.textView.text = gdtAdvertisement.desc;
// 设置图片
[self.bbsImageView setImage:[UIImage imageNamed:@"bg_bbs_read_topic"]];
{% endhighlight %}

这个时候就发现一个问题啊。就是图片是网络上面加载的图片，这有一个异步的过程，现在设置只是开始下载，`图片还没有真正设置上去。那图片的显示会正常吗？`  
一开始的时候，并没有好的思路，先随便加载了一张本地的图片，hack了这个问题。
但是，其实还有一个更根本的问题就是，`这里图片不设置就不能正常显示吗？毕竟图片是设置了足够多的约束的。`
