'use strict';

var alt = require('../../common/alt');
var systemAction = require('../../actions/system/systemAction');
var systemService = require('../../services/system/systemService')
var asyncStorage = require('../../common/storage');
var util = require('../../common/util');
class SystemStore {
    constructor() {
        this.bindActions(systemAction);
        this.state = {};
    }

    onInit(data) {
        var obj = Object.assign({}, data);
        util.getClientId((id)=>{
            obj.clientId = id;
            systemService.system(obj)
            .then((responseData) => {
                console.log('---systemstore result:', responseData);
                systemAction.initSuccess(responseData)
            }).done();

            this.preventDefault();
        });
        this.preventDefault();
    }
    onInitSuccess(data){
        if (!data) {return false};
        data.type = 'init'
        this.setState(data);
    }
}

module.exports = alt.createStore(SystemStore, 'SystemStore');