---
title: Ruby对象模型（1）
date: 2015-04-10 13:20 UTC
tags:
---

这段时间重新温习了《Ruby 元编程》，对里面的内容，相较于第一次看，又有了一些新的认识。为此整理了一些笔记（条目型的），如有兴趣，[点击](https://github.com/lafwind/notes_of_metaprogramming_ruby)。

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

模块。类的超类，类比它多加了三个方法，new()，allocate()，superclass()。而这几个方法使类可以创建对象并将对象纳入类体系架构。除此之外*绝大多数适用于类的内容同样适用于模块，反之亦然*。

用代码理清下类和模块的关系，打开irb：

```ruby
class MyClass
end

MyClass.class # => Class
MyClass.ancestors # => [MyClass, Object, Kernel, BasicObject]

Class.superclass # => Module

Class.class         # => Class
Module.class        # => Class
Object.class        # => Class
BasicObject.class   # => Class

# 所有类都是由Class生成的对象

Kernel.class        # => Module

```

在上面的代码中，MyClass的祖先链中，混入了不是类的奇怪生物Kernel，为什么它会在这里？答案是该模块被Object包含，被包含的模块在祖先链中处于包含该模块的类的正上方，代码：

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

介绍完这些概念后，该进入主题了——对象模型。其实说白了，就是XX在哪呢~

比如，一个对象（可能是类）调用了一个方法，这个方法到底在哪，为什么别的对象无法调用，搞清了对象模型，也就能搞定类似问题。

先从对象说起吧（此处不包含类，因为类相对于普通对象还具有超类这个属性）。当对象调用一个方法时，到底发生了啥？很简单，在对象模型里找方法，然后调用之。而这个寻找的路径，也就构成了对象模型的一部分。

利用上面使用的ancestors方法，我们知道对象调用的方法就存在于它的祖先链中，那么针对下面这种情况呢：

```ruby
a = "hello"

# A
def a.say
  puts a
end

a.class # => String
a.say   # => "hello"

b = "en"
b.class # => String
b.say   # undefined method `say' for "en":String (NoMethodError)

p String.ancestors
```

明显，a和b都是String类生成的对象，但是在经过定义后，a对象拥有了say()方法，而b对象则无此方法，再看两者的祖先链，明显仍是一样的，那么此时say()方法放在哪呢？

这就涉及到eigenclass，上面程序中，在A处为a对象定义了只属于a的方法（单件方法），而这些方法就存在a的eigenclass中，a是这个eigenclass的唯一实例（且eigenclass不能被继承）。再看代码：

```ruby
class Object
  def eigenclass
    class << self
      self
    end
  end
end

class M
  def hello
    puts "hello"
  end
end

class N < M; end

n = N.new

n.hello

class << m
  def hello
    puts "eigenclass"
  end
end

n.hello

p n.eigenclass
p n.eigenclass.superclass


```

因此，现在可以总结普通对象部分的对象模型了：

每个普通对象都有自己真正的类，这个类可能是普通类，也可能是eigenclass，如果是eigenclass，则eigenclass的父类是
