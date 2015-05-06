---
layout: post
title:  "UITableViewCell里UIButton的选中态在Cell选中的时候被触发"
date:   2015-04-17 17:11:51
categories: iOS UITableView
---

在iOS6中，tableViewCell中有UIButton。cell被选中的时候，button会显示高亮状态，如果不希望这样，需要重写cell的setHightlighted和setSelected方法

{% highlight Objective-C %}
- (void)setHighlighted:(BOOL)highlighted animated:(BOOL)animated {
[super setHighlighted:highlighted animated:animated];
self.yourButton.highlighted = NO;
}
- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
[super setSelected:selected animated:animated];
self.yourButton.selected = NO;
// If you don't set highlighted to NO in this method,
// for some reason it'll be highlighed while the
// table cell selection animates out
self.yourButton.highlighted = NO;
}
{% endhighlight %}


