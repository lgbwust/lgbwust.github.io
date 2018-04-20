---
layout: post
title: Java8 函数式接口
categories: [java]
tags: code
---

> emmm...继续

---

## 函数式接口

lambda 表达式的类型是什么？一些语言使用函数值或函数对象来表示 lambda 表达式，但 Java™ 语言没有这么做。Java 使用函数接口来表示 lambda 表达式类型。乍一看似乎有点奇怪，但事实上这是一种确保对 Java 语言旧版本的向后兼容性的有效途径。

您应该非常熟悉下面这段代码：
```java
Thread thread = new Thread(new Runnable() {
  public void run() {
    System.out.println("In another thread");
  }
});
 
thread.start();
 
System.out.println("In main");
```
Thread 类和它的构造函数是在 Java 1.0 中引入的，距今已有超过 20 年的时间。从那时起，构造函数从未改变过。将 Runnable 的匿名实例传递给构造函数已成为一种传统。但是从 Java 8 开始，可以选择传递 lambda 表达式：
```java
Thread thread = new Thread(() -> System.out.println("In another thread"));
```

Thread 类的构造函数想要一个实现 Runnable 的实例。在本例中，我们传递了一个 lambda 表达式，而不是传递一个对象。我们可以选择向各种各样的方法和构造函数传递 lambda 表达式，包括在 Java 8 之前创建的一些方法和构造函数。这很有效，因为 lambda 表达式在 Java 中表示为函数接口。

**函数接口有 3 条重要法则**：

- 一个函数接口只有一个抽象方法。
- 在 Object 类中属于公共方法的抽象方法不会被视为单一抽象方法。
- 函数接口可以有默认方法和静态方法。

任何满足单一抽象方法法则的接口，都会被自动视为函数接口。这包括 Runnable 和 Callable 等传统接口，以及您自己构建的自定义接口。

Java 在新版本中也定义了相应的函数式接口以及基本数据类型的子接口，它们都被放在了 java.util.function 包下

类名 | 含义
:---:|:---:|
Predicate | 传入一个参数，返回一个 boolean 结果，方法为 boolean test(T t)
Consumer | 传入一个参数，无返回值，方法为 void accept(T t)
Function | 传入一个参数，返回一个结果，方法为 R apply(T t)
Supplier | 无参数传入，返回一个结果，方法为 T get()
UnaryOperator | 一元操作符，继承 Function，传入参数的类型和返回类型相同
BinaryOperator | 二元操作符，传入的两个参数的类型和返回类型相同，继承 BiFunction

## 内置函数接口

除了已经提到的单一抽象方法之外，JDK 8 还包含多个新函数接口。最常用的接口包括 `Function<T, R>、Predicate<T> `和` Consumer<T>`，它们是在 `java.util.function` 包中定义的。Stream 的 map 方法接受` Function<T, R>` 作为参数。类似地，filter 使用 `Predicate<T>`，`forEach `使用 `Consumer<T>`。该包还有其他函数接口，比如 `Supplier<T>、BiConsumer<T, U>` 和 `BiFunction<T, U, R>`。

可以将内置函数接口用作我们自己的方法的参数。例如，假设我们有一个 Device 类，它包含方法 checkout 和 checkin 来指示是否正在使用某个设备。当用户请求一个新设备时，方法 `getFromAvailable `从可用设备池中返回一个设备，或在必要时创建一个新设备。

我们可以实现一个函数来借用设备，就象这样：
```java
public void borrowDevice(Consumer<Device> use) {
  Device device = getFromAvailable();
   
  device.checkout();
   
  try {
    use.accept(device);      
  } finally {
    device.checkin();
  }
}
```
**borrowDevice 方法**：

- 接受 Consumer<Device> 作为参数。
- 从池中获取一个设备（我们在这个示例中不关心线程安全问题）。
- 调用 checkout 方法将设备状态设置为 checked out。
- 将设备交付给用户。
  
在完成设备调用后返回到 Consumer 的 accept 方法时，通过调用 checkin 方法将设备状态更改为 checked in。

下面给出了一种使用 borrowDevice 方法的方式：

```java
new Sample().borrowDevice(device -> System.out.println("using " + device));
```
因为该方法接收一个函数接口作为参数，所以传入一个 lambda 表达式作为参数是可以接受的。

## 自定义函数接口

尽管最好尽量使用内置函数接口，但有时需要自定义函数接口。

要创建自己的函数接口，需要做两件事：

- 使用 `@FunctionalInterface` 注释该接口，这是 **Java 8 对自定义函数接口的约定**。
- 确保该接口只有一个抽象方法。

该约定清楚地表明该接口应接收 lambda 表达式。当编译器看到该注释时，它会验证该接口是否只有一个抽象方法。

使用 `@FunctionalInterface` 注释可以确保，如果在未来更改该接口时意外违反抽象方法数量规则，您会获得错误消息。这很有用，因为您会立即发现问题，而不是留给另一位开发人员在以后处理它。没有人希望在将 lambda 表达式传递给其他人的自定义接口时获得错误消息。

### 创建自定义函数接口

作为一个示例，我们将创建一个 Order 类，它有一系列 OrderItem 以及一个转换并输出它们的方法。我们首先创建一个接口。

下面的代码将创建一个 Transformer 函数接口。
```java
@FunctionalInterface
public interface Transformer<T> {
  T transform(T input);
}
```
该接口用 `@FunctionalInterface `注释做了标记，表明它是一个函数接口。因为该注释包含在 java.lang 包中，所以没有必要导入。该接口有一个名为 transform 的方法，后者接受一个参数化为 T 类型的对象，并返回一个相同类型的转换后对象。转换的语义将由该接口的实现来决定。

这是 OrderItem 类：
```java
public class OrderItem {
  private final int id;
  private final int price;
   
  public OrderItem(int theId, int thePrice) {
    id = theId;
    price = thePrice;
  }
   
  public int getId() { return id; }
  public int getPrice() { return price; }
   
  public String toString() { return String.format("id: %d price: %d", id, price); }
}
```
OrderItem 是一个简单的类，它有两个属性：id 和 price，以及一个 toString 方法。

现在来看看 Order 类。
```java
import java.util.*;
import java.util.stream.Stream;
 
public class Order {
  List<OrderItem> items;
   
  public Order(List<OrderItem> orderItems) {
    items = orderItems;
  }
   
  public void transformAndPrint(
    Transformer<Stream<OrderItem>> transformOrderItems) {
     
    transformOrderItems.transform(items.stream())
      .forEach(System.out::println);
  }
}
```
transformAndPrint 方法接受 Transform<Stream<OrderItem> 作为参数，调用 transform 方法来转换属于 Order 实例的订单项，然后按转换后的顺序输出这些订单项。

这是一个使用该方法的样本：
```java
import java.util.*;
import static java.util.Comparator.comparing;
import java.util.stream.Stream;
import java.util.function.*;
 
class Sample {     
  public static void main(String[] args) {
    Order order = new Order(Arrays.asList(
      new OrderItem(1, 1225),
      new OrderItem(2, 983),
      new OrderItem(3, 1554)
    ));
     
     
    order.transformAndPrint(new Transformer<Stream<OrderItem>>() {
      public Stream<OrderItem> transform(Stream<OrderItem> orderItems) {
        return orderItems.sorted(comparing(OrderItem::getPrice));
      }
    });
  }
}
```
我们传递一个匿名内部类作为 transformAndPrint 方法的参数。在 transform 方法内，调用给定流的 sorted 方法，这会对订单项进行排序。这是我们的代码的输出，其中显示了按价格升序排列的订单项：
```
id: 2 price: 983
id: 1 price: 1225
id: 3 price: 1554
```
### lambda 表达式的强大功能

在任何需要函数接口的地方，我们都有 3 种选择：

- 传递一个匿名内部类。
- 传递一个 lambda 表达式。
- 在某些情况下传递一个方法引用而不是 lambda 表达式。

传递匿名内部类的过程很复杂，我们只能传递方法引用来替代直通 lambda 表达式。考虑如果我们重写对 transformAndPrint 函数的调用，以使用 lambda 表达式来代替匿名内部类，将会发生什么：

`order.transformAndPrint(orderItems -> orderItems.sorted(comparing(OrderItem::getPrice)));`

与我们最初提供的匿名内部类相比，这简洁得多且更容易阅读。

## 自定义函数接口与内置函数接口

我们的自定义函数接口演示了创建自定义接口的优势和不足。首先考虑优势：

- 您可以为自定义接口提供一个描述性名称，帮助其他开发人员修改或重用它。像 Transformer、Validator 和 ApplicationEvaluator 这样的名称是特定于领域的，可以帮助读取接口方法的人推断对参数的预期是什么。

- 只要您高兴，可以为抽象方法提供任何具有有效语法的名称。只有接口的接收者会获得此优势，而且仅在传递抽象方法时才会体现出来。传递 lambda 表达式或方法引用的调用方不会获得此优势。

- 您可以在自己的接口中使用参数化的类型，或者让它保持简单并特定于某些类型。在本例中，可以编写 Transformer 接口来使用 OrderItems 而不是参数化类型 T。

- 您可以编写自定义的默认方法和静态方法，它们可供该接口的其他实现使用。

当然，使用自定义函数接口也存在不足之处：

- 想象创建多个接口，所有接口都有具有相同签名的抽象方法，比如接受 String 作为参数并返回 Integer。尽管方法的名称可能有所不同，但它们大部分都是多余的，可替换为一个具有通用名称的接口。

- 任何想要使用自定义接口的人，都必须投入额外的精力来学习、理解和记住它们。所有 Java 程序员都熟悉 java.lang 包中的 Runnable。我们一次又一次地看到它，所以可以轻松地记住它的用途。但是，如果我使用了一个自定义 Executor，您在使用该接口之前必须仔细了解它。在某些情况下，投入一些精力是值得的，但是如果 Executor 与 Runnable 非常相似，就会浪费精力。

## 哪种接口最好？

了解自定义函数接口与内置函数接口的优缺点后，如何确定采用哪种接口？我们回顾一下 Transformer 接口来寻找答案。

回想一下，Transformer 的存在是为了传达将一个对象转换为另一个对象的语义。这里，我们按名称来引用它：

`public void transformAndPrint(Transformer<Stream<OrderItem>> transformOrderItems) {}`

方法 transformAndPrint 接收一个负责执行转换的参数。该转换可能对 OrderItems 集合中的元素进行重新排序。或者，它可能屏蔽每个订单项的部分细节。或者该转换可以决定什么都不做，仅返回原始集合。将实现工作留给调用方。

重要的是，调用方知道它们可以将转换实现作为参数提供给 transformAndPrint 方法。函数接口的名称和它的文档应该提供这些细节。在本例中，从参数名称 (transformOrderItems) 也可以清楚了解这些细节，而且它们应包含在 transformAndPrint 函数的文档中。尽管函数接口的名称很有用，但它不是了解函数接口用途和用法的唯一途径。

仔细查看 Transformer 接口，并将它的用途与 JDK 的内置函数接口进行比较，我们看到 `Function<T, R> `可以取代 Transformer。要测试 Transformer 函数接口，可以从代码中删除它并更改 transformAndPrint 函数，就像这样：
```java
public void transformAndPrint(Function<Stream<OrderItem>, Stream<OrderItem>> transformOrderItems) {
  transformOrderItems.apply(items.stream())
    .forEach(System.out::println);
}
```
改动很小 —除了将 `Transformer<Stream<OrderItem>>` 更改为` Function<Stream<OrderItem>>、Stream<OrderItem>>`，我们还将方法调用从 transform() 更改为 apply()。

对 transformAndPrint 的调用使用了一个匿名内部类，我们还需要更改这一点。但是，我们已更改该调用来使用 lambda 表达式：

`order.transformAndPrint(orderItems -> orderItems.sorted(comparing(OrderItem::getPrice)));`

函数接口的名称与 lambda 表达式无关—它仅与编译器相关，编译器将 lambda 表达式参数与方法参数联系起来。方法的名称是 transform 还是 apply，同样与调用方无关。

使用内置的函数接口让我们的接口减少了一个，调用该方法也具有同样功效。我们也没有损害代码的可读性。这个练习告诉我们，我们可以轻松地将自定义函数接口替换为内置接口。我们只需提供 transformAndPrint 的文档（未显示）并采用含义更明确的方式命名该参数。

## 总结

将 lambda 表达式设置为函数接口类型的设计决策，有助于在 Java 8 与早期 Java 版本之间实现向后兼容性。可以将 lambda 表达式传递给任何通常接收单一抽象方法接口的旧函数。要接收 lambda 表达式，方法的参数类型应为函数接口。

在某些情况下，创建自己的函数接口是合情合理的，但在这么做时应该小心谨慎。仅在应用程序需要高度专业化的方法时，或者现有接口无法满足您的需求时，才考虑自定义函数接口。请始终检查一个 JDK 的内置函数接口中是否存在该功能。尽量使用内置函数接口。

---
