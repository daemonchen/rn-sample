'use strict';

var alt = require('../../common/alt');
var Actions = require('react-native-router-flux').Actions;

class homeTabStore {
    constructor() {
        this.page = {};
        this.mode = null;
        Actions.homeTabSwitch = alt.createAction('homeTabSwitch', (x)=>x);
        this.bindListeners({
            onHomeTabSwitch: Actions.homeTabSwitch
        });
    }

    onHomeTabSwitch(page){
        this.mode = 'homeSwitch';
        this.page = page;
    }

}

module.exports = alt.createStore(homeTabStore);