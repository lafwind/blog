---
title: Ruby对象模型（2）
date: 2015-04-11 13:26 UTC
tags:
---

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
