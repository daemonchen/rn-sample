'use strict';
var React = require('react-native')
var {Text, View, ListView} = React
var RefreshableListView = require('react-native-refreshable-listview')

// var ArticleStore = require('../stores/ArticleStore')
// var StoreWatchMixin = require('./StoreWatchMixin')
// var ArticleView = require('./ArticleView')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}) // assumes immutable objects

var homeList = React.createClass({
  getInitialState() {
    return {dataSource: ds.cloneWithRows(ArticleStore.all())}
  },
  reloadArticles() {
    return ArticleStore.reload() // returns a Promise of reload completion
  },
  renderArticle(article) {
    return <ArticleView article={article} />
  },
  render() {
    return (
      <RefreshableListView
        dataSource={this.state.dataSource}
        renderRow={this.renderArticle}
        loadData={this.reloadArticles}
        refreshDescription="Refreshing articles" />
    )
  }
})