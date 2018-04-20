---
layout: post
title: Java8 Lambda 表达式之方法引用
categories: [java]
tags: code
---

> 每天进步一点点

## 概述

**方法引用**是用来直接访问类或者实例的已经存在的方法或者构造方法。方法引用提供了一种引用而不执行方法的方式，它需要由兼容的函数式接口构成的目标类型上下文。计算时，方法引用会创建函数式接口的一个实例。

当Lambda表达式中只是执行一个方法调用时，不用Lambda表达式，直接通过方法引用的形式可读性更高一些。方法引用是一种更简洁易懂的Lambda表达式。

## 作用

- 方法引用的唯一用途是支持Lambda的简写。

- 方法引用提高了代码的可读性，也使逻辑更加清晰。

## 构成

使用::操作符将方法名和对象或类的名字分隔开。“::” 是域操作符（也可以称作定界符、分隔符）。

方法引用 | 等价的lambda表达式
:---: | :---: 
String::valueOf | x -> String.valueOf(x)
Object::toString | x -> x.toString()
x::toString | () -> x.String()
ArrayList::new | () -> new ArrayLis<>()

## 分类

### 静态方法引用

组成语法格式：`ClassName::staticMethodName`

- 静态方法引用比较容易理解，和静态方法调用相比，只是把 . 换为 ::
- 在目标类型兼容的任何地方，都可以使用静态方法引用。

```java
/* 
* 函数式接口 
* */  
interface StringFunc {  
    String func(String n);  
}  
class MyStringOps {  
    //静态方法： 反转字符串  
    public static String strReverse(String str) {  
        String result = "";  
        for (int i = str.length() - 1; i >= 0; i--) {  
            result += str.charAt(i);  
        }  
        return result;  
    }  
}  
class MethodRefDemo {  
    public static String stringOp(StringFunc sf, String s) {  
        return sf.func(s);  
    }  
    public static void main(String[] args) {  
        String inStr = "lambda add power to Java";  
        //MyStringOps::strReverse 相当于实现了接口方法func() ，并在接口方法func()中作了MyStringOps.strReverse()操作  
        String outStr = stringOp(MyStringOps::strReverse, inStr);  
        System.out.println("Original string: " + inStr);  
        System.out.println("String reserved: " + outStr);  
    }  
}  

output:
Original string: lambda add power to Java
String reserved: avaJ ot rewop dda adbmal
```

### 实例方法引用

这种语法与用于静态方法的语法类似，只不过这里使用对象引用而不是类名。

实例方法引用又分以下三种类型

#### 实例上的实例方法引用

组成语法格式：`instanceReference::methodName`

- 对于具体（或者任意）对象的实例方法引用，在实例方法名称和其所属类型名称间加上分隔符 ：
- 与引用静态方法引用相比，都换为实例对象的而已。


```java
/*
* 函数式接口
* */
interface StringFunc {
    String func(String n);
}
class MyStringOps {
    //普通方法： 反转字符串
    public String strReverse(String str) {
        String result = "";
        for (int i = str.length() - 1; i >= 0; i--) {
            result += str.charAt(i);
        }
        return result;
    }
}
class MethodRefDemo2 {
    public static String stringOp(StringFunc sf, String s) {
        return sf.func(s);
    }
    public static void main(String[] args) {
        String inStr = "lambda add power to Java";
        MyStringOps strOps = new MyStringOps();//实例对象
        //MyStringOps::strReverse 相当于实现了接口方法func() ，并在接口方法func()中作了MyStringOps.strReverse()操作
        String outStr = stringOp(strOps::strReverse, inStr);

        System.out.println("Original string: " + inStr);
        System.out.println("String reserved: " + outStr);
    }
}

output:
Original string: lambda add power to Java
String reserved: avaJ ot rewop dda adbmal
```
#### 超类上的实例方法引用

组成语法格式：`super::methodName`

方法的名称由methodName指定

通过使用super，可以引用方法的超类版本。

 `super::name`

还可以捕获`this` 指针

this :: equals  等价于lambda表达式  `x -> this.equals(x);`

#### 类型上的实例方法引用

组成语法格式：`ClassName::methodName`

- 若类型的实例方法是泛型的，就需要在::分隔符前提供类型参数，或者（多数情况下）利用目标类型推导出其类型。

- 静态方法引用和类型上的实例方法引用拥有一样的语法。编译器会根据实际情况做出决定。

- 一般我们不需要指定方法引用中的参数类型，因为编译器往往可以推导出结果，但如果需要我们也可以显式在::分隔符之前提供参数类型信息。

`String::toString` 等价于lambda表达式 `(s) -> s.toString() `

这里不太容易理解，实例方法要通过对象来调用，方法引用对应Lambda，Lambda的第一个参数会成为调用实例方法的对象。

**在泛型类或泛型方法中，也可以使用方法引用。**
```java
interface MyFunc<T> {
    int func(T[] als, T v);
}
class MyArrayOps {
    public static <T> int countMatching(T[] vals, T v) {
        int count = 0;
        for (int i = 0; i < vals.length; i++) {
            if (vals[i] == v) count++;
        }
        return count;
    }
}
class GenericMethodRefDemo {
    public static <T> int myOp(MyFunc<T> f, T[] vals, T v) {
        return f.func(vals, v);
    }
    public static void main(String[] args){
        Integer[] vals = {1, 2, 3, 4, 2, 3, 4, 4, 5};
        String[] strs = {"One", "Two", "Three", "Two"};
        int count;
        count=myOp(MyArrayOps::<Integer>countMatching, vals, 4);
        System.out.println("vals contains "+count+" 4s");
        count=myOp(MyArrayOps::<String>countMatching, strs, "Two");
        System.out.println("strs contains "+count+" Twos");
    }
}

output:
vals contains 3 4s
strs contains 2 Twos
```

### 构造方法引用


#### 构造方法引用 （也可以称作构造器引用）

组成语法格式：`Class::new`

构造函数本质上是静态方法，只是方法名字比较特殊，使用的是`new` 关键字。

```java
//eg1:
List<String> strings = new ArrayList<String>();
strings.add("a");
strings.add("b");
Stream<Button> stream = strings.stream().map(Button::new);
List<Button> buttons = stream.collect(Collectors.toList());

//eg2
interface MyFunc {
    MyClass func(int n);
}
class MyClass {
    private int val;
    MyClass(int v) {
        val = v;
    }
    MyClass() {
        val = 0;
    }
    public int getValue() {
        return val;
    }
}
class ConstructorRefDemo {
    public static void main(String[] args) {
        MyFunc myClassCons = MyClass::new;
        MyClass mc = myClassCons.func(100);
        System.out.println("val in mc is: " + mc.getValue());
    }
}

output:
val in mc is: 100 
```

#### 数组构造方法引用：

组成语法格式：`TypeName[]::new`

-- `int[]::new` 是一个含有一个参数的构造器引用，这个参数就是数组的长度。

等价于lambda表达式  `x -> new int[x]`。

假想存在一个接收int参数的数组构造方法
```java
IntFunction<int[]> arrayMaker = int[]::new;
int[] array = arrayMaker.apply(10) // 创建数组 int[10]
```
## 总结

方法引用仅仅是Lambda的配套服务，主要目的是通过名字来获得Lambda，重复利用已有的方法。
