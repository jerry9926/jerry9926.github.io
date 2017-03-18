---
layout: post
title: 	"利用NSSortDescriptor给NSArray排序"
date: 	2015-05-06 10:11:51
categories: iOS
tags: NSArray
---

利用`NSSortDescriptor`排序，可以对数组里面的对象的某一个属性来进行排序。

NSSortDescriptor的组成，`key`建，`ascending`升序。另外还有一个属性，关于排序的值之间的比较，这是一个可选参数。默认情况下， 是一个简单的对比排序，也可以通过一个选择器（`SEL`）或者比较器（`NSComparator`）而发生改变。
*任何时候当你在为面向用户的字符串排序时，一定要加入`localizedStandardCompare:`选择器，它将根据当前语言环境的语言规则进行排序（语言环境可能会根据大小写，变音符号等等的顺序而发生改变）。

假设有一组数据，反应投票的情况，voteInfo，有投票人(NSString *)name、投票时间(NSInteger)time、投票结果(BOOL)result

<!-- more -->

{% highlight Objective-C %}
NSArray *names = @[ @"Alice", @"Bob", @"Charlie", @"Quentin" ];
NSArray *times = @[ @1420041600, @1420128000, @1420214400, @1420300800 ];
NSArray *results = @[ @1, @0, @0, @1 ];

NSMutableArray *voteArray = [NSMutableArray array];
[names enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
VoteInfo *voteInfo = [[VoteInfo alloc] init];
voteInfo.name = [names objectAtIndex:idx];
voteInfo.time = [times objectAtIndex:idx];
voteInfo.result = [results objectAtIndex:idx];
[voteArray addObject:voteInfo];
}];

// 以名字升序排列
NSSortDescriptor *nameSortDescriptor = [NSSortDescriptor sortDescriptorWithKey:@"name"
ascending:YES
selector:@selector(localizedStandardCompare:)];
NSLog(@"以名字升序排列: %@", [voteArray sortedArrayUsingDescriptors:@[nameSortDescriptor]]);
// "Alice", "Bob", "Charlie", "Quentin"

// 以时间降序排列
NSSortDescriptor *timeSortDescriptor = [NSSortDescriptor sortDescriptorWithKey:@"time"
ascending:NO];
NSLog(@"以时间降序排列: %@", [voteArray sortedArrayUsingDescriptors:@[timeSortDescriptor]]);
// 1420300800, 1420214400, 1420128000, 1420041600
{% endhighlight %}

NSSortDescriptor仅对`NSSet`、`NSArray`、`NSMutableArray`可以排序，需要注意的是

**NSSet**  
`- (NSArray *)sortedArrayUsingDescriptors:(NSArray *)sortDescriptors;` 这是对NSSet排序，返回一个NSArray。

**NSArray**  
`- (NSArray *)sortedArrayUsingDescriptors:(NSArray *)sortDescriptors;` 这是对NSArray排序，返回一个新的NSArray，注意内存泄漏。

**NSMutableArray**  
`- (void)sortUsingDescriptors:(NSArray *)sortDescriptors;` 这是NSMutableArray排序，没有返回值。
  
  
参考文章：  
[http://nshipster.cn/nssortdescriptor/](http://nshipster.cn/nssortdescriptor/ "参考文章")  
[http://www.cnblogs.com/wuwangchuxin/p/3759141.html](http://www.cnblogs.com/wuwangchuxin/p/3759141.html "参考文章")