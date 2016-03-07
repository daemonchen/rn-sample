# rn-sample
这是我创业的时候做的项目，项目失败了，代码也没什么用了。。

# 你造么react-native项目

> 项目使用[react-native](http://facebook.github.io/react-native/)开发,采用flux架构

> ios项目禁用了NSAppTransportSecurity，后期考虑配合服务端一起升级https，再启用

> ios如果需要加入第三方依赖，使用pod来做依赖管理

## 项目目录

```
app--应用根目录
 |
 |--actions
 |--common
 |--constants
 |--mixins
 |--models
 |--services
 |--stores
 |--views
 ```

`ios--存放ios的xcode工程 - WIP`

`android--存放android工程 - pending`


## guide line

- 使用rn的createClass来创建class，不要使用es6的

- 频繁使用的动画，要使用setNativeProps来减少view的render性能消耗

- view按照页面来划分子目录

- 所有的请求，都统一放在service里处理，项目开发初期，没有加如缓存，后期考虑在service层增加缓存

- 避免过于复杂的flux数据流，尽量少用ref

- scrollview的 alignItems 和 justifyContent 样式属性不能直接写在scrollview的样式上，要在contentContainerStyle里使用。否则开发模式下会报错崩溃；原因参看scrollview源码383行

- 发版本要打tag `git tag -a v0.1.2 -m “v0.1.2”`

### dive in & have fun !!