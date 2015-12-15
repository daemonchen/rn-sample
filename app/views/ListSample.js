'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var {View, Text, Navigator, ScrollView, StyleSheet} = React;

var Article = React.createClass({
    render: function(){
        return (
            <View style={styles.container}>
                <Text style={[styles.text, styles.title]}>{this.props.title}</Text>
                <Text style={styles.text}>{this.props.author}</Text>
                <Text style={styles.text}>{this.props.time}</Text>
            </View>
        );
    }
});

var _navigator, _topNavigator = null;

var ListSample =  React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        var data = [
            {
                title: "React-Native入门指南",
                author: "vczero",
                time: "2015-06-28"
            },
            {
                title: "为什么世界不一样",
                author: "vczero",
                time: "2015-06-8"
            },
            {
                title: "你来，我就告诉你",
                author: "vczero",
                time: "2015-04-01"
            }
        ];
        return {
            articles: data
        };
    },
    render: function(){
        return(
            <ScrollView>
                {this.state.articles.map(function(article){
                return <Article title={article.title} author={article.author} time={article.time}/>
                })}
            </ScrollView>
        );
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main:{
        flex:1,
        borderTopWidth:1 / React.PixelRatio.get(),
        borderTopColor:'#e1e1e1',
        alignItems:'center'
    }
});

module.exports = ListSample;