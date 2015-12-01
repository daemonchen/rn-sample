var React = require('react-native')

var AsyncStorage = React.AsyncStorage

module.exports = {
    setItem: async function(key, value){
        if (value == null) return Promise.reject('value is null')
            console.log('setItem:', key, value);
        return await AsyncStorage.setItem(key, JSON.stringify(value))
    },
    getItem: async function(key){
        var result = await AsyncStorage.getItem(key)
        // var result = AsyncStorage.getItem(key)
            .then(function (value) {
                return JSON.parse(value)
            })

        return result
    },
    clear: function(){
        AsyncStorage.clear()
    },
    removeItem: function(key){
        AsyncStorage.removeItem(key);
    }
}

// Storage.multiGet = function (keys) {
//     return AsyncStorage.multiGet(keys)
//         .then(results => {
//             return results.map(item => {
//                 return [item[0], JSON.parse(item[1])]
//             })
//         })
// }

// Storage.multiRemove = function (keys) {
//     return AsyncStorage.multiRemove(keys)
// }
