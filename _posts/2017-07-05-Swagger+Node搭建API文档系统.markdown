---
 layout: post
 title:  "Swagger+Node搭建API文档系统"
 date:   2017-07-05
 categories: 编程相关
 tags: [node, 工具]
---
在公司做了个小型的web项目，使用node做后端。提供API渐渐增加，希望有一个API的文档方便查阅，于是找到了swagger。用swaager为原来的node项目搭建API文档系统。

<!-- more -->

<br>
###环境搭建

1、下载Swagger UI

```
git clone https://github.com/swagger-api/swagger-ui.git
```

2、安装express

```
npm install experss --save
```

因为我的项目本身就使用express就不用额外安装了。

3、创建一个文件夹swagger

把之前下载`swagger ui`项目里面的`dist`文件复制到文件夹`swagger`中。

4、修改`app.js`

在express的入口文件`app.js`增加如下代码。这是配置exprees的静态资源文件的访问路径，设置后通过`/swagger`可以访问swagger文件夹的资源。

```
app.use('/swagger', express.static('swagger'));
```

5、重启node服务器

重启后，访问`http://localhost:3000/swagger/index.html`，这时已经可以看到swagger的api文档了。只是这里的api是demo里面的文档。之后我们要生成我们代码的API文档。

<br>
###生成API文档
在此之前，我们已经使用swagger搭建了一个API文档。 在页面上可以看到，swagger是通过对`swagger.json`文件的解释来读取API的内容的，那么我们现在就需要生成描述我们API的`swagger.json`文件。如何生成这个json文件，理所当然是可以自己手动来编写的。但是明显费时费力，前辈早有解决方法。这里要使用工具`swagger-jsdoc`。

1、安装`swagger-jsdoc`

```
npm install swagger-jsdoc@1.3.0 --save
```
2、在`app.js`引入`swagger-jsdoc`，并且配置

```
var swaggerJSDoc = require('swagger-jsdoc');
```

这里把demo里面的配置做个说明

{% highlight javascript %}
// swagger 配置
var swaggerDefinition = {
    // 页面上的信息
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    // host
    host: 'localhost:3000',
    // swagger项目的跟路径
    basePath: '/',
};

// swagger 文档配置
var options = {
  // 引用 swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // 需要解释的 API 路径（路由路径）
  apis: ['./routes/*.js'],
};

// 初始化 swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);
{% endhighlight %}

3、增加`swagger.json`的路由

`swagger-jsdoc`生成的json，需要一个访问的路径，因此配置一个路由

{% highlight javascript %}
// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
{% endhighlight %}

这时访问`http://localhost:3000/swagger.json`，已经可以看到json文件有内容了，但是api的解释还是空的，之后我们需要在路由上做修改了。

```
{
  info: {
    title: "Node Swagger API",
    version: "1.0.0",
    description: "Demonstrating how to describe a RESTful API with Swagger"
  },
  host: "localhost:3000",
  basePath: "/",
  swagger: "2.0",
  paths: { },
  definitions: { },
  responses: { },
  parameters: { },
  securityDefinitions: { }
}
```

4、修改路由

在每个路由前增加注释，按照语法写注释，里面写上这个API的描述，包括请求方式、分组、描述、数据格式、返回信息等等。详细的语法和字段意思这里不多说了，把官方的例子放出来做个参考。

{% highlight javascript %}
/**
 * @swagger
 * /api/puppies:
 *   get:
 *     tags:
 *       - Puppies
 *     description: Returns all puppies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of puppies
 *         schema:
 *           $ref: '#/definitions/Puppy'
 */
router.get('/api/puppies', db.getAllPuppies);


GET Single
/**
 * @swagger
 * /api/puppies/{id}:
 *   get:
 *     tags:
 *       - Puppies
 *     description: Returns a single puppy
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Puppy's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single puppy
 *         schema:
 *           $ref: '#/definitions/Puppy'
 */

POST
/**
 * @swagger
 * /api/puppies:
 *   post:
 *     tags:
 *       - Puppies
 *     description: Creates a new puppy
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: puppy
 *         description: Puppy object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Puppy'
 *     responses:
 *       200:
 *         description: Successfully created
 */

PUT
/**
 * @swagger
 * /api/puppies/{id}:
 *   put:
 *     tags: Puppies
 *     description: Updates a single puppy
 *     produces: application/json
 *     parameters:
 *       name: puppy
 *       in: body
 *       description: Fields for the Puppy resource
 *       schema:
 *         type: array
 *         $ref: '#/definitions/Puppy'
 *     responses:
 *       200:
 *         description: Successfully updated
 */

DELETE
/**
 * @swagger
 * /api/puppies/{id}:
 *   delete:
 *     tags:
 *       - Puppies
 *     description: Deletes a single puppy
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Puppy's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
{% endhighlight %}

5、重启服务器

再次访问，高大上的API文档已经可以使用了！

<br>
###信息来源：
[https://github.com/mjhea0/node-swagger-api](https://github.com/mjhea0/node-swagger-api "信息来源")
<br>
[http://mherman.org/blog/2016/05/26/swagger-and-nodejs/#.WVDgOut96M9](http://mherman.org/blog/2016/05/26/swagger-and-nodejs/#.WVDgOut96M9 "信息来源")
<br>
[http://www.jianshu.com/p/d6626e6bd72c](http://www.jianshu.com/p/d6626e6bd72c "信息来源")
