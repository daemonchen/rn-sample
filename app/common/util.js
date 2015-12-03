var React = require('react-native')
var Dimensions = require('Dimensions')
var moment = require('moment');

var {
    AlertIOS,
    LinkingIOS
} = React

module.exports = {
    getObjectKeysAlphabetical: function(obj) {
        var keys = [],
            key;

        for (key in obj) {
            if (obj.hasOwnProperty(key))
                keys.push(key);
        }

        keys.sort();

        return keys;
    },
    stringifyObjectAlphabetical: function(obj){
        var result = '';
        var keys = this.getObjectKeysAlphabetical(obj);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            val = obj[key]; //Get the value of the property here.
            result += key + val;
        }
        return result;
    },
    getDimensions: function(){
    // The Dimensions API may change, so I move to a single module
    // use this method like this:
    // var { width, height } = Util.get()
        return Dimensions.get('window')
    },
    alert: function(content){
        AlertIOS.alert(content)
    },
    link: function(url){
        LinkingIOS.canOpenURL(url, (supported) => {
            if (!supported) {
                console.warn("Can't support the url")
            } else {
                LinkingIOS.openURL(url)
            }
        })
    },
    parseImgUrl: function(url){
        if (/^\/\/.*/.test(url)) {
            url = 'http:' + url
        }
        return url
    },
    getRating: function(rating){
        if(rating > 5 || rating < 0) throw new Error('数字不在范围内');
        return "★★★★★☆☆☆☆☆".substring(5 - rating, 10 - rating );
    },
    formatTimestamp: function(timestamp){
        if (moment().valueOf() - timestamp < 24 * 60 * 60 * 1000) {
            return moment(timestamp).format('HH:SS')
        }
        if (moment().valueOf() - timestamp > 24 * 60 * 60 * 1000){
            return moment(timestamp).format('MM月DD日');
        }
    }
};