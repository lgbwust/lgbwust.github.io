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
