---
title: Rails 中的 cache（一）
date: 2015-06-22 15:52 UTC
tags:
---

其实，写这篇文章，自己有点心虚……首先，内容有点大；其次，我几乎没有在Rails中使用cache的经验= =，因为项目还没有这个需要T.T（Donald Knuth曾说过“过早的优化是万恶之源”，这是自我安慰吗～？），但是由于这几天都在看有关优化方面的内容，比如 [How To Write Ruby Faster at the Source Code Level](http://thenewstack.io/how-to-write-ruby-faster-at-the-source-code-level/)，[fast-ruby](https://github.com/JuanitoFatas/fast-ruby) 以及cache相关的内容，所以就想把相关内容记录下来，以备将来之需！

p.s.：之所以在未经充分实践就把文章写下来的最主要原因是：平时自己就喜欢乱看东西，比如曾经看了haskell，go等，但由于没有实践，现在都差不多忘了，以至于白白浪费了之前的学习，为了避免重蹈覆辙，决定把学到的东西（不管开始用没）记录下来，当之后用到时也能通过这些文章更快地进入状态，这也是我之前说的想要写博客的原因之一；而这也从另一方面督促自己，还有很多东西没做呢！要把时间花在刀刃上！

言归正传，就如上文所说，cache的内容有点多，有服务器端的、客户端的及一些页面相关的，在此次文章中，我主要想看看rails中的[Fragment Caching](http://guides.rubyonrails.org/caching_with_rails.html)。这种缓存是把视图逻辑中的一部分打包到cache块中，之后的请求就会从缓存中取得这部分的内容。比如在一个图片网站中（像[Impage](https://impage.herokuapp.com/) ; )），一般情况，图片的内容是不会变的，但是评论的内容则会慢慢增加，这种情况下，就可以将图片部分的相关视图缓存起来，而不用每次都像数据库发出请求，以此提高速度。代码方面如下：

```haml
# example
- cache [@post]
  %p= @post.title
  %span= @post.user.email
  - @post.tag_list.each do |tag|
    = link_to "#{tag}", root_path(tag: tag), class: "btn"
  = image_tag @post.image.url(:large)
  %p= @post.description

```

上面是一个使用fragment caching的例子，而cache[@post]会生成类似下列的key：

`views/posts/3-20150616162219`，这个键包含模型名，post的id和最后更新时间updated_at，所以当post出现更新时（即updated\_at更改），这个post才会生成一个新的缓存，而旧的缓存就不再管理，等到缓存满了后会利用LRU自动清理。

除了上述的自动更新缓存外，也可以利用`expire_fragment`方法来手动清除缓存。

以上是fragment cache的一些基本内容。试想在这样一种情况下：缓存了一个大页面，此时有一个小小的section更新了，那么这个大页面的缓存也必须得更新，这样显然降低了效率。应对这种情况，rails提供了嵌套方式来重用缓存，如：

```haml
# example 伪代码
- cache [@posts]
  - @posts.each do |post|
    - cache post
```

这样当有一个post更新时，就仅更新该post的缓存，然后重新和其他post的缓存（沿用之前的）拼接，提高了效率，这种机制称为Russian Doll机制（套娃机制）。而在1:1或1：n（belongs_to）的情况下，比如：

```ruby
class Item < ActiveRecord::Base
    belongs_to :list
end
```

此时，在item更新时，并不会提示list的缓存也更新，解决的方法是利用touch属性：

```ruby
class Item < Activerecord::Base
    belongs_to :list, touch: true
end
```
这样，当item更新，list也会跟着更新，有关套娃机制的内容，请参看Ruby-China上的[说说 Rails 的套娃缓存机制](https://ruby-china.org/topics/21488)。

上述就是这两天对于fragment cache的学习，之后会对其进行实践，如有新的理解，会接着更新。而后续也会对其他cache进行学习。
