---
title: 如何为Github上的开源项目贡献代码
date: 2015-03-15 13:13 UTC
tags: github git
---

以前一直只将Github作为自己的代码仓库，当然也start了好多项目，但却从未尝试过它的另一个重要功能：协作开发。当然，为开源项目贡献代码一直是自己想做的，之所以未曾做过，主要原因是没信心，觉得自己能力还不够，拖着拖着就到现在了（和写博客有异曲同工之处= =）。而之所以现在开始的原因嘛，很直接，不想拖了！当然担心还是有的，不过谁不是一步一步开始的呢~~ 

下文讲的是向开源项目提交代码的流程，尽量简洁。

_假设你所要贡献代码的开源项目为**A**，具体流程如下：_

1 查看项目的CONTRIBUTING。这是项目所有者所希望的贡献者参与项目和提交代码时的规范。一般在项目里或README介绍里会有该文件或该内容。应根据这些内容来执行下面的步骤。比如：

> **Contributing**
> 
> 1. Fork it
> 2. Create your feature branch (git checkout -b my-new-feature)
> 3. Commit your changes (git commit -am 'Add some feature')
> 4. Push to the branch (git push origin my-new-feature)
> 5. Create new Pull Request


2 Fork该项目。到该项目github页面上，点击位于右上角的`Fork`按钮。此后该项目就会出现在自己的repo页，称为**B**。

3 回到自己的github repo页，将自己fork的项目（**B**）clone到本地。

  ```shell
  $ git clone https://github.com/YOURNAME/YOURFORK.git # (B)
  ```
4 设定一个远端upstream repo，此时即原始的项目**A**。因为之后你修改的代码是要回到这里的，这也才能达到贡献的目的。

  ```shell
  $ git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git # (A)
  ```
  完成上述两个步骤后，可以使用以下命令，看看有没有添加完成：

  ```shell
  $ git remote -v #应该看到fork后自己的repo和公共项目的repo
  ```

5 同步远端上游库（upstream repo，即**A**），这能让你的代码保持最新。之后如持续为项目提交代码，应时常进行该同步。 
  ```shell
  $ git fetch upstream

  # 回到自己的master分支
  $ git checkout master

  # 合并刚刚同步的upstream/master 最新版本
  $ git merge upstream/master
  ```

6 为该项目建立一个feature分支。

  ```shell
  $ git checkout -b feature
  ```

7 修改或添加代码。

8 commit 并 push 到自己的远端仓库（即**B**）。此时你可以选择push这feature分支，或者将它合到你的master分支再提交都可。具体应该参考这个项目的CONTRIBUTING。

  ```shell
  # 先git add 和 git commit
  $ git push -u origin feature # 取决于CONTRIBUTING或你
  ```

9 然后回到自己的github页面，在branch选择部分选取自己刚修改的那个分支。选完后点选左边绿色按钮。这时开始`pull request`。这时会看到自己修改后的代码分支和upstrean（**A**）的比较页面。如没问题，直接提交。

填写一些相应信息（如自己的这个feature分支解决了什么问题或有什么功能等）。

以上就是提交代码的整个流程。如再有新的提交重复5-9即可。

执行好上述几个步骤即可以为开源项目提交代码。不过如果想见到这些修改真的合并到这个主项目。你还需要等待项目所有者的审核。如果ok，那就皆大欢喜。不ok的话，则你还可在继续修改，继续提交。一切由你。

还有注意的是，经常看issue（可能是一些bug反馈，一些项目建议什么的）和pull request（并不是自己去pull request，而是看别人的，点击项目右边的相应链接，在code栏下），可以更好的融入到该项目的节奏中，也更好的达到协作开发的目的。推荐Github官方出品的[教程](https://guides.github.com/activities/contributing-to-open-source/)和[10 tips for better Pull Requests](http://blog.ploeh.dk/2015/01/15/10-tips-for-better-pull-requests/)（[中文](http://www.oschina.net/news/59961/pull-reques-ten-suggestion)）这篇文章，更好的了解协作过程中的“礼仪”。

好了，开始享受这份乐趣吧!

如下是参考链接：

* [Contributing to Open Source on GitHub（官方guide）](https://guides.github.com/activities/contributing-to-open-source/)

* [Configuring a remote for a fork](https://help.github.com/articles/configuring-a-remote-for-a-fork/)

* [Syncing a fork](https://help.github.com/articles/syncing-a-fork/)

* [Creating a pull request](https://help.github.com/articles/syncing-a-fork/)
