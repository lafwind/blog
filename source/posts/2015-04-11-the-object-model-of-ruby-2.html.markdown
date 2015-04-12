---
title: Ruby对象模型（2）
date: 2015-04-11 13:26 UTC
tags:
---

[前文](https://)介绍了对象、类、模块等的概念后，该正式进入主题了——对象模型。其实说白了，就是XX在哪呢~

比如，一个对象（可能是类）调用了一个方法，这个方法到底在哪，为什么别的对象无法调用，搞清了对象模型，也就能搞定类似问题。

_P.S: 由于类也是对象，由Class类生成，为了便于行文，把这种对象称为类对象_

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
    puts "M"
  end

  def world
    puts "world"
  end
end

class N < M; end

n = N.new

n.hello                     # => M
n.world                     # => world
p N.ancestors               # => [N, M, Object, Kernel, BasicObject]

class << n
  def hello
    puts "eigenclass"
  end
end

n.hello                     # => eigenclass
n.world                     # => world
p N.ancestors               # => [N, M, Object, Kernel, BasicObject]

p n.eigenclass              # => #<Class:#<N:0x007fd209499f20>>
p n.eigenclass.class        # => Class
p n.eigenclass.superclass   # => N


```

因此，现在可以总结普通对象部分的对象模型了：

每个普通对象都有自己真正的类，这个类可能是普通类，也可能是eigenclass，如果是eigenclass，则eigenclass的父类是生成该对象的类（上述例子中是N）；如果没有eigenclass，那么就是普通类（上述例子中是N），以上面的例子看，有如下两情况：

1. 未加入单件方法：n -> N -> M -> Object -> Kernel -> BasicObject

2. 加入单件方法后：n -> eigenclass -> N -> M -> Object -> Kernel -> BasicObject

方法查找也是根据属于上面何种情况来进行，n为对象本身，之后为n的祖先链。

这就是普通对象的对象模型。在脑中存有这个模型图像，至于如何定义单件方法及一些相关详情，可参考《Ruby 元编程》相关笔记[1](https://github.com/lafwind/notes_of_metaprogramming_ruby/blob/master/chapter_1.markdown)，[2](https://github.com/lafwind/notes_of_metaprogramming_ruby/blob/master/chapter_4.markdown)，或上网查询。

这篇文章完成了普通对象的对象模型，后续还有类对象的对象模型和其他内容。
