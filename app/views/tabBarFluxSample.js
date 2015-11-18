'use strict';

var React = require('react-native');
var {View, TabBarIOS, Text, StyleSheet} = React;
var {Actions, ContainerStore} = require('react-native-router-flux');

class TabBarFlux extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.children = {};
    }
    onSelect(el){
        Actions.switch({name: el.props.name, data:el.props});
        return {selected: true};
    }
    onTabIndex(el, index){
        // this.setState({ tabIndex: index});
        Actions.switch({name: el.props.name, data:el.props});
    }
    render(){
        var children = [];
        var self = this;
        React.Children.forEach(this.props.children, function(el, index){
            if (!el.props.name)
                console.error("No name is defined for element");
            // var Icon = el.props.icon || console.error("No icon class is defined for "+el.name);
            children.push(
                <TabBarIOS.Item
                icon={el.props.icon}
                selectedIcon={el.props.selectedIcon}
                title={el.props.title}
                selected={self.state.tabIndex === index}
                onPress={() => {
                  self.onTabIndex(el, index);
                }} />
           );
        });

        return (
            <TabBarIOS style={{backgroundColor:'white'}}>
                {children}
            </TabBarIOS>
        );
    }
}

module.exports = TabBarFlux;