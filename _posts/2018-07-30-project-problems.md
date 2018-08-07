---
layout: post
title: 项目中遇到的问题及解决方案
categories: [工作]
tags: 总结
---

> 即使没有风，我也要扬帆起航

## 跨域

### 什么是跨域？

浏览器从一个域名的网页去请求另一个域名的资源时，域名、端口、协议任一不同，都是跨域
以下几种情况会出现跨域的问题
- 域名：

主域名不同 http://www.baidu.com/index.html –>http://www.sina.com/test.js 

子域名不同 http://www.666.baidu.com/index.html –>http://www.555.baidu.com/test.js 

域名和域名ip http://www.baidu.com/index.html –>http://180.149.132.47/test.js

- 端口： 

http://www.baidu.com:8080/index.html–> http://www.baidu.com:8081/test.js 

- 协议：

http://www.baidu.com:8080/index.html–> https://www.baidu.com:8080/test.js

- 备注：

1、端口和协议的不同，只能通过后台来解决 
2、localhost和127.0.0.1虽然都指向本机，但也属于跨域

### 跨域解决方案

网上提供了很多关于跨域的解决方案，主要包括两大类。一是在前端解决，二是在后台解决。

#### 通过Jsonp跨域
通常为了减轻Web服务器的负载，我们把Js、Css、img等静态资源分离 到另一台独立域名的服务器上，在html页面中在通过相应的标签从不同 的域名下加载静态资源，而被浏览器运行，基于此原理，我们可以通过 动态创建script标签，再请求一个带参网址实现跨域通信，是目前比较 常见的跨域方式。 缺点：只能实现get一种请求。
#### document.domain+iframe跨域
此方案仅限主域相同，子域不同的跨域应用场景。 实现原理： 两个页面都通过Js强制设置document.domain为基础主域， 就实现了同域。
#### location.hash+iframe跨域
实现原理：A欲与B跨域相互通讯，通过中间页C来实现。三个页面，不 同域名之间利用iframe的location.hash传值,相同域名之间直接Js访问来通信。 具体实现：A域：a.html——>B域：b.html——>A域：c.htmla与b不同域只能通过hash值单向通信，但c与a同域，所以c可通过parent.parent访问a页面所有对象。
#### window.name+iframe跨域
window.name属性的独特之处： name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以 支持非常长的name值（2MB） 总结： 通过iframe的src属性由外域转向本地域，跨域数据即由iframe的window.name从外域传递到本地域。这个就巧妙地绕过了浏览器的 跨域访问限制，但同时它又是安全操作。
#### postMessage跨域
postMessage是HTML5 XMLHttpRequest Level 2中的Api， 且是为数不多可以跨域操作的window属性之一，它可用与解决以下 方面的问题：

- 页面和其打开的新窗口的数据传递
- 多窗口之间消息传递
- 页面之嵌套的iframe消息传递

上面三个场景的跨域数据传递 用法： postMessage（data，origin）方法接收两个参数 data：html5规范支持任意基本类型或可复制的对象，但部分浏览器 支持字符串，所以传参时最好用JSON.stringfiy()序列化。 origin：协议+主机+端口号，也可以设置为"*",表示可以传递给任意 窗口，如果要制定和当前窗口同源的话设置为"/"。

#### 跨域资源共享（CORS）

普通跨域请求： 只服务端设置Access-Control-Allow-Origin即可，前端无需设置， 若要带cookie请求，前后端都需要设置。 需注意的是： 由于同源策略的限制，所读取的cookie为跨域请求接口所在域的cookie， 而非当前页。如果想实现当前页cookie的写入，可参考下文 
nginx反向代理中设置proxy_cookiedomain和 Nodejs中间件代理中cookieDo mainRewrite参数的设置。 
目前，所有浏览器都支持该功能（IE8+：IE8/9需要使用XDomainRequest 对象来支持CORS），CORS也已经成为主流的跨域解决方案。

#### nginx代理跨域
 nginx配置解决iconfont跨域： 浏览器跨域范文Js、Css、Img等常规静态资源被同源策略许可，单iconfont 字体文件（eot/otf/ttf/woff/svg）例外，此时可在nginx的静态资源服务 器中加入配置。
#### Nodejs中间件代理跨域
node中间件实现跨域代理，原理大致与nginx相同，都是通过一个代理服务器 ，实现数据的转发，也可以通过设置cookieDomainRewrite参数修改响应头中 cookie中域名，实现当前域的cookie写入，方便接口登陆认证。
#### WebSocket协议跨域
WebSocket protocol是HTML5一种新的协议。它实现了浏览器与服务器全双 工通信，同时允许跨域通讯，是server push技术的一种很好的实现。 原生WebSocket Api使用起来不太方便，我们使用Socket.io,她很好地封装 了WebSocket接口，提供了更简单、灵活的接口，也对不支持webSocket的浏 览器提供了向下兼容。

### 项目遇到的问题及解决方案
上面介绍的几种是常见的跨域问题解决方案，基本能够解决多数跨域问题。
项目中使用的前后端分离的开发模式，后台使用的的spring boot微服务架构，前台使用的是Ant Design pro框架。在本地开发的时候，由于antd pro框架的原因，并没有出现跨域的问题。这是因为ant pro在启动项目时会加载一个mock服务，该服务可以自动解决跨域的问题。所以我们在本地开发调试的时候都没有遇到跨域的问题。现在要部署到线上，问题就来了。由于生产环境中antd pro打包并不会打包mock服务，所以在线上就出现了跨域的问题。
antd pro打包后部署在tomcat中，端口号为8088，后台接口部署在docker容器中，api访问接口映射到80端口。访问域名相同，端口不同，跨域的问题就来了。首先百度了一下，在tomcat的web.xml配置可以解决这个问题，试过之后并不能解决。既然现在在前端不好解决这个问题，只能在后台进行跨域处理了。
后台微服务全都部署在docker容器中，所有请求访问都会经过网关转发。所以我们需要在网关中对跨域的问题进行处理。由于gateway无法拿到源码，所以使用以下方向得到jar包
```
docker ps -a
docker inspect
  "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay/ff1331e6994b1a3b35c9e2db9f414803a22a4c172227beac7d44965fd1b0e15e/root",
                "MergedDir": "/var/lib/docker/overlay/8ba22638ea6d4517dc560ce120048774b9a8d428b4ffc9ad0a683aeac77899fd/merged",
                "UpperDir": "/var/lib/docker/overlay/8ba22638ea6d4517dc560ce120048774b9a8d428b4ffc9ad0a683aeac77899fd/upper",
                "WorkDir": "/var/lib/docker/overlay/8ba22638ea6d4517dc560ce120048774b9a8d428b4ffc9ad0a683aeac77899fd/work"
            },
            "Name": "overlay"
        },
cd /var/lib/docker/overlay/8ba22638ea6d4517dc560ce120048774b9a8d428b4ffc9ad0a683aeac77899fd/merged
ls
sz xxx.jar //下载jar包
```
拿到jar包后，就可以对jar包进行反编译了。这里重点说明一下，目前网上的反编译软件都不太好用。强烈推荐idea intellij自带的反编译。
跨域的解决方案为***跨域资源共享（CORS）*
我们在gateway的启动类中，添加如下代码：
```
@Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        //config.addAllowedHeader("Origin");
        //config.addAllowedHeader("X-Requested-With");
        //config.addAllowedHeader("Content-Type");
        //config.addAllowedHeader("Accept");
        config.addAllowedHeader("*");
        config.setMaxAge(3600L);
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
```
打包上传后，成功解决跨域问题。

## maven打包

maven项目打包，有时会遇到项目中一些文件没有被打包进去，如*.properties等我们需要在build里面按照如下设置
```
 <resources>
            <!-- 编译之后包含xml和properties -->
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*</include>
                </includes>
                <filtering>true</filtering>
            </resource>
            <!-- 编译之后包含xml和properties -->
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*</include>
                </includes>
                <filtering>true</filtering>
            </resource>
  </resources>
```
## 代码复写

由于项目中使用的框架都是架构组重新封装的，由于种种原因，我们无法得到源码，同时一些项目的具体需求，我们需要对jar包的内容进行部分改造，这时候，可以选择对jar包进行复写

方法就是在项目，写同样的路径和文件名，然后对文件进行重新编写。项目启动时，会优先加载项目中的文件，从而实现对jar包内容的复写。

**注意：jar包中并不是所有的内容都能够并复写，目前实测发现，properties文件可以复写，dao层的数据库文件xml并不能复写，项目会因为xml重复而报错。**

## SQL语句中特殊字符的处理

使用mybatis写sql语句，有时候前台传入参数包含一些特殊字符或者数据保留关键字时，会导致sql语句语法错误。这个问题是我在处理spring boot多数据源时遇到的。由于项目需要，需要同时支持Oracle、SQL Server、Mysql三套不同的数据库。下面将不同数据库处理特殊字符的方法记录下来，供以后参考。

- Oracle **使用分号""**  TRUNCATE table "${owner}".""${tableName}
- SQL Server **使用中括号[]** drop table .[${owner}].[${tableName}]
- Mysql **使用``**  drop table `${owner}`.`${tableName}` cascade     ``


## SQL语句分页查询

不同数据库有着不同的分页方法
