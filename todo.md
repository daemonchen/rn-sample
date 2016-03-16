- 将homeview里的hometabbar抽离出来，去掉react-native-scrollable-tab-view的默认tab，增加stickyHeaderIndices属性.

- 将homeview里，所有的请求都通过flux管理起来

<WIP>

- 增加pull up reload以及pu down refresh的动画效果

- 增加flux的UT

- 项目开发完成后，适当的补全model，方便代码阅读

- 去掉所有通过props传递的事件回调，改为flux方式触发

- 把所有的asyncstorage统一存放在一个对象下:appConstant。

- 把route抽取出来，通过flux来触发navigation

- 把友盟的pv统计，放在router里做

ps: 如果遇到babelrc文件错误，删掉报错的babel文件即可

`find node_modules -type f -name '.babelrc' | grep -v 'node_modules/react-native/packager/react-packager/.babelrc' | xargs rm`

ps: [rn0.15到0.16升级方法](https://gist.github.com/plougsgaard/33297a026ed549d910af)

swipeout & rn panresponseder bug: 打开swipeout组件的index.js文件，109行；修改为：
`, _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
  if (gestureState.dx === 0 || gestureState.dy === 0) {
      return false;
    }
    return true;
  }`

  - 需要单独引入的组件:
    - [react-native-circle-progress](https://github.com/daemonchen/react-native-circle-progress)
    - [react-native-phone-picker](https://github.com/daemonchen/react-native-phone-picker) 由于增加了联系人姓名属性，所以用自己修改过的版本

- 给fetch函数增加timeout
    // Rough implementation. Untested.
    function timeout(ms, promise) {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          reject(new Error("timeout"))
        }, ms)
        promise.then(resolve, reject)
      })
    }

    timeout(1000, fetch('/hello')).then(function(response) {
      // process response
    }).catch(function(error) {
      // might be a timeout error
    })

- 搜索企业增加 无结果提示

- 重置密码之后，要直接登陆 <wip>