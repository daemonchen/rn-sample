var React = require('react-native')
var Dimensions = require('Dimensions')
var moment = require('moment');
var toast = require('./toast');
var {
    AlertIOS,
    NativeModules,
    Linking
} = React

var UIImagePickerManager = NativeModules.UIImagePickerManager;
var GeTuiManager = NativeModules.GeTuiManager;
var QiniuManager = NativeModules.QiniuManager;
var UMengManager = NativeModules.UMengManager;

module.exports = {
    getParams: function(url){
        var result = {};
        try{
            var ret = url.split('&');
            for (var i = 0; i < ret.length; i++) {
                var s = ret[i].split('=');
                result[s[0]] = s[1];
            };
        }catch(e){
            console.log(e);
        }
        return result;
    },
    toast: function(msg){
        toast.showShortCenter(msg);
    },
    wechatSessionShare: function(data, callback){
        UMengManager.wechatSessionShare(data, callback);
    },
    presentSnsIconSheetView: function(data, callback){
        UMengManager.presentSnsIconSheetView(data, callback);
    },
    logPage: function(page){
        UMengManager.logPage(page);
    },
    endLogPageView: function(page){
        UMengManager.endLogPageView(page);
    },
    logEvent: function(event, data){
        UMengManager.logEvent(event, data);
    },
    getClientId: function(callback){
        return GeTuiManager.getClientId(function(id){
            !!id && callback(id);
        });
    },
    uploadToQiniu: function(uri,key,token,params,callback){
        var self = this;
        console.log('-----upload params:', params);
        QiniuManager.uploadToQiniu(uri,key,token,params,function(result){
            if (!result) {
                self.alert('上传图片失败，请稍后再试');
                return;
            };
            // self.alert('上传图片成功');
            callback(result);
        });
    },
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
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
          } else {
            return Linking.openURL(url);
          }
        }).catch(err => console.error('An error occurred', err));
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
            return moment(timestamp).format('HH:mm')
        }
        if (moment().valueOf() - timestamp > 24 * 60 * 60 * 1000){
            return moment(timestamp).format('MM月DD日');
        }
    },
    launchImageLibrary: function(customerOptions, callback){
        var defaultOptions = {
          title: '添加附件', // specify null or empty string to remove the title
          cancelButtonTitle: '取消',
          takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
          chooseFromLibraryButtonTitle: '选择图片', // specify null or empty string to remove this button
          maxWidth: 20000,
          maxHeight: 20000,
          quality: 1,
          allowsEditing: false, // Built in iOS functionality to resize/reposition the image
          noData: true, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
          storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
            skipBackup: true, // image will NOT be backed up to icloud
            path: 'images' // will save image at /Documents/images rather than the root
          }
        };
        var options = Object.assign(defaultOptions, customerOptions);

        UIImagePickerManager.launchImageLibrary(options, (didCancel, response) => {
            // console.log('Response = ', response);

            if (didCancel) {
                console.log('User cancelled image picker');
            }
            else {
                callback(response)
                // You can display the image using either:
                // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
            }
        });
    },
    launchCamera: function(customerOptions, callback){
        var defaultOptions = {
          title: '添加附件', // specify null or empty string to remove the title
          cancelButtonTitle: '取消',
          takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
          chooseFromLibraryButtonTitle: '选择图片', // specify null or empty string to remove this button
          maxWidth: 20000,
          maxHeight: 20000,
          quality: 1,
          allowsEditing: false, // Built in iOS functionality to resize/reposition the image
          noData: true, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
          storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
            skipBackup: true, // image will NOT be backed up to icloud
            path: 'images' // will save image at /Documents/images rather than the root
          }
        };
        var options = Object.assign(defaultOptions, customerOptions);

        UIImagePickerManager.launchCamera(options, (didCancel, response) => {
            // console.log('Response = ', response);

            if (didCancel) {
                console.log('User cancelled image picker');
            }
            else {
                callback(response)
                // You can display the image using either:
                // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
            }
        });
    },
    showPhotoPicker: function(customerOptions, callback){
        var defaultOptions = {
          title: '添加附件', // specify null or empty string to remove the title
          cancelButtonTitle: '取消',
          takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
          chooseFromLibraryButtonTitle: '选择图片', // specify null or empty string to remove this button
          maxWidth: 20000,
          maxHeight: 20000,
          quality: 1,
          allowsEditing: false, // Built in iOS functionality to resize/reposition the image
          noData: true, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
          storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
            skipBackup: true, // image will NOT be backed up to icloud
            path: 'images' // will save image at /Documents/images rather than the root
          }
        };
        var options = Object.assign(defaultOptions, customerOptions);

        UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
            // console.log('Response = ', response);

            if (didCancel) {
                console.log('User cancelled image picker');
            }
            else {
                callback(response)
                // You can display the image using either:
                // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
            }
        });
    },
    parseStringToJson: function(stringArray){
        var str = unescape(stringArray);
        var jsonStr = str.replace(/'/g, '"');
        return JSON.parse(jsonStr);
    }
};