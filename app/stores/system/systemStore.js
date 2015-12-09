'use strict';

var alt = require('../../common/alt');
var systemAction = require('../../actions/system/systemAction');
var systemService = require('../../services/system/systemService')
var asyncStorage = require('../../common/storage');
class SystemStore {
    constructor() {
        this.bindActions(systemAction);
        this.state = {};
    }

    onInit(data) {
        systemService.system(data)
        .then((responseData) => {
            systemAction.initSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onInitSuccess(data){
        if (!data) {return false};
        data.type = 'init'
        this.setState(data);
    }
}

export default alt.createStore(SystemStore, 'SystemStore');