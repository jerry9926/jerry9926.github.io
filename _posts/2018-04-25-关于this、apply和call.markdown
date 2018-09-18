---
 layout: post
 title:  "关于this、apply和call"
 date:   2018-04-25 14:25:24
 categories: web前端
 tags: [Javascript]
---

js里面的this总是容易出错的地方。来理解一下this、apply和call。

<!-- more -->

<br>
### this

this总是指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而非函数被声明时的环境。

取出不常用的`with`和`eval`的情况，this的指向大致分为4种。

1. 作为对象的方法调用
  - 这时this指向该对象
2. 作为普通的函数调用
  - 当函数不作为对象的属性被调用时，this指向全局对象，浏览器环境下为`window`
3. 构造器调用
  - 构造器跟普通函数一模一样，区别在于被调用的方式。当用`new`运算符调用函数创建对象时，这个函数就是构造器
  - 通常情况下，构造器里的this指向这个对象
  - 特殊情况，如果构造器显式地返回了一个`object`类型的对象，那么运算结果最终会返回这个对象，而不是this。如果构造器不显式地返回任何数据或者返回的是一个非对象类型的数据，就不会有这个问题。
4. `Function.prototype.call`或者`Function.prototype.apply`调用
  - 跟普通函数相比，用`Function.prototype.call`或`Function.prototype.apply`可以动态地改变传入函数的this


意外的this情况
情况一

{% highlight javascript %}
var obj = {
    myName: 'sven',
    getName: function(){
        return this.myName;
    }
};
console.log( obj.getName() ); // 输出：'sven'
var getName2 = obj.getName;
console.log( getName2() ); // 输出：undefined
{% endhighlight %}

第一条打印。符合this指向第一类，作为对象的方法调用。所以输出符合预期。
第二条打印。因为用一个变量来引用`obj.getName`，这是调用，属于作为普通函数调用，this指向`window`。所以输出`undefined`

情况二
我们可能觉得`document.getElementById`这个方法名过长，而希望用一个短的函数替代它。如果我们这样做

{% highlight javascript %}
var getId = document.getElementById;
getId('div1'); // 这时会报错
{% endhighlight %}

这会报错，因为在`document.getElementById`函数内部需要使用this，而本来this指向`document`。现在我们引用了之后，是作为普通函数使用，this指向了`window`。所以会报错。不会改变this指向的方式
第一种方式

{% highlight javascript %}
var getId = function(id) {
    return document.getElementById(id);
}
{% endhighlight %}
这样实际上还是作为`document`对象的方法调用，符合作为对象的方法调用this指向`document`。

第二种方式

{% highlight javascript %}
document.getElementById = (function(func) {
    return function() {
        return func.apply(document, arguments);
    }
})(document.getElementById)
var getId = document.getElementById;
{% endhighlight %}
这里使用了apply强制this指向`document`，避免this丢失。

<br>
### apply和call

两者作用一样，区别在于传入的参数不同。
**apply接受两个参数，第一个参数指定了函数体内this对象的指向，第二个参数为一个带下标的集合**，这个集合可以是数组或者类数组，apply把第二个参数作为参数传递给被调用的函数。

**call传入的参数数量不固定，跟apply相同的是，第一个参数也是指定函数体内this的指向，从第二个参数开始，每个参数依次传入函数。**call是包装在apply上面的语法糖，如果明确知道函数接受多少个参数，而且想明确表示需要的参数，可以使用call。

使用apply和call的时候，如果传第一个参数为`null`，this会指向默认宿主对象，浏览器中为`window`。在严格模式下，传`null`，this就为`null`。

用途一：改变this指向。
{% highlight javascript %}
var obj1 = {
    name: 'sven'
}
var obj2 = {
    name: 'anne'
}
window.name = 'window';
var getName = function() {
    alert(this.name);
}
getName();
getName.call(obj1);
getName.call(obj2);
{% endhighlight %}

用途二：`Function.prototype.bind`

用途三：借用其他对象的方法。
场景一，借用构造函数，实现类似继承的效果。
{% highlight javascript %}
var A = function(name) {
    this.name = name;
}
var B = function(name) {
    A.apply(this, arguments);
}
B.protoptype.getName = function() {
    return this.name;
}
var b = new B('sven');
console.log(b.getName());
{% endhighlight %}

场景二，函数参数列表`arguments`不是数组，但是希望使用数组的方法。
{% highlight javascript %}
(function() {
    [].push.call(arguments, 3);
    console.log(arguments); // 输出[1,2,3]
})(1, 2)
{% endhighlight %}

参考：[《JavaScript设计模式与开发实践.曾探》](https://book.douban.com/subject/26382780/)
