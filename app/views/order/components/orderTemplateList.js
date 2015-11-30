'use strict';
var React = require('react-native')
var SearchBar = require('react-native-search-bar');
var Swipeout = require('react-native-swipeout');
var {
    Text,
    View,
    ListView,
    Image,
    Navigator,
    ScrollView,
    TouchableHighlight,
    StyleSheet
} = React
/*
orderStatus:enum
0: create
1: update
2: normal
*/
var commonStyle = require('../../../styles/commonStyle');

module.exports = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(['row 1', 'row 2'])
        }
    },
    renderRow: function(rowData){
        var swipeoutBtns = [
          {
            text: '删除',
            type: 'delete',
            onPress: this.onDelete
            // backgroundColor: ''
          }
        ]
        return(
            <Swipeout autoClose={true}
            right={swipeoutBtns}
            backgroundColor='transparent' >
                <TouchableHighlight underlayColor='#eee'
                onPress={() => this.props.onPressRow(rowData)} >
                    <View style={styles.templateItem}>
                        <Text style={commonStyle.paddingHorizontal}>订单模版</Text>
                    </View>
                </TouchableHighlight>
            </Swipeout>
            );
    },
    render: function(){
        return(
            <ScrollView style={commonStyle.container}
            contentOffset={{y: 44}}
            contentInset={{bottom: 40}}
            automaticallyAdjustContentInsets={false} >
                <SearchBar
                    placeholder='Search'
                    textFieldBackgroundColor='#fff'
                    barTintColor='#bdbdbd'
                    tintColor='#333' />
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow} />
            </ScrollView>
            );
    }
});

var styles = StyleSheet.create({
    templateItem: {
        paddingVertical: 16
    }
});