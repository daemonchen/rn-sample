- 将homeview里的hometabbar抽离出来，去掉react-native-scrollable-tab-view的默认tab，增加stickyHeaderIndices属性.

- 将homeview里，所有的请求都通过flux管理起来

<WIP>

- 增加pull up reload以及pu down refresh的动画效果

- 增加flux的UT

- 项目开发完成后，适当的补全model，方便代码阅读

- 去掉所有通过props传递的事件回调，改为flux方式触发

- 把所有的asyncstorage统一存放在一个对象下:appConstant。

- 把route抽取出来，通过flux来触发navigation