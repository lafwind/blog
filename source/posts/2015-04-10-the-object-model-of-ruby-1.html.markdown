---
title: Ruby对象模型（1）
date: 2015-04-10 13:20 UTC
tags:
---

这段时间重温了《Ruby 元编程》，对里面的内容，相较于第一次看，又有了一些新的认识。为此整理了一些笔记（条目型的），如有兴趣，[点击](https://github.com/lafwind/notes_of_metaprogramming_ruby)。

本系列文章主要想谈谈Ruby中的对象模型。作为一名想要深入学习和了解Ruby的程序员，理解Ruby的对象模型是相当必要的。

Ruby作为一门面向对象语言，对象在Ruby程序中随处可见，当然除了对象，类（class）、模块（module）实例变量（instance variable）也包含其中，而所有这些语言构建存在的系统，就是我们要讨论的对象模型。

首先谈谈对象吧。简而言之，对象就是一组实例变量加一个指向其类的引用。对象调用的方法呢？是的，方法不存在于对象中，而是在对象所属的类里。对象由类生成，因此对象拥有了在类里面定义的方法。实例变量是在方法里带有@符号的变量。看如下代码：

```ruby
class MyClass
  # 方法
  def my_method
    @v1 = 1 # 实例变量
  end
end

c = MyClass.new
c.my_method
p c # => #<MyClass:0x007f691e8577d8 @v1=1>
```

接着是类。类也是对象，由Class类生成，同时就如上面所说，类里面定义了一组方法，这些方法供对象调用，所以这是一些实例方法。类和对象不同的最后一点是，类有超类（继承），对象没有，所以类中还包含了对其超类的引用。

所以综上可得，类中包含：一组实例变量，对类的类的引用，对类的超类的引用和一组实例方法。

模块。类的超类，类比它多加了三个方法，new()，allocate()，superclass()。而这几个方法使类可以创建对象并将对象纳入类体系架构。除此之外，*绝大多数适用于类的内容同样适用于模块，反之亦然*。

用代码理清下类和模块的关系，打开irb：

```ruby
class MyClass; end

MyClass.class       # => Class
MyClass.ancestors   # => [MyClass, Object, Kernel, BasicObject]

Class.superclass    # => Module

Class.class         # => Class
Module.class        # => Class
Object.class        # => Class
BasicObject.class   # => Class

# 所有类都是由Class生成的对象

Kernel.class        # => Module

```

在上面的代码中，MyClass的祖先链中，混入了不是类的奇怪生物Kernel，为什么它会在这里？答案是该模块被Object包含，被包含的模块在祖先链中处于包含该模块的类的正上方，看下面例子：

```ruby
module O
end

module P
end

module Q
end

class R
  include O
  include P
  include Q
end

p R.ancestors # => [R, Q, P, O, Object, Kernel, BasicObject]

```

出现这样的结果，是因为R首先包含了模块O，O就出现在R的正上方，接着包含了P，P就出现在R的正上方，这样O就向上移了一辈，再来是Q出现在R正上方，O、P向上移一辈，所以就出现这样的结果，如有包含更多模块，只需以此类推。

第一部分先把这几个概念理清，后续将开始接触对象模型的相关内容。
