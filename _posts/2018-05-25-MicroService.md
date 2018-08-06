---
layout: post
title: 微服务简介（持续更新中）
categories: [java,微服务]
tags: code
---

> 为了更好的明天

## 什么微服务

**微服务是系统架构上的一种设计风格**， 它的主旨是将一个原本独立的**系统拆分成多个小型服务**，这些小型服务都在各自**独立的进程中运行**，服务之间通过基于HTTP的`RESTful API`进行通信协作。 被拆分成的每一个小型服务都围绕着系统中的某一项或一些耦合度较高的业务功能进行构建， 并且每个服务都维护着自身的数据存储、 业务开发、自动化测试案例以及独立部署机制。 由千有了轻量级的通信协作基础， 所以这些微服务可以使用**不同的语言**来编写。

## 微服务的挑战

- **运维：**在微服务架构中， 运维人员需要维护的进程数量会大大增加

- **接口一致性：**虽然我们拆分了服务， 但是业务逻辑上的依赖并不会消除， 只是从单体应用中的代码依赖变为了服务间的通信依赖。 而当我们对原有接口进行了一些
修改， 那么交互方也需要协调这样的改变来进行发布， 以保证接口的正确调用。 我们需要更完善的接口和版本管理， 或是严格地遵循开闭原则。

- **分布式的复杂性：**由于拆分后的各个微服务都是独立部署并运行在各自的进程内，它们只能通过通信来进行协作， 所以分布式环境的问题都将是微服务架构系统设计
时需要考虑的重要因素， 比如网络延迟、 分布式事务、 异步消息等。

## 微服务的特性

### 服务组件化

组件， 是 一个可以独立更换和升级的单元。在微服务架构中， 需要我们对服务进行组件化分解。 服务， 是 一种进程外的组件， 它通过 HTTP 等通信协议进行协作， 而不是像传统组件那样以嵌入的方式协同工作。 每一个服务都独立开发、 部署， 可以有效避免一个服务的修改引起整个系统的重新部署。

### 按业务组织团队

在实施微服务架构时，需要采用不同的团队分割方法。 由于每一个微服务都是针对特定业务的宽栈或是全栈实现， 既要负责数据的持久化存储， 又要负责用户的接口定义等各种跨专业领域的职能。 

### 做 “ 产品 ” 的态度

在实施微服务架构的团队中， 每个小团队都应该以做产品的方式， 对其产品的整个生命周期负责。 而不是以项目的模式，以完成开发与交付并将成果交接给维护者为最终目标。

### 智能端点与哑管道

在单体应用中， 组件间直接通过函数调用的方式进行交互协作。 而在微服务架构中，由于服务不在一个进程中， 组件间的通信模式发生了改变， 若仅仅将原本在进程内的方法调用改成 RPC 方式的调用， 会导致微服务之间产生烦琐的通信， 使得系统表现更为糟糕，所以， 我们需要更粗粒度的通信协议。

在微服务架构中， 通常会使用以下两种服务调用方式：
- 第一种， 使用 HTTP 的 RESTfl API 或轻量级的消息发送协议， 实现信息传递与服务调用的触发。
- 第二种， 通过在轻量级消息总线上传递消息， 类似 RabbitMQ 等 一些提供可靠异步交换的中间件。

### 去中心化治理

当我们采用集中化的架构治理方案时， 通常在技术平台上都会制定统一的标准， 但是每一种技术平台都有其短板， 这会导致在碰到短板时， 不得不花费大力气去解决， 并且可能因为其底层原因解决得不是很好， 最终成为系统的瓶颈。在实施微服务架构时， 通过采用轻量级的契约定义接口， 使得我们对于服务本身的具体技术平台不再那么敏感， 这样整个微服务架构系统中的各个组件就能针对其不同的业务特点选择不同的技术平台。

### 去中心化管理数据

我们在实施微服务架构时， 都希望让每一个**服务来管理其自有的数据库**， 这就是数据管理的去中心化。

虽然数据管理的去中心化可以让数据管理更加细致化， 通过采用更合适的技术可让数据存储和性能达到最优。 但是， 由于数据存储于不同的数据库实例中后， **数据一致性**也成为微服务架构中亟待解决的问题之一。 分布式事务本身的实现难度就非常大， 所以在微服务架构中， 我们更强调在各服务之间进行 “ 无事务 ” 的调用， 而对于数据一致性， 只要求数据在最后的处理状态是一致的即可；若在过程中发现错误， 通过补偿机制来进行处理，使得错误数据能够达到最终的一致性。

### 基础设施自动化

近年来云计算服务与容器化技术的不断成熟， 运维基础设施的工作变得越来越容易。但是， 当我们实施微服务架构时， 数据库、 应用程序的个头虽然都变小了， 但是因为拆分的原因， 数量成倍增长。 这使得运维人员需要关注的内容也成倍增长， 并且操作性任务也会成倍增长， 这些问题若没有得到妥善解决， 必将成为运维人员的噩梦。所以， 在微服务架构中， 务必从 一开始就构建起 “ 待续交付 ” 平台来支撑整个实施过程， 该平台需要两大内容， 缺一不可。
- **自动化测试：**每次部署前的强心剂， 尽可能地获得对正在运行的软件的信心。
- **自动化部署：**解放烦琐枯燥的重复操作以及对多环境的配置管理。

### 容错设计

在单体应用中， 一般不存在单个组件故障而其他部件还在运行的情况， 通常是一挂全挂。 而在微服务架构中， 由于服务都运行在独立的进程中， 所以存在部分服务出现故障，而其他服务正常运行的情况。 比如， 当正常运作的服务B调用到故障服务A时， 因故障服务 A 没有返回， 线程挂起开始等待， 直到超时才能释放， 而此时若触发服务 B 调用服务 A的请求来自服务 C, 而服务 C 频繁调用服务 B 时， 由千其依赖服务 A, 大量线程被挂起等待， 最后导致服务A也不能正常服务， 这时就会出现故障的荽延。所以， 在微服务架构中，**快速检测出故障源并尽可能地自动恢复服务是必须被设计和考虑的**。 通常， 我们都希望在每个服务中实现监控和日志记录的组件， 比如**服务状态、 断路器状态、 吞吐量 、 网络延迟**等关键数据的仪表盘等。

### 演进式设计

通过上面的几点特征， 我们已经能够体会到， 要实施 一个完美的微服务架构， 需要考虑的设计与成本并不小， 对千没有足够经验的团队来说， 甚至要比单体应用付出更多的代价。所以， 在很多情况下， 架构师都会以**演进的方式进行系统的构建**。 在初期， 以单体系统的方式来设计和实施， 一方面系统体量初期并不会很大， 构建和维护成本都不高。 另一方面， 初期的核心业务在后期通常也不会发生巨大的改变。 随着系统的发展或者业务的需要， 架构师会将一些经常变动或是有一定时间效应的内容进行微服务处理， 并逐渐将原来在单体系统中多变的模块逐步拆分出来， 而稳定不太变化的模块就形成一个核心微服务存在于整个架构之中。

## Spring Cloud

### 业界对微服务的贡献

- **服务治理：**阿里巴巴开源的[Dubbo](https://github.com/apache/incubator-dubbo)和当当网在其基础上扩展的[DubboX](https://github.com/dangdangdotcom/dubbox)、 Netflix的[Eureka](https://github.com/Netflix/eureka)、Apache的[Consul](https://github.com/hashicorp/consul)等。
- **分布式配置管理：**百度的[Disconf](https://github.com/knightliao/disconf)、 Netflix的[Archaius](https://github.com/Netflix/archaius)、360的[QConf](https://github.com/Qihoo360/QConf)、SpringCloud的[Config](http://cloud.spring.io/spring-cloud-config/single/spring-cloud-config.html)、 淘宝的[Diamond](https://blog.csdn.net/u013970991/article/details/52088350)等。
- **批量任务：**当当网的[Elastic-Job](https://github.com/elasticjob/elastic-job-lite)、 Linkedln的[Azkaban](https://github.com/azkaban/azkaban)、 SpringCloud的[Task](http://spring.io/projects/spring-cloud-task)等。
- **服务跟踪：**京东的[Hydra](https://www.oschina.net/p/jd-hydra)、SpringCloud的[Sleuth](https://cloud.spring.io/spring-cloud-sleuth/)、Twitter的[Zipkin](https://github.com/openzipkin/zipkin)等。
- ．．．．．．

### Spring Cloud简介

Spring Cloud是 一个基千Spring Boot实现的微服务架构开发 工具。 它为微服务架构中涉及的配置管理、 服务治理、 断路器、 智能路由、 微代理、 控制总线、 全局锁、 决策竞选、分布式会话和集群状态管理等操作提供了 一种简单的开发方式。SpringCloud包含了多个子项目（针对分布式系统中涉及的多个不同开源产品，还可能会新增）， 如下所述。

- SpringCloudConfg: 配置管理工具， 支持使用Git存储 配置内容， 可以使用它实现应用配置的外部化存储， 并支持客户端配置信息刷新、 加密／解密配置内容 等。
- SpringCloudNetflix: 核心 组件， 对多个Netflix OSS开源套件进行整合。

> Eureka: 服务治理组件， 包含服务注册中心、 服务注册与发现机制的实现。
> Hystrix: 容错管理组件，实现断路器模式， 帮助服务依赖中出现的延迟和为故障提供强大的容错能力。
> Ribbon: 客户端负载均衡的服务调用组件。
> Feign: 基于Ribbon和Hystrix的声明式服务调用组件。
> Zuul: 网关组件， 提供智能路由、 访问过滤等功能。
> Archaius: 外部化配置组件。

- Spring Cloud Bus: 事件、 消息总线， 用于传播集群中的状态变化或事件， 以触发后续的处理， 比如用来动态刷新配置等。
- Spring Cloud Cluster: 针对 ZooKeeper、 Redis、 Hazelcast、 Consul 的选举算法和通用状态模式的实现。
- Spring Cloud Cloudfoundry: 与 Pivotal Cloudfundry 的整合支持。
- Spring Cloud Consul: 服务发现与配置管理工具。
- Spring Cloud Stream: 通过 Redis、 Rabbit 或者 Kafa 实现的消费微服务， 可以通过简单的声明式模型来发送和接收消息。
- Spring Cloud AWS: 用千简化整合 Amazon Web Service 的组件。
- Spring Cloud Security: 安全工具包， 提供在 Zuul 代理中对 OAuth2 客户端请求的中继器。
- Spring Cloud Sleuth: Spring Cloud 应用的分布式跟踪实现， 可以完美整合 ZipKin。
- Spring Cloud ZooKeeper: 基于 ZooKeeper 的服务发现与配置管理组件。
- Spring Cloud Starters: Spring Cloud 的基础组件， 它是基于 Spring Boot 风格项目的基础依赖模块。
- Spring Cloud CLI: 用于在 Groovy 中快速创建 Spring Cloud 应用的 Spring Boot CLI插件。
- ． ．．．．．．


## Spring Boot构建微服务

SpringBoot的宗旨并非要重写Spring或是替代Spring, 而是希望通过设计大量的自动化配置等方式来简化Spring原有样板化的配置，使得开发者可以快速构建应用。**Spring Cloud 的构建基于 Spring Boot 实现。**Spring Boot自身的优点：如自动化配置、 快速开发、 轻松部署等， 非常适合用作微服务架构中各项具体微服务的开发框架。所以我们强烈推荐使用 Spring Boot 来构建微服务， 它不仅可以帮助我们快速地构建微服务， 还可以轻松简单地**整合 Spring Cloud 实现系统服务化**， 而如果使用了传统的 Spring 构建方式的话， 在整合过程中我们还需要做更多的依赖管理工作才能让它们完好地运行起来。

### 启动Spring Boot应用的方式

- 作为一个Java应用程序， 可以直接通过运行拥有**main函数**的类来启动。
- 执行Maven命令`mvn spring-boot:run `启动应用
- 在服务器上部署运行时， 通常先使用 mvn ins七all 将应用打包成 jar包， 再通过`java -jar xxx. jar`来启动应用。

### Spring Boot配置

Spring Boot 的默认配置文件位置为 src/main/resources/application.properties.

**命令行参数**：在用命 令 行 方 式 启 动 Spring Boot 应 用 时， 连续的两个减号－－就 是对application.properties中的属性值进行赋值的标识。所以，java -jar xxx.jar--server.port=8888命令，等价于在 application.properties 中添加属性server.port= 8888。

**多环境配置**: 在 Spring Boot 中， 多环境配置的文件名需要满足 application-{profile}.properties的格式， 其中{profile}对应你的环境标识， 如下所示。

- application-dev.properties: 开发环境。
- application-test.properties: 测试环境。
- application-prod.properties: 生产环境。

至于具体哪个配置文件会被加载， 需要在 application.properties 文件中通过spring.profiles.active 属性来设置， 其 值 对应配置文件中的{profile}值。 如spring.profiles.active= test 就会加载 application-test.properties配置文件内容。

### 加载顺序

在上面的例子中， 我们将Spring Boot应用需要的配置内容都放在了项目工程中， 已经能够通过spring.profiles.active或是通过Maven来实现多环境的支待。 但是， 当团队逐渐壮大， 分工越来越细致之后， 往往不需要让开发人员知道测试或是生产环境的细节， 而是希望由每个环境各自的负责人(QA或是运维）来集中维护这些信息。 那么如果还是以这样的方式存储配置内容， 对于不同环境配置的修改就不得不去获取工程 内容来修改这些配置内容， 当应用非常多的时候就变得非常不 方便。 同时， 配置内容对 开发人员都可见， 这本身也是一种安全隐患。 对此， 出现了很多将 配置内容外部化的框架和工具， 后续将要介绍的Spring Cloud Config 就是其中之一， 为了后续能更好地理解 Spring CloudConfg的加载机制， 我们需要对Spring Boot对数据文件的加载机制有一定的了解。为了能够更合理地重写各属性的值，SpringBoot 使用了下面这种较为特别的属性加载顺序：

1. 在命令行中传入的参数。
2. SPRING APPLICATION JSON中的属性。 SPRING_APPLICATION—JSON是以JSON格式配置在系统环境变量中的内容。
3. java:comp/env中的JNDI 属性。
4. Java的系统属性， 可以通过System.getProperties()获得的内容。
5. 操作系统的环境变量 。
6. 通过random.* 配置的随机属性。
7. 位于当前应用 jar 包之外， 针对不同{profile}环境的配置文件内容， 例如application-{profile}.properties或是YAML定义的配置文件。
8. 位于当前应用jar包之内 ， 针对不同{profile}环境的配置文件内容，例如application-{profile}.properties或是YAML定义的配置文件。
9. 位于当前应用jar包之外的application.properties和YAML配置内容。
10. 位于当前应用jar包之内的application.properties和YAML配置内容。
11. 在@Configuration注解修改的类中，通过@PropertySource注解定义的属性。
12. 应用默认属性，使用SpringApplication.setDefaultProperties 定义的内容。

优先级按上面的顺序由高到低， 数字越小优先级越高。可以看到，其中第7项和第9项 都是从应用jar包之外读取配置文件，所以，实现外部化配置的原理就是从此切入，为其指定外部配置文件的加载位置来取代jar包之内的配置内容。 通过这样的实现，我们的工程在配置中就变得非常干净，只需在本地放置开发需要的配置即可， 而不用关心其他环境的配置，由其对应环境的负责人去维护即可。

## 监控与管理

在微服务架构中， 我们将原本庞大的单体系统拆分成多个提供不同服务的应用。 虽然各个应用的内部逻辑因分解而得以简化，但是由于部署应用的数量成倍增长，使得系统的维护复杂度大大提升。 对于运维人员来说，随着应用的不断增多， 系统集群中出现故障的频率也变得越来 越高，虽然在高可用机制的保护下，个别故障不会影响系统的对外服务，但是这些频繁出现的故障需要被及时发现和处理才能长期保证系统处千健康可用状态。 为了能对这些成倍增长的应用做到高效运维，传统的运维方式显然是不合适的， 所以我们需要实现一套自动化的监控 运维机制，而这套机制的运行基础就是不间断地收集各个微服务应用的各项 指标情况，并根据这些基础指标信息来制定监控和预警规则，更进 一步甚至做到一些自动化的运维操作等。

当我们决定用Spring Boot来作为微服务框架时，除了它强大的快速开发功能之外，还因为它在Starter POMs中提供了 一个特殊依赖模块spring-boot-starter-actu aor 。引入该模块能够自动为 Spring Boot 构建的应用提供 一系列用千监控的端点。 同时， SpringCloud 在实现各个微服务组件的时候， 进一步为该模块做了不少扩展， 比如， 为原生端点增加了更多的指标和度量信息（比如在整合 Eureka 的时候会为/health 端点增加相关的信息）， 并且根据不同的组件还提供了更多有空的端点（比如， 为 API 网关组件 Zuul 提供了 /routes 端点来返回路由信息）。spring-boot-starter-actuator 模块的实现对千实施微服务的中小团队来说，
可以有效地省去或大大减少监控系统在采集应用指标时的开发量。 当然， 它也并不是万能的， 有时候也需要对其做 一些简单的扩展来帮助我们实现自身系统个性化的监控需求。 所以， 在本节将详细介绍 一些关于 spring-boot-starter-actuator 模块的内容， 包括原生提供的端点以及 一些常用的扩展和配置方式等。

**关于[actuator](https://blog.csdn.net/love3765/article/details/79291584)的使用，此处略过**

## Spring Cloud Eureka 服务治理

