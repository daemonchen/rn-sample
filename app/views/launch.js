'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var {View, Text, Image, ScrollView, StyleSheet, TouchableHighlight} = React;


//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

// Actions.tabbar
var testLaunchImageList = [
{
    imgUrl:require('../images/test/2.png')
},
{
    imgUrl:require('../images/test/3.png')
},
{
    imgUrl:require('../images/test/4.png')
}
];
var Launch = React.createClass({
    mixins: [TimerMixin],

    //默认值
    getDefaultProps: function () {
        return {
            width: width,
            indicatorColor: '#ffffff',
            inactiveIndicatorColor: '#ffffff',
            timer: 5000
        }
    },

    //初始化用于状态转换的值
    getInitialState: function () {
        return {
            currentX: 0,
            activePage: 0,
            dataSource: testLaunchImageList || []
        }
    },
    start: function () {

        var scrollView = this.refs.scrollView;
        var length = this.state.dataSource.length;

        this.timer = this.setInterval(function () {

            var activePage;

            if ((this.state.activePage + 1) >= length) {
                activePage = 0;
            } else {
                activePage = this.state.activePage + 1;
            }
            var currentX = this.props.width * activePage;
            scrollView.scrollResponderScrollTo(currentX, 0);

            this.setState({
                currentX: currentX,
                activePage: activePage
            });

        }, this.props.timer)
    },
    // componentWillReceiveProps: function (nextProps) {
    //     this.setState({
    //         dataSource: nextProps.scrollData || []
    //     });
    // },
    componentDidMount: function () {
        this.start();
    },
    componentWillUnmount: function () {
        this.clearInterval(this.timer);
    },
    //TODO 开始滚动时清除timer
    _onScrollBegin: function (event) {
        this.clearInterval(this.timer);
    },

    _onScrollEnd: function () {

    },
    _onPressButton: function(){
        //todo navigator.push stuff
    },
    //渲染单个图片
    renderItems: function (data) {
        var self = this;
        return data.map(function (item, i) {
            // return (
            //     <Image key={i} style={{width: width,height:height}} source={{uri: item.imgUrl}}/>
            // );
            return (
                <TouchableHighlight onPress={self._onPressButton.bind(self)}>
                    <Image key={i} style={{width: width,height:height}} source={item.imgUrl} />
                </TouchableHighlight>
            );
        })
    },

    render: function () {
        var data = this.state.dataSource;
        return (
            <View style={styles.container}>
                <ScrollView
                    ref='scrollView'
                    contentContainerStyle={styles.container}
                    automaticallyAdjustContentInsets={false}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.onAnimationEnd}
                    // onScrollBeginDrag={this._onScrollBegin}
                >
                    {this.renderItems(data)}
                </ScrollView>
                {this.renderPageIndicator()}
            </View>
        );
    },

    renderPageIndicator: function () {
        var indicators = [],
            style;

        for (var i = 0; i < this.state.dataSource.length; i++) {
            style = i === this.state.activePage ? {
                color: this.props.indicatorColor,
                opacity: 1
            } : {
                color: this.props.inactiveIndicatorColor,
                opacity: 0.3
            };
            indicators.push(<Text key={i} style={[style, {fontSize: 32}]}>&bull;</Text>)
        }

        return (
            <View style={styles.pageIndicator}>
            {indicators}
            </View>
        )
    },

    onAnimationEnd: function (e) {
        var activePage = e.nativeEvent.contentOffset.x / this.props.width;
        // console.log(e.nativeEvent)
        this.setState({
            currentX: e.nativeEvent.contentOffset.x,
            activePage: activePage
        });
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pageIndicator: {
        position: 'absolute',
        backgroundColor: 'transparent',
        width: width,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

module.exports = Launch;