'use strict';

var NZAOM_API_DOMAIN = 'http://www.nzaom.com';
var NZAOM_DOMAIN = 'http://www.nzaom.com';
var NZAO_MOBILE_DOMAIN = 'http://m.nzaom.com'
var _debug = false; //上线的时候改成false
if (!!_debug) {
    NZAOM_API_DOMAIN = "http://192.168.1.196";
    // NZAOM_API_DOMAIN = "http://192.168.1.109";
    // NZAOM_API_DOMAIN = "http://192.168.1.147";

    // NZAO_MOBILE_DOMAIN = 'http://192.168.1.147'
        //NZAOM_API_DOMAIN=NZAOM_DOMAIN;
}
module.exports = {
    verifycode: NZAOM_API_DOMAIN + '/api/verifycode',
    user: NZAOM_API_DOMAIN + '/api/user',
    login: NZAOM_API_DOMAIN + '/api/login',
    token: NZAOM_API_DOMAIN + '/api/token',
    system: NZAOM_API_DOMAIN + '/api/system',
    password: NZAOM_API_DOMAIN + '/api/password',

    workbench: NZAOM_API_DOMAIN + '/api/v2/workbench',
    myTask: NZAOM_API_DOMAIN + '/api/tasks',
    report: NZAOM_API_DOMAIN + '/api/workbench/report',

    contacts: NZAOM_API_DOMAIN + '/api/contacts',
    customer: NZAOM_API_DOMAIN + '/api/customer',

    message: NZAOM_API_DOMAIN + '/api/message',

    messageCategories: NZAOM_API_DOMAIN + '/api/message/categories',

    messageCategory: NZAOM_API_DOMAIN + '/api/message/category',

    messageOrder: NZAOM_API_DOMAIN + '/api/message/order',

    messageSystem: NZAOM_API_DOMAIN + '/api/message/system',


    invite: NZAOM_API_DOMAIN + '/api/invite',

    apply: NZAOM_API_DOMAIN + '/api/apply',

    orderList: NZAOM_API_DOMAIN + '/api/orders',

    order: NZAOM_API_DOMAIN + '/api/order',

    orderStatus: NZAOM_API_DOMAIN + '/api/order/status',

    orderSchedule: NZAOM_API_DOMAIN + '/api/order/schedule',

    orderV2: NZAOM_API_DOMAIN + '/api/v2/order',

    orderExtra: NZAOM_API_DOMAIN + '/api/order_extra',

    updateTaskStatus: NZAOM_API_DOMAIN + '/api/order_job/over',

    task: NZAOM_API_DOMAIN + '/api/task',

    taskDenendences: NZAOM_API_DOMAIN + '/api/order/{orderId}/tasks',

    news: NZAOM_API_DOMAIN + '/api/dynamic',

    member: NZAOM_API_DOMAIN + '/api/order/{orderId}/members',

    accessory: NZAOM_API_DOMAIN + '/api/accessory',

    qiniuToken: NZAOM_API_DOMAIN + '/api/accessory/token',

    template: NZAOM_API_DOMAIN + '/api/template',

    comment: NZAOM_API_DOMAIN + '/api/rate',

    feedback: NZAOM_API_DOMAIN + '/api/feedback',

    factory: NZAOM_API_DOMAIN + '/api/factory',

    factorys: NZAOM_API_DOMAIN + '/api/factories',

    role: NZAOM_API_DOMAIN + '/api/role',

    avatar: NZAOM_API_DOMAIN + '/api/user/avatar',

    file: NZAOM_API_DOMAIN + '/api/file',

    shareOrder: NZAOM_API_DOMAIN + '/api/sharing',

    followOrder: NZAOM_API_DOMAIN + '/api/order/follow',

}