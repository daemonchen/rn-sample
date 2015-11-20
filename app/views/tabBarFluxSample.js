'use strict';

var React = require('react-native');
var {View, TabBarIOS, Text, StyleSheet} = React;
var {Actions, ContainerStore} = require('react-native-router-flux');

var TabBarFlux = React.createClass({
    // getDefaultProps: function(){
    //     return{
    //         children:{}
    //     }
    // },
    getInitialState: function(){
        return{
            tabIndex: 0
        }
    },
    render: function(){
        var children = [];
        var self = this;
        React.Children.forEach(this.props.children, function(el, index){
            if (!el.props.name)
                console.error("No name is defined for element");
            children.push(
                <TabBarIOS.Item
                icon={el.props.icon}
                selectedIcon={el.props.selectedIcon}
                title={el.props.title}
                selected={self.state.tabIndex === index}
                onPress={() => {
                  self.onTabIndex(el, index);
                }}>
                    <View />
                </TabBarIOS.Item>
           );
        });

        return (
            <TabBarIOS style={{backgroundColor:'white'}}>
                {children}
            </TabBarIOS>
        );
    },
    onTabIndex: function(el, index){
        this.setState({ tabIndex: index});
        Actions.switch({name: el.props.name, data:el.props});
    }
});

module.exports = TabBarFlux;