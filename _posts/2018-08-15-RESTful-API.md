---
layout: post
title: REST简介
categories: [code]
tags: HTML
---

> 生活总在平淡中显现出波澜

## 什么是REST

REST这个词，是Roy Thomas Fielding在他2000年的博士论文中提出的。Fielding将他对互联网软件的架构原则，定名为REST，即Representational State Transfer的缩写。
我对这个词组的翻译是"表现层状态转化"。如果一个架构符合REST原则，就称它为RESTful架构，REST只是一种风格，不是一种标准。
要理解RESTful架构，最好的方法就是去理解Representational State Transfer这个词组到底是什么意思。

### 资源（Resources）

REST的名称"表现层状态转化"中，省略了主语。"表现层"其实指的是"资源"（Resources）的"表现层"。
REST是以资源为中心的,在REST中，认为Web是由一系列的抽象资源（Abstract Resource）组成，这些抽象的资源具有不同的具体表现形式。

### 表现层（Representation）

表现层其实指的是资源的某种表现形式。譬如，定义一个资源为photo表现形式可以用用JSON，XML，JPEG等

### 状态转化（State Transfer）

Rest是无状态的（Stateless），通信的会话状态（Session State）应该全部由客户端负责维护。访问一个网站，就代表了客户端和服务器的一个互动过程。在这个过程中，势必涉及到数据和状态的变化,这种转化是建立在表现层之上的,状态变化,通过HTTP动词实现。

### 总结

REST是所有Web应用都应该遵守的架构设计指导原则。 Representational State Transfer，翻译是”表现层状态转化”。 面向资源是REST最明显的特征，对于同一个资源的一组不同的操作。资源是服务器上一个可命名的抽象概念，资源是以名词为核心来组织的，首先关注的是名词。REST要求，必须通过统一的接口来对资源执行各种操作。对于每个资源只能执行一组有限的操作。（7个HTTP方法：GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS）

## REST设计原则

### 协议

API与用户的通信协议，总是使用HTTPs协议。

### 域名

- 应该尽量将API部署在专用域名之下。

`https://api.example.com`

- 如果确定API很简单，不会有进一步扩展，可以考虑放在主域名下。

`https://example.org/api/`


### 版本（Versioning）

- 应该将API的版本号放入URL。

`https://api.example.com/v1/`

- 另一种做法是，将版本号放在HTTP头信息中，但不如放入URL方便和直观。Github采用这种做法。


### 路径（Endpoint）

路径又称"终点"（endpoint），表示API的具体网址。
在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的"集合"（collection），所以API中的名词也应该使用复数。
举例来说，有一个API提供动物园（zoo）的信息
https://api.example.com/v1/zoos

### HTTP动词

对于资源的具体操作类型，由HTTP动词表示。
常用的HTTP动词有下面五个（括号里是对应的SQL命令）。

- GET（SELECT）：从服务器取出资源（一项或多项）。
- POST（CREATE）：在服务器新建一个资源。
- PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
- PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
- DELETE（DELETE）：从服务器删除资源。

还有两个不常用的HTTP动词。

- HEAD：获取资源的元数据。
- OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。

下面是一些例子。

```
GET /zoos：列出所有动物园
POST /zoos：新建一个动物园
GET /zoos/ID：获取某个指定动物园的信息
PUT /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
PATCH /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
DELETE /zoos/ID：删除某个动物园
GET /zoos/ID/animals：列出某个指定动物园的所有动物
DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物
```

### 过滤信息（Filtering）

下面是一些常见的参数。

```
?limit=10：指定返回记录的数量
?offset=10：指定返回记录的开始位置。
?page=2&per_page=100：指定第几页，以及每页的记录数。
?sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。
?animal_type_id=1：指定筛选条件
参数的设计允许存在冗余，即允许API路径和URL参数偶尔有重复。比如，GET /zoo/ID/animals 与 GET /animals?zoo_id=ID 的含义是相同的。
```

### 状态码（Status Codes）

服务器向用户返回的状态码和提示信息，常见的有以下一些（方括号中是该状态码对应的HTTP动词）。

- 200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
- 201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
- 202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
- 204 NO CONTENT - [DELETE]：用户删除数据成功。
- 400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
- 401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
- 403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
- 404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
- 406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
- 410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
- 422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
- 500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。

### 错误处理（Error handling）

如果状态码是4xx，就应该向用户返回出错信息。一般来说，返回的信息中将error作为键名，出错信息作为键值即可。

```
{
    error: "Invalid API key"
}
```

### 返回结果

针对不同操作，服务器向用户返回的结果应该符合以下规范。

- GET /collection：返回资源对象的列表（数组）
- GET /collection/resource：返回单个资源对象
- POST /collection：返回新生成的资源对象
- PUT /collection/resource：返回完整的资源对象
- PATCH /collection/resource：返回完整的资源对象
- DELETE /collection/resource：返回一个空文档

## RESTful API

符合REST设计标准的API，即RESTful API。REST架构设计，遵循的各项标准和准则，就是HTTP协议的表现，换句话说，HTTP协议就是属于REST架构的设计模式。比如，无状态，请求-响应。。。

## Java创建RESTful API

JAX-RS 是将在Java EE 6中引入的一种新技术。JAX-RS即Java API fr
RESTful WebServices, 是一 个Java编程语言的应用程序接口，支持按照表述性状态转移(REST)架构凤格创建Web服务。JA—RS使用了Java SE 5引入的Java
标注未简化Web服务的客户端和服务瑞的开发和部署。 包括：

- @Path, 标注资原类或者方法的相对路径 。
- @GET、 @PUT、 @POST、 @DELETE, 标注方法是HTTP请求的类型。
- @Produces, 标注返回的MIME媒体类型。
- @Consun1es, 标注可接受请求的MIME媒体类型。
- @PathParam、 @QueryParar 、 @HeaderParam 、 @CookieParam 、 @MatrixParam 、@FormParam, 标注方法的参数未自HTTP请求的不同位置，例如，@PathParam
来自URL 的路径， @QueryParam来自URL的查询参数， @HeaderParam未自HTTP请求的头信息， @CookieParam未自HTTP请求的Cookie。

