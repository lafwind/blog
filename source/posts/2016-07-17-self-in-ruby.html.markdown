---
title: Ruby 中的 self
date: 2016-07-17 10:13 UTC
tags:
---

> “知人者智，自知者明”

为人处事当如此，在 Ruby 代码中是亦如此。清楚 `self` 为何物有助于更好地理解和写出正确的 Ruby 代码。

`self` 在 Ruby 程序中代表着此时所处位置的当前对象。而具体位置可分以下几种情况：

* 在实例方法中，此时 `self` 指向调用该方法的对象

* 不在类中的方法内，`self` 指向顶级上下文 `main` 对象

* 在类中， 但不在实例方法中，此时 `self` 指向当前的类（因此此时定义的变量为类实例变量，是属于这个类的）

* 即不在类中，也不在方法内，此时 `self` 指向顶级上下文 `main`

* 在块内，`self` 所指与此块外层的 `self`所指一致

以下为例：

``` ruby
p self # main
1.times { p self } # main

def m1
  p self
  1.times { p self }
end

class A
  p self # A
  1.times { p self } # A

  def m
    p self
    1.times { p self }
  end
end

m1 # 输出两行，皆为 main

a = A.new
a.m # 输出两行，皆指向 a
```

以上就是 `self` 在程序中各位置所指的具体对象，明白了这点，对于 Ruby 代码中各种方法、变量的归属也会有更清晰的认识，对代码也就有了更高的掌控。

*P.S.1：* 除了当前对象 `self`，Ruby 中还有当前类的存在，定义方法时，该方法会成为当前类的实例方法（单件方法另说）。当用 `class` 打开一个类时，这个类就成了当前类。

*P.S.2：*

``` ruby
# 例子来自《Ruby 元编程》

class
  def method_one
    def method_two; 'Hello!'; end
  end
end

obj = MyClass.new
obj.method_one
obj.method_two # "Hello!"
```
此时 `method_two` 所属的类是 `MyClass`，这也就是为什么在顶级作用域中定义的方法会成为 Object（`main` 对象的类） 类实例方法的原因。
