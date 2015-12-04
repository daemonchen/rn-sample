'use strict';

var alt = require('../../common/alt');
module.exports = alt.generateActions(
    'getList',
    'getListSuccess',
    'loadMore',
    'loadMoreSuccess',
    'delete',
    'deleteSuccess');