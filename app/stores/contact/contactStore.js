'use strict';

var alt = require('../../common/alt');
var contactAction = require('../../actions/contact/contactAction');
var contactService = require('../../services/contact/contactService')
var asyncStorage = require('../../common/storage');
class ContactStore {
    constructor() {
        this.bindActions(contactAction);
        this.state = {};
    }

    onGetList(data) {
        contactService.getList(data)
        .then((responseData) => {
            contactAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(data){
        if (!data) {return false};
        data.type = 'get'
        this.setState(data);
    }
}

export default alt.createStore(ContactStore, 'ContactStore');