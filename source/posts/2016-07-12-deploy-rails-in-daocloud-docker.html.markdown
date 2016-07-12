---
title: 在 DaoCloud（Docker） 上部署 Rails 应用
date: 2016-07-12 14:25 UTC
tags: Docker
---

前几日 Rails 5 正式发布，便用其写了个小的[聊天室](http://lafwind-chat.daoapp.io/)（[源码](https://github.com/lafwind/chat)），当然，中间用到了 ActionCable。应用写完想着像之前的其他应用一样把它部署到 Heroku 上面，但发现当需要安装相应的 Redis add-on 时，需要进行信用卡方面的账号核实，而自己本身又没有信用卡= =，所以这一想法算是泡汤了。经过上网查询，发现将其放在 DaoCloud 上是个不错的想法，遂决定实行。

### 正文

由于把应用部署到 DaoCloud 需先生成一个 Docker 镜像，而 DaoCloud 在这方面已经帮你准备得差不多，只需要自己写一份 Dockerfile，配置一下所需的环境，这点倒不难，对 Dockerfile 相关指令（查[文档](https://docs.docker.com/engine/reference/builder/)，或找一份[样本](https://github.com/lafwind/chat/blob/master/Dockerfile)看一下）和命令行熟悉的应该一下就上手了。以下是我为这次项目写的 Dockerfile：

```Dockerfile

FROM ubuntu:14.04
MAINTAINER Lafwind Li "lafwind@gmail.com"

RUN apt-get update
# 使用 postgresql 需要安装 libpq-dev、postgresql，如使用其他数据库，根据需要安装其他库
RUN apt-get -y install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev libpq-dev postgresql

# 安装 nodejs, rails 需要 javascript runtime
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs
ENV PATH /usr/bin/nodejs:$PATH
RUN nodejs -v

RUN cd

# 用 rbenv 安装 ruby
RUN git clone https://github.com/rbenv/rbenv.git /root/.rbenv
RUN git clone https://github.com/rbenv/ruby-build.git /root/.rbenv/plugins/ruby-build
RUN ./root/.rbenv/plugins/ruby-build/install.sh
ENV PATH /root/.rbenv/bin:$PATH
RUN echo 'eval "$(rbenv init -)"' >> /etc/profile.d/rbenv.sh
RUN echo 'eval "$(rbenv init -)"' >> .bashrc
RUN echo 'eval "$(rbenv init -)"' >> $HOME/.bash_profile
RUN rbenv install 2.3.1
RUN rbenv global 2.3.1
ENV PATH /root/.rbenv/shims:$PATH
RUN ruby -v
RUN gem install --no-rdoc --no-ri bundler
RUN rbenv rehash

# copy app， 把代码仓库（github、bitbucket）拉到指定文件夹
RUN mkdir -pv /my_app
WORKDIR /my_app
ADD ./ /my_app/chat
WORKDIR /my_app/chat

RUN bundle install -V

# setting ENV
ENV RACK_ENV="production" RAILS_ENV="production"

# 为安全考量在运行时才产生 SECRET KEY，而不是一开始就设定在相关 yaml 文档里并 push 到公开仓库（本人在 github 上只有公开仓库= =）
ENV SECRET_KEY_BASE $(rails secret)
ENV DEVISE_SECRET_KEY $(rails secret)

# 给 start.sh 执行权限
RUN chmod 777 start.sh

RUN rails assets:precompile
EXPOSE 80

CMD ["sh", "/my_app/chat/start.sh"]
```

有了上述的 Dockerfile，将它放在项目的根目录下（DaoCloud 预设 Dockerfile 放在根目录，也可以自己指定）。

然后我们就可以据此部署我们的应用了：

* 将本地代码 push 到远端仓库

* 登录 DaoCloud 后点击 _代码构建_，并 _创建新项目_

* 填入项目名称，并指定远端仓库的源代码，此时需要连接你的 Github 或相关账号

* 之后选择执行环境等。P.S.：根据我的个人经验（可能不具普适性），执行环境选国外比较好，速度差别还是挺大的

* 接着点击_开始创建_

* 创建结束并不会马上执行，预设触发规则是在 git 提交 tag 的后根据根目录下的 Dockerfile（可在流程定义里更改路径） 进行构建（可在触发规则下进行修改），如执行下列命令将会创建相应 tag 的镜像：

* ```shell
$ git tag -a v1.0.0 -m 'version 1.0.0'
$ git push origin master --tags
```

* 镜像构建完成后（时间不定，与执行环境的选择有关），就可根据该进项创建新应用。点击_应用列表_，并_创建应用_

* 选择创建成功的镜像进行部署

* 由于这个项目中使用到 Postgresql 和 Redis，可以先在_服务集成_中创建相应的服务（此处是 Postgresql 和 Redis）

* 在应用部署中需要在配置里绑定相应服务（此处是刚刚创建的两个服务）

* 此时会生成相应服务的环境变量，这些环境变量可以直接在源代码里通过 `ENV['xxx']` 进行引用；同时也可手动创建环境变量方便项目使用（比如在 cable.yml 中 Redis 所需的 url 可根据服务所提供的 Redis 相关数据进行组合并赋值给手动创建的环境变量
REDIS\_URL，然后直接 yaml 文档中以 `<%= ENV['REDIS_URL'] =>` 的方式使用）

* 完成这些设定后（有些细节设定根据自己需求进行选择）即可进行部署

* 部署完成后应用的启动命令是 Dockerfile 中 CMD，在本例中是执行 _start.sh_，可在该脚本中执行 rails 的相关命令，如 `rails db:migrate` 或 启动服务器（如 puma）等

上述就是整个部署的大致过程，部署成功后会得到一个 DaoCloud 提供的二级域名，如果需要可自己绑定顶级域名，然后就可根据域名进行访问啦！

### 参考

* [在 DaoCloud 上部署 Rails App](https://ruby-china.org/topics/26313)
