---
 layout: post
 title:  "《javascript正则表达式迷你书》读书笔记"
 date:   2018-03-01 15:01:24
 categories: web前端
 tags: [正则表达式]
---

最近看了一本电子书《javascript正则表达式迷你书》，里面的讲解比较通俗易懂。把之前零散的知识点整理下来，写这个读书笔记。

<!-- more -->

<br>
###匹配方式
1. 横向模糊匹配
> 指一个正则可匹配的字符串长度不是固定的，可以是多种情况。
实现方式是使用量词。比如{m,n}，表示连续出现最少m次，最多n次。`/ab{2,5}c/`

2. 纵向模糊匹配
> 指一个正则匹配的字符串，具体到某一位字符时，可以不是某个确定的字符，可以有多种可能。
实现方式是使用字符组。比如[abc]，表示字符可以是"a","b","c"中的任何一个。`/a[123]b/`

<br>
###字符组

####范围表示法

`[123456abcdefGHIJKLM]`用范围表示法，`[1-6a-fG-M]`。用连字符`-`来省略和简写。如果要匹配"a"、"-"、"z"这三个中的任意字符，怎么写呢？不能写`[a-z]`，应该这样表示小字符中的任何一个。可以写`[-az]`、`[az-]`、`[a\-z]`。要么放在开头，要么放在结尾，要么转义。

####排除字符组

比如，可以是任何字符但不能是"a"、"b"、"c"。这里使用^（脱字符）,`[^abc]`

####字符组的简写形式

`\d` 表示`[0-9]`，一位数字。记忆方式：英文digit（数字）。
`\D` 表示`[^0-9]`，表示非数字。
`\w` 表示`[0-9a-zA-Z_]`。表示数字、大小写字母和下划线。记忆方式：word，就是单词字符。
`\W` 表示`[^0-9a-zA-Z_]`。表示非单词字符。
`\s` 表示`[ \t\v\n\r\f]`。表示空白符，包括空格、水平制表符、垂直制表符、换行符、回车符、换页符。记忆方式，space，空白（white space）。
`\S` 表示`[^ \t\v\n\r\f]`。表示非空白符。
`.` 表示`[^\n\r\u2028\u2029]`。通配符，表示几乎任意字符。换行符、回车符、行分隔符和段分隔符除外。记忆方式：省略号...，表示任何东西。

<br>
###量词

量词也称重复。`{m,n}`

####量词的简写形式

`{m,}` 表示至少出现m次。
`{m}` 等价于`{m,m}`，表示出现m次。
`?` 等价于`{0,1}`，表示出现或者不出现。记忆方式：问号表示有吗？
`+` 等价于`{1,}`，表示至少出现一次。记忆方式：加号是追加的意思，至少有一个再追加。
`*` 等价于`{0,}`，表示出现任意次数，有可能不出现。记忆方式：看天上星星，可能有一颗，可能有许多颗，可能一颗都没有。

####贪婪匹配与惰性匹配

例子
{% highlight javascript %}
var regex = /\d{2,5}/g;
var string = "123 1234 12345 123456";
console.log(string.match(regex));
// ["123", "1234", "12345", "12345"]
{% endhighlight %}

其中正则`/\d{2,5}/`，表示数字连续出现2到5次。可以匹配2位，3位，5位连续数字。
因为是贪婪的，它会尽可能多的匹配。给6个就匹配5个，给3个就匹配3个。

如果是惰性匹配就是尽可能少的匹配。
```
// ["12", "12", "34", "12", ""34", "12", "34", "56"]
```
因为是惰性匹配，当有两个数字的时候就足够了，不往下尝试了。
通过在量词后面加个问号可以实现惰性匹配。
贪婪量词
`{m,n}`、`{m,}`、`?`、`+`、`*`。
惰性量词
`{m,n}?`、`{m,}?`、`??`、`+?`、`*?`。
惰性量词的记忆方式：量词后加一个问号，问问，你是不是贪婪？

<br>
###多选分支

一个模式可以实现横向和纵向模糊匹配。而多选分支可以支持多个子模式任选其一。
具体形式如：`(p1|p2|p2)`，其中p1、p2、p3是子模式，用`|`（管道符）分隔。比如要匹配"good"和"nice"。可以使用`/good|nice/`。
注意：如有正则`/good|goodbye/`去匹配`goodbye`时，结果是`good`。因为分支结构也是**惰性**的，即前面匹配上了，就不尝试后面了。

<br>
###位置匹配

####什么是位置

位置（锚）是相邻字符之间的位置。比如，下图中箭头所指的地方：

![示例图片]({{ site.url }}/assets/images/180301/1665f4669.png)

####如何匹配位置

在ES5中，有6个锚：
`^`、`$`、`\b`、`\B`、`(?=p)`、`(?!p)`

####^和$

`^`（脱字符）匹配开头，在多行匹配中匹配行开头。
`$`（美元符号）匹配结尾，在多行匹配中匹配行结尾。
比如我们把字符串的开头和结尾用"#"替换（位置是可以替换成字符的）
{% highlight javascript %}
var result = "hello".replace(/^|$/g, '#');
console.log(result);
// #hello#
{% endhighlight %}
多行匹配模式（即有修饰符 m）时，二者是行的概念，这一点需要我们注意：
{% highlight javascript %}
var result = "I\nlove\njavascript".replace(/^|$/gm, '#');
console.log(result);
/*
#I#
#love#
#javascript#
*/
{% endhighlight %}

#### \b和\B

`\b` 是单词边界，具体就是 `\w` 与 `\W` 之间的位置，也包括 `\w` 与 `^` 之间的位置，和 `\w` 与 `$` 之间的位置。

{% highlight javascript %}
var result = "[JS] Lesson_01.mp4".replace(/\b/g, '#');
console.log(result);
// => "[#JS#] #Lesson_01#.#mp4#"
{% endhighlight %}

`\B` 就是 `\b` 的反面的意思，非单词边界。例如在字符串中所有位置中，扣掉 `\b`，剩下的都是 `\B` 的。

{% highlight javascript %}
var result = "[JS] Lesson_01.mp4".replace(/\B/g, '#');
console.log(result);
// => "#[J#S]# L#e#s#s#o#n#_#0#1.m#p#4"
{% endhighlight %}

#### (?=p)和(?!p)

`(?=p)`，其中 p 是一个子模式，即 p 前面的位置，或者说，该位置后面的字符要匹配 p。
比如 `(?=l)`，表示 "l" 字符前面的位置，例如：
```
var result = "hello".replace(/(?=l)/g, '#');
console.log(result);
// => "he#l#lo"
```

`(?!p)` 就是 `(?=p)` 的反面意思，比如：
```
var result = "hello".replace(/(?!l)/g, '#');
console.log(result);
// => "#h#ell#o#"
```
二者的学名分别是 **positive lookahead**和 **negative lookahead**。中文翻译分别是正向先行断言和负向先行断言。ES5 之后的版本，会支持 **positive lookbehind** 和 **negative lookbehind**。

字符之间的位置，可以写成多个。比如，把 `/^hello$/` 写成 `/^^hello$$$/`是等价的。把位置理解空字符就可以了。

<br>
###括号的作用

####分组和分支结构

这时括号最直觉的作用，强调括号内的正则是一个整体，即提供子表达式。

####分组

如果要匹配连续出现的a时，可以用`/a+/`，如果要匹配连续出现的ab，要使用`/(ab)+/`。这个括号表示量词`+`要作用与"ab"这个整体。

####分支结构

`(p1|p2)`中，括号为分支的说明提供了可能。作用也是显而易见的。

####分组引用

这时括号的一个重要作用，有了它我么可以进行数据提取，以及强大的替换操作。
以日期格式为例，比如yyyy-mm-dd，正则为
{% highlight javascript %}
var regex = /\d{4}-\d{2}-\d{2}/;
{% endhighlight %}
可视化的形式（可视化形式有利于理解）：

![示例图片]({{ site.url }}/assets/images/180301/2665f4669.png)

修改为括号版
{% highlight javascript %}
var regex = /(\d{4})-(\d{2})-(\d{2})/;
{% endhighlight %}
可视化的形式：

![示例图片]({{ site.url }}/assets/images/180301/35980dcc1ff0.png)

对比这两个可视化图片，我们发现，与前者相比，后者多了分组编号，如 Group #1。其实正则引擎也是这么做的，在匹配过程中，给每一个分组都开辟一个空间，用来存储每一个分组匹配到的数据。
既然分组可以捕获数据，那么我们就可以使用它们。

####提取数据

如果要提取出年、月、日，可以这样做
{% highlight javascript %}
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log( string.match(regex) );
// => ["2017-06-12", "2017", "06", "12", index: 0, input: "2017-06-12"]
{% endhighlight %}
>`match` 返回的一个数组，第一个元素是整体匹配结果，然后是各个分组（括号里）匹配的内容，然后是匹配下标，最后是输入的文本。另外，正则表达式是否有修饰符`g`，`match`返回的数组格式是不一样的。

另外也可以使用正则实例对象的 `exec` 方法：
{% highlight javascript %}
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log( regex.exec(string) );
// => ["2017-06-12", "2017", "06", "12", index: 0, input: "2017-06-12"]
{% endhighlight %}
同时，也可以使用构造函数的全局属性 $1 至 $9 来获取：
{% highlight javascript %}
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
regex.test(string); // 正则操作即可，例如
//regex.exec(string);
//string.match(regex);
console.log(RegExp.$1); // "2017"
console.log(RegExp.$2); // "06"
console.log(RegExp.$3); // "12"
{% endhighlight %}

####替换

比如，想把 yyyy-mm-dd 格式，替换成 mm/dd/yyyy
{% highlight javascript %}
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, "$2/$3/$1");
console.log(result);
// => "06/12/2017"
{% endhighlight %}
其中 replace 中的，第二个参数里用 $1、$2、$3 指代相应的分组。等价于如下的形式
{% highlight javascript %}
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, function () {
 return RegExp.$2 + "/" + RegExp.$3 + "/" + RegExp.$1;
});
console.log(result);
// => "06/12/2017"
{% endhighlight %}
也等价于
{% highlight javascript %}
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, function (match, year, month, day) {
 return month + "/" + day + "/" + year;
});
console.log(result);
// => "06/12/2017"
{% endhighlight %}

####反向引用

除了使用相应 API 来引用分组，也可以在正则本身里引用分组。但只能**引用之前出现的分组**，即反向引用。
比如要写一个正则支持匹配如下三种格式
```
2016-06-12
2016/06/12
2016.06.12
```

最先可能想到的正则是
{% highlight javascript %}
var regex = /\d{4}(-|\/|\.)\d{2}(-|\/|\.)\d{2}/;
{% endhighlight %}
但是这个正则会匹配"2017-06/12"这样的字符。显然不符合我们的要求，我们希望前后的分隔符要一致的，这时候可以使用反向引用。

{% highlight javascript %}
var regex = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
{% endhighlight %}
里面的 `\1`，表示的引用之前的那个分组 `(-|\/|\.)`。不管它匹配到什么（比如 -），`\1` 都匹配那个同样的具体某个字符。

后续会遇到一些疑问。

####括号嵌套怎么办

以左括号（开括号）为准。比如：
{% highlight javascript %}
var regex = /^((\d)(\d(\d)))\1\2\3\4$/;
var string = "1231231233";
console.log( regex.test(string) ); // true
console.log( RegExp.$1 ); // 123
console.log( RegExp.$2 ); // 1
console.log( RegExp.$3 ); // 23
console.log( RegExp.$4 ); // 3
{% endhighlight %}
第一个`\1`，是第一个分组，就是`((\d)(\d(\d)))`，匹配"123"。
第二个`\2`，是第二个分组，就是`(\d)`，匹配"1"。
第三个`\3`，是第三个分组，就是`(\d(\d))`，匹配"23"。
第四个`\4`，是第四个分组，就是`(\d)`，匹配"3"。

####\10 表示什么

`\10`是表示第 10 个分组，还是`\1`和 `0`呢？
答案是前者`\10`。如果真要匹配 `\1` 和 0 的话，请使用 `(?:\1)0` 或者 `\1(?:0)`。

####引用不存在的分组会怎样

如果引用了不存在的分组时，此时正则不会报错，只是匹配反向引用的字符本身。例如 `\2`，就匹配 "\2"。注意 "\2" 表示对 "2" 进行了转义。

####分组后面有量词会怎样

分组后面有量词的话，分组最终捕获到的数据是最后一次的匹配。

{% highlight javascript %}
var regex = /(\d)+/;
var string = "12345";
console.log( string.match(regex) );
// => ["12345", "5", index: 0, input: "12345"]
{% endhighlight %}
从上面看出，分组 `(\d)` 捕获的数据是 "5"。

<br>
###非捕获括号

之前文中出现的括号，都会捕获它们匹配到的数据，以便后续引用，因此也称它们是**捕获型分组**和**捕获型分支**。
如果只想要括号最原始的功能，但不会引用它，即，既不在 API 里引用，也不在正则里反向引用。此时可以使用非捕获括号 `(?:p)` 和 `(?:p1|p2|p3)`。

<br>
###回溯法原理

就是在匹配的过程中，从左往右匹配字符，如果当前的位置不能匹配，回退一个位置，用下一个匹配规则匹配。回溯就是指回退的动作。
比如量词，量词是贪婪的。在`/ab{1,3}c/`，匹配字符"abbc"的过程中，会出现回溯。
过程是，匹配"a"，然后匹配"bbb"（因为是贪婪的所以先匹配最多的），但是在第四个位置的时候遇到"c"，所以不成功， 就回溯，退回到第三位，然后使用"bb匹配，后面是"c"，成功匹配。
本质是深度优先搜索。

####贪婪量词

如果贪婪量词有多个并且挨着存在，结果是左边的优先满足。
比如
{% highlight javascript %}
var string = "12345";
var regex = /(\d{1,3})(\d{1,3})/;
console.log( string.match(regex) );
// => ["12345", "123", "45", index: 0, input: "12345"]
{% endhighlight %}

####惰性量词

如果使用了惰性量词的情况
{% highlight javascript %}
var string = "12345";
var regex = /(\d{1,3}?)(\d{1,3})/;
console.log( string.match(regex) );
// => ["1234", "1", "234", index: 0, input: "12345"]
{% endhighlight %}
其中 `\d{1,3}?` 只匹配到一个字符 "1"，而后面的 `\d{1,3}` 匹配了 "234"。

####分支结构

分支也是惰性的，比如 `/can|candy/`，去匹配字符串 "candy"，得到的结果是 "can"，因为分支会
一个一个尝试，如果前面的满足了，后面就不会再试验了。

>JavaScript 的正则引擎是 NFA，NFA 是“非确定型有限自动机”的简写。NFA 虽然匹配慢，但是编译快。

<br>
###正则表达式的拆分

####结构和操作符

JavaScript 正则表达式中，都有哪些结构呢？
字符字面量、字符组、量词、锚、分组、选择分支、反向引用。
字面量
>匹配一个具体字符，包括不用转义的和需要转义的。比如 a 匹配字符 "a"，又比如 \n 匹配换行符，又比如 \. 匹配小数点。

字符组
>匹配一个字符，可以是多种可能之一，比如 [0-9]，表示匹配一个数字。也有 \d 的简写形式。另外还有反义字符组，表示可以是除了特定字符之外任何一个字符，比如 `[^0-9]`，表示一个非数字字符，也有 `\D` 的简写形式。

量词
>表示一个字符连续出现，比如 `a{1,3}` 表示 "a" 字符连续出现 3 次。另外还有常见的简写形式，比如 a+ 表示 "a" 字符连续出现至少一次。

锚
>匹配一个位置，而不是字符。比如 ^ 匹配字符串的开头，又比如 `\b` 匹配单词边界，又比如 `(?=\d)` 表示数字前面的位置。

分组
>用括号表示一个整体，比如 `(ab)+`，表示 "ab" 两个字符连续出现多次，也可以使用非捕获分组 `(?:ab)+`。

分支
>多个子表达式多选一，比如 `abc|bcd`，表达式匹配 "abc" 或者 "bcd" 字符子串。反向引用，比如 `\2`，表示引用第 2 个分组。

操作符有：
- 转义符，优先级：1， `\` 

- 括号和方括号，优先级：2，`(…)`、`(?:…)`、`(?=…)`、`(?!…)`、`[…] `

- 量词限定符，优先级：3，`{m}`、`{m,n}`、`{m,}`、`?`、`*`、`+ `

- 位置和序列，优先级：4，`^`、`$`、`\元字符`、`一般字符 `

- 管道符（竖杠） ，优先级：5，`|`

这里，我们来分析一个正则：`/ab?(c|de*)+|fg/`

1. 由于括号的存在，所以，(c|de*) 是一个整体结构。
2. 在 (c|de*) 中，注意其中的量词 ，因此 e 是一个整体结构。
3. 又因为分支结构 | 优先级最低，因此 c 是一个整体、而 de* 是另一个整体。
4. 同理，整个正则分成了 a、b?、(…)+、f、g。而由于分支的原因，
5. 又可以分成 ab?(c|de*)+ 和 fg 这两部分。

####注意要点

1. 匹配字符串整体问题。比如要匹配目标字符串 "abc" 或者 "bcd" 时。容易错写成`/^abc|bcd$/`。正确应该是`/^(abc|bcd)$/`。
2. 量词连缀问题。假设，要匹配这样的字符串：每个字符为 "a、"b"、"c" 任选其一，并且字符串的长度是 3 的倍数。容易错写成`/^[abc]{3}+$/`，正确为`/([abc]{3})+/`。
3. 元字符转义问题。所有的元字符`^、$、.、*、+、?、|、\、/、(、)、[、]、{、}、=、!、:、- `。
3.1. 例如开头的 `^` 必须转义。
3.2. 匹配 "[abc]" 和 "{3,5}"，可以写成 `/\[abc\]/`，也可以写成 `/\[abc]/`。
4. 比如 `=、!、:、-、,` 等符号，只要不在特殊结构中，并不需要转义。号需要前后都转义的，如 `/\(123\)/`。至于剩下的 `^、$、.、*、+、?、|、\、/ `等字符，只要不在字符组内，都需要转义的。

<br>
###正则表达式编程

####正则表达式的四种操作

验证、切分、提取、替换。

####验证

比如，判断一个字符串中是否有数字。
使用`search`
{% highlight javascript %}
var regex = /\d/;
var string = "abc123";
console.log( !!string.search(regex) );
// => true
{% endhighlight %}
使用`match`
{% highlight javascript %}
var regex = /\d/;
var string = "abc123";
console.log( !!string.match(regex) );
// => true
{% endhighlight %}

使用`test`
{% highlight javascript %}
var regex = /\d/;
var string = "abc123";
console.log( regex.test(string) );
// => true
{% endhighlight %}
使用 `exec`
{% highlight javascript %}
var regex = /\d/;
var string = "abc123";
console.log( !!regex.exec(string) );
// => true
{% endhighlight %}
其中，最常用的是 `test`。

>注意：`search` 和 `match`方法，参数如果是字符串，会把字符串转换为正则。
{% highlight javascript %}
var string = "2017.06.12";
console.log(string.search("."));
// => 0
// 需要改成
console.log(string.search("\\."));
console.log(string.search(/\./));
// => 4
{% endhighlight %}

####切分

在 JavaScript 中使用的是 `split`。

{% highlight javascript %}
var regex = /,/;
var string = "html,css,javascript";
console.log( string.split(regex) );
// => ["html", "css", "javascript"]
{% endhighlight %}
####提取

使用 `match`
{% highlight javascript %}
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";
console.log( string.match(regex) );
// =>["2017-06-26", "2017", "06", "26", index: 0, input: "2017-06-26"]
{% endhighlight %}

使用 `exec`
{% highlight javascript %}
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";
console.log( regex.exec(string) );
// =>["2017-06-26", "2017", "06", "26", index: 0, input: "2017-06-26"]
{% endhighlight %}

使用`test`
{% highlight javascript %}
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";
regex.test(string);
console.log( RegExp.$1, RegExp.$2, RegExp.$3 );
// => "2017" "06" "26"
{% endhighlight %}

使用`search`
{% highlight javascript %}
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";
string.search(regex);
console.log( RegExp.$1, RegExp.$2, RegExp.$3 );
// => "2017" "06" "26"
{% endhighlight %}
使用`replace`
{% highlight javascript %}
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";
var date = [];
string.replace(regex, function (match, year, month, day) {
 date.push(year, month, day);
});
console.log(date);
// => ["2017", "06", "26"]
{% endhighlight %}

其中，最常用的是`match`。

####替换

比如把日期格式，从 yyyy-mm-dd 替换成 yyyy/mm/dd，使用`replace`进行替换。

{% highlight javascript %}
var string = "2017-06-26";
var today = new Date( string.replace(/-/g, "/") );
console.log( today );
// => Mon Jun 26 2017 00:00:00 GMT+0800 (中国标准时间)
{% endhighlight %}

<br>
###相关API的使用要点

用于正则操作的方法，共有 6 个，字符串实例 4 个，正则实例 2 个
- String#search
- String#split
- String#match
- String#replace
- RegExp#test
- RegExp#exec

####match 返回结果的格式问题

`match`返回结果的格式，与正则对象是否有修饰符 `g`有关。

{% highlight javascript %}
var string = "2017.06.27";
var regex1 = /\b(\d+)\b/;
var regex2 = /\b(\d+)\b/g;
console.log( string.match(regex1) );
console.log( string.match(regex2) );
// => ["2017", "2017", index: 0, input: "2017.06.27"]
// => ["2017", "06", "27"]
{% endhighlight %}
没有 `g`，返回的是标准匹配格式，即，数组的第一个元素是整体匹配的内容，接下来是分组捕获的内容，然
后是整体匹配的第一个下标，最后是输入的目标字符串。
有 `g`，返回的是所有匹配的内容。
当没有匹配时，不管有无 `g`，都返回 `null`。

####exec 比 match 更强大

当正则没有 `g` 时，使用 `match` 返回的信息比多。但是有 `g` 后，就没有关键的信息 `index` 了。
而 `exec` 方法就能解决这个问题，它能接着上一次匹配后继续匹配。
{% highlight javascript %}
var string = "2017.06.27";
var regex2 = /\b(\d+)\b/g;
console.log( regex2.exec(string) );
console.log( regex2.lastIndex);
console.log( regex2.exec(string) );
console.log( regex2.lastIndex);
console.log( regex2.exec(string) );
console.log( regex2.lastIndex);
console.log( regex2.exec(string) );
console.log( regex2.lastIndex);
// => ["2017", "2017", index: 0, input: "2017.06.27"]
// => 4
// => ["06", "06", index: 5, input: "2017.06.27"]
// => 7
// => ["27", "27", index: 8, input: "2017.06.27"]
// => 10
// => null
// => 0
{% endhighlight %}
其中正则实例 `lastIndex` 属性，表示下一次匹配开始的位置。在使用 exec 时，经常需要配合使用 while 循环。

####修饰符 g，对 exex 和 test 的影响

尝试匹配时，从字符串的 `lastIndex` 位开始去匹配。字符串的四个方法，每次匹配时，都是从 0 开始的，即 `lastIndex` 属性始终不变。而正则实例的两个方法 `exec`、`test`，当正则是全局匹配时，每一次匹配完成后，都会修改 `lastIndex`。

{% highlight javascript %}
var regex = /a/g;
console.log( regex.test("a"), regex.lastIndex );
console.log( regex.test("aba"), regex.lastIndex );
console.log( regex.test("ababc"), regex.lastIndex );
// => true 1
// => true 3
// => false 0
{% endhighlight %}

如果没有 `g`，自然都是从字符串第 0 个字符处开始尝试匹配

####test 整体匹配时需要使用 ^ 和 $

因为 test 是看目标字符串中是否有子串匹配正则，即有部分匹配即可。如果要整体匹配，正则前后需要添加开头和结尾。

####split 相关注意事项

有两个注意点。
第一，它可以有第二个参数，表示结果数组的最大长度。
{% highlight javascript %}
var string = "html,css,javascript";
console.log( string.split(/,/, 2) );
// =>["html", "css"]
{% endhighlight %}
第二，正则使用分组时，结果数组中是包含分隔符的：
{% highlight javascript %}
var string = "html,css,javascript";
console.log( string.split(/(,)/) );
// =>["html", ",", "css", ",", "javascript"]
{% endhighlight %}

####replace 是很强大的

`replace` 有两种使用形式，这是因为它的第二个参数，可以是字符串，也可以是函数。
当第二个参数是字符串时，如下的字符有特殊的含义：
- \$1,\$2,…,$99，匹配第 1-99 个 分组里捕获的文本。
- $&，匹配到的子串文本
- $` ，匹配到的子串的左边文本
- $'，匹配到的子串的右边文本
- \$\$，美元符号

####使用构造函数需要注意的问题

一般不推荐使用构造函数生成正则，而应该优先使用字面量。因为用构造函数会多写很多 `\`。
{% highlight javascript %}
var string = "2017-06-27 2017.06.27 2017/06/27";
var regex = /\d{4}(-|\.|\/)\d{2}\1\d{2}/g;
console.log( string.match(regex) );
// => ["2017-06-27", "2017.06.27", "2017/06/27"]
regex = new RegExp("\\d{4}(-|\\.|\\/)\\d{2}\\1\\d{2}", "g");
console.log( string.match(regex) );
// => ["2017-06-27", "2017.06.27", "2017/06/27"]
{% endhighlight %}

####修饰符

ES5 中修饰符，共 3 个

- `g` 全局匹配，即找到所有匹配的，单词是 global。
- `i` 忽略字母大小写，单词是 ingoreCase。
- `m` 多行匹配，只影响 `^` 和 `$`，二者变成行的概念，即行开头和行结尾。单词是 multiline。

对应正则对象的只读属性（如果存在这个修饰符就为true反之false）
{% highlight javascript %}
var regex = /\w/img;
console.log( regex.global );
console.log( regex.ignoreCase );
console.log( regex.multiline );
// => true
// => true
// => true
{% endhighlight %}

####source 属性

正则实例对象属性，除了 `global`、`ingnoreCase`、`multiline`、`lastIndex` 属性之外，还有一个 `source`属性。

####其他构造函数属性

有兼容性问题
- `RegExp.input`，最近一次目标字符串，简写：`RegExp["$_"]`
- `RegExp.lastMatch`，最近一次匹配的文本，简写：`RegExp["$&"]`
- `RegExp.lastParen`，最近一次捕获的文本，简写：`RegExp["$+"]`
- `RegExp.leftContext`，目标字符串中`lastMatch`之前的文本，简写：RegExp["$`"]
- `RegExp.rightContext`，目标字符串中`lastMatch`之后的文本，简写：`RegExp["$'"]`

信息来源：
<br>
[《javascript正则表达式迷你书》](https://zhuanlan.zhihu.com/p/29707385)
