# rn-sample
这是我创业的时候做的项目，项目失败了，代码也没什么用了。。

# 你造么react-native项目

> 项目使用[react-native](http://facebook.github.io/react-native/)开发

> ios项目禁用了NSAppTransportSecurity，后期考虑配合服务端一起升级https，再启用

> ios如果需要加入第三方依赖，使用pod来做依赖管理

## 项目目录

```
App--应用根目录
 |
 |--Actions
 |--Common
 |--Constants
 |--Mixins
 |--Models
 |--Services
 |--Stores
 |--Views
 ```

`ios--存放ios的xcode工程 - WIP`

`android--存放android工程 - pending`


## guide line

- 使用rn的createClass来创建class，不要使用es6的

- 频繁使用的动画，要使用setNativeProps来减少view的render性能消耗

- view按照页面来划分子目录

- 所有的请求，都统一放在service里处理，项目开发初期，没有假如缓存，后期考虑在service层增加缓存

- 避免过于复杂的flux数据流，尽量少用ref

### dive in & have fun !!
