---
layout: post
title: jdk8-10新特性学习简介
categories: [java]
tags: code
---

> good good study, day day up~

---

## java8新特性

### lambda表达式

Lambda 表达式，也可称为闭包，它是推动 Java 8 发布的最重要新特性。Lambda 允许把函数作为一个方法的参数（函数作为参数传递进方法中）。使用 Lambda 表达式可以使代码变的更加简洁紧凑。

### 方法引用

方法引用通过方法的名字来指向一个方法。方法引用可以使语言的构造更紧凑简洁，减少冗余代码。方法引用使用一对冒号 :: 。

### 函数式接口

函数式接口(Functional Interface)就是一个有且仅有一个抽象方法，但是可以有多个非抽象方法的接口。函数式接口可以被隐式转换为lambda表达式。函数式接口可以现有的函数友好地支持 lambda。

### 默认方法

Java 8 新增了接口的默认方法。简单说，默认方法就是接口可以有实现方法，而且不需要实现类去实现其方法。我们只需在方法名前面加个default关键字即可实现默认方法。

### Stream

Java 8 API添加了一个新的抽象称为流Stream，可以让你以一种声明的方式处理数据。Stream 使用一种类似用 SQL 语句从数据库查询数据的直观方式来提供一种对 Java 集合运算和表达的高阶抽象。Stream API可以极大提高Java程序员的生产力，让程序员写出高效率、干净、简洁的代码。这种风格将要处理的元素集合看作一种流， 流在管道中传输， 并且可以在管道的节点上进行处理， 比如筛选， 排序，聚合等。元素流在管道中经过中间操作（intermediate operation）的处理，最后由最终操作(terminal operation)得到前面处理的结果。

### Optional 类

Optional 类是一个可以为null的容器对象。如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。Optional 是个容器：它可以保存类型T的值，或者仅仅保存null。Optional提供很多有用的方法，这样我们就不用显式进行空值检测。Optional 类的引入很好的解决空指针异常。

### Nashorn, JavaScript 引擎

Nashorn 一个 javascript 引擎。从JDK 1.8开始，Nashorn取代Rhino(JDK 1.6, JDK1.7)成为Java的嵌入式JavaScript引擎。Nashorn完全支持ECMAScript 5.1规范以及一些扩展。它使用基于JSR 292的新语言特性，其中包含在JDK 7中引入的 invokedynamic，将JavaScript编译成Java字节码。与先前的Rhino实现相比，这带来了2到10倍的性能提升。

### 新的日期时间 API

Java 8通过发布新的Date-Time API (JSR 310)来进一步加强对日期与时间的处理。在旧版的 Java 中，日期时间 API 存在诸多问题，其中有：非线程安全 − java.util.Date 是非线程安全的，所有的日期类都是可变的，这是Java日期类最大的问题之一。设计很差 − Java的日期/时间类的定义并不一致，在java.util和java.sql的包中都有日期类，此外用于格式化和解析的类在java.text包中定义。java.util.Date同时包含日期和时间，而java.sql.Date仅包含日期，将其纳入java.sql包并不合理。另外这两个类都有相同的名字，这本身就是一个非常糟糕的设计。时区处理麻烦 − 日期类并不提供国际化，没有时区支持，因此Java引入了java.util.Calendar和java.util.TimeZone类，但他们同样存在上述所有的问题。Java 8 在 java.time 包下提供了很多新的 API。以下为两个比较重要的 API：

- Local(本地) − 简化了日期时间的处理，没有时区的问题。

- Zoned(时区) − 通过制定的时区处理日期时间。

- 新的java.time包涵盖了所有处理日期，时间，日期/时间，时区，时刻（instants），过程（during）与时钟（clock）的操作。

### Base64

在Java 8中，Base64编码已经成为Java类库的标准。Java 8 内置了 Base64 编码的编码器和解码器。Base64工具类提供了一套静态方法获取下面三种BASE64编解码器：基本：输出被映射到一组字符A-Za-z0-9+/，编码不添加任何行标，输出的解码仅支持A-Za-z0-9+/。URL：输出映射到一组字符A-Za-z0-9+_，输出是URL和文件MIME：输出隐射到MIME友好格式。输出每行不超过76字符，并且使用'\r'并跟随'\n'作为分割。编码输出最后没有行分割。

## java9新特性

### jshell

使用指南:

http://docs.oracle.com/javase/9/jshell/toc.htm

### 私有接口方法

现在接口真是越来越像强大了，先是可以编写方法，现在连访问权限都可以定义成private的了，我在网上copy了一个例子:

```java
public interface MyInterface {

  void normalInterfaceMethod();

  default void interfaceMethodWithDefault() { init(); }

  default void anotherDefaultMethod() { init(); }

  // This method is not part of the public API exposed by MyInterface
  private void init() { System.out.println("Initializing"); }
}
```
大体就是实现接口的类不想把复用代码创建为一个默认方法，所以通过一个私有的辅助方法解决这个问题。

### 更改了 HTTP 调用的相关api

```java
HttpClient client = HttpClient.newHttpClient();

HttpRequest req =
  HttpRequest.newBuilder(URI.create("http://www.google.com"))
       .header("User-Agent","Java")
       .GET()
       .build();


HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandler.asString());
```
### 集合工厂方法

初始化集合类的时候不用使用add()方法去添加元素了，直接调用Set.of(...)即可完成初始化。

### 改进了 Stream API

以上就是java8、9的一些新特性，如有错误还请指正。

参考文章:

http://www.importnew.com/17262.html

http://liugang594.iteye.com/blog/2063432

## java10新特性

这次的 JDK 10 只是一个小版本更新，不过还是引入了一些非常重要的改变，我就挑几个对一般开发者影响重大的特性说说吧。

### JEP 286: 局部变量类型推断
Java 10 引入了局部变量类型推断，现在我们可以使用 var 替换局部变量声明时的类型部分，从而避免耗费精力去写出那些显而易见的类型。 var 可以用于局部变量声明、增强型 for 循环的循环变量声明、twr 内资源变量声明，在 Java 11 中还将支持用 var 替代 lambda 参数类型（JEP 323）。下面这个例子展示了 var 的用法：

```java
var l = List.of("Java", "Scala", "Kotlin");
var stream = l.stream();
var count = 0
for (var len : stream.mapToInt(String::length).toArray()) {
  count += len;
}
```

为了兼容原有代码，var 不是一个关键字，而是一个保留类型，这意味着你还是能像这样 var 当做一个变量名：

```java
void f() {
  int var = 10;
}
```

var 还有一个特殊的特性：在用匿名内部类初始化 var 声明的变量时，这个变量会被推断成一个局部的类型，所以你可以这样：

```java
final var o = new Object() {
  public void f() {
    System.out.println("Hello world!");
  }
};
o.f();
```

注意我们用 final var 声明了不可变变量 o，不过其实就算不用 final var 声明，你也不能把 o 赋值为它的初始值和 null 以外的任何值。

### JEP 307: Parallel Full GC for G1

G1 垃圾回收器是 JDK 9 中 Hotspot 的默认垃圾回收器，而 JDK 10 中将 G1 完全并行化，从而减少了 full gc 的发生。

### JEP 313: 删除 javah 工具

因为在 JDK 1.8 中 javac 引入了 -h 选项生成 JNI 头文件，javah 的工具的功能基本上被替代，所以在 JDK 9 弃用 javah 工具后，JDK 10 彻底移除了 javah 工具。这对于非 Java 的 JVM 语言以及一些特殊工具（譬如 SBT javah 插件）可能会产生一些影响。

### JEP 296: 合并 JDK 源码树合并到单个存储库中

OpenJDK 10 的源码结构相对于 OpenJDK 9 来说发生了巨大的变化。现在 OpenJDK 的结构变的更加简单清晰，我们可以用 tree 命令比较一下 OpenJDK 9 和 OpenJDK 10 的源代码结构

---
