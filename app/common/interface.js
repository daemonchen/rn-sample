var NZAOM_API_DOMAIN = 'http://api.nzaom.com';
var NZAOM_DOMAIN = 'http://www.nzaom.com';
var NZAO_MOBILE_DOMAIN = 'http://m.nzaom.com'
var _debug = false; //上线的时候改成false
if (!!_debug) {
    //NZAOM_API_DOMAIN = "http://192.168.1.196:8888";
    NZAOM_API_DOMAIN = "http://192.168.1.147:8888";

    NZAO_MOBILE_DOMAIN = 'http://192.168.1.147:3000'
        //NZAOM_API_DOMAIN=NZAOM_DOMAIN;
}
var INTERFACE = {
    mobileDomain: NZAO_MOBILE_DOMAIN,
    apiDomain: NZAOM_API_DOMAIN,
    domain: NZAOM_DOMAIN,
    jssign: NZAOM_API_DOMAIN + '/api/weixin/jssign',

    /*---member login & register---*/
    login: NZAOM_API_DOMAIN + '/api/user/login',
    register: NZAOM_API_DOMAIN + '/api/user/register',
    loginNew: NZAOM_API_DOMAIN + '/api/user/loginNew',
    registerNew: NZAOM_API_DOMAIN + '/api/user/registerNew',
    registerCode: NZAOM_API_DOMAIN + '/api/user/registerCode',
    logout: NZAOM_API_DOMAIN + '/api/user/loginout',
    findpwdCode: NZAOM_API_DOMAIN + '/api/user/findpwdCode',
    validateCode: NZAOM_API_DOMAIN + '/api/user/validateCode',
    resetPwd: NZAOM_API_DOMAIN + '/api/user/resetPwd',
    authorize: NZAOM_API_DOMAIN + '/api/social/authorize',
    socialLogin: NZAOM_API_DOMAIN + '/api/social/login',
    feedback: NZAOM_API_DOMAIN + '/api/feedback',

    /*----member center stuff----*/
    ordercancel: NZAOM_API_DOMAIN + '/api/order/cancel',
    myallorderlist: NZAOM_API_DOMAIN + '/api/order/bought_list',
    myallorderdetail: NZAOM_API_DOMAIN + '/api/order/bought_detail',
    setmessagestate: NZAOM_API_DOMAIN + '/api/message/msgread',
    balancewithdraw: NZAOM_API_DOMAIN + '/api/wealth/balanceApply',
    getbalance: NZAOM_API_DOMAIN + '/api/cash/init',
    applaycode: NZAOM_API_DOMAIN + '/api/cash/apply_code',
    applaycodevalidator: NZAOM_API_DOMAIN + '/api/cash/apply_code_validator',
    applaycash: NZAOM_API_DOMAIN + '/api/cash/apply_cash',

    consumedetail: NZAOM_API_DOMAIN + '/api/wealth/consumeDetail',
    newaddress: NZAOM_API_DOMAIN + '/api/address/save_address',
    deleteaddress: NZAOM_API_DOMAIN + '/api/address/address_delete',
    eidtaddress: NZAOM_API_DOMAIN + '/api/address/update_address',
    defaultaddress: NZAOM_API_DOMAIN + '/api/address/default_address',
    myaddresslist: NZAOM_API_DOMAIN + '/api/address/list_address',
    getstreet: NZAOM_API_DOMAIN + '/api/division/addr',
    getdivision: NZAOM_API_DOMAIN + '/api/division',
    mybalance: NZAOM_API_DOMAIN + '/api/wealth/balance',
    mycount: NZAOM_API_DOMAIN + '/api/wealth/consumeList',
    mycountv2: NZAOM_API_DOMAIN + '/api/wealth/consume_list/v2',
    shares: NZAOM_API_DOMAIN + '/api/wealth/shares',
    sharesMy: NZAOM_API_DOMAIN + '/api/wealth/shares/my',
    sharesv2: NZAOM_API_DOMAIN + '/api/wealth/shares/v2',
    messages: NZAOM_API_DOMAIN + '/api/message',
    deletemsg: NZAOM_API_DOMAIN + '/api/message/msgdelete',
    points: NZAOM_API_DOMAIN + '/api/wealth/points',
    coupons: NZAOM_API_DOMAIN + '/api/wealth/coupons',
    couponsv2: NZAOM_API_DOMAIN + '/api/wealth/coupons/v2',
    load: NZAOM_API_DOMAIN + '/api/person/load',
    resetPwd: NZAOM_API_DOMAIN + '/api/user/resetPwd',
    resetPwdNew: NZAOM_API_DOMAIN + '/api/user/resetPwdNew',
    updatePassword: NZAOM_API_DOMAIN + '/api/user/update_password',
    updatePasswordNew: NZAOM_API_DOMAIN + '/api/user/updatePasswordNew',
    updateAvatar: NZAOM_API_DOMAIN + '/api/person/update_avatar',
    updateNick: NZAOM_API_DOMAIN + '/api/person/update_nick',
    updateGender: NZAOM_API_DOMAIN + '/api/person/update_sex',
    emailcode: NZAOM_API_DOMAIN + '/api/person/email_code',
    updateemail: NZAOM_API_DOMAIN + '/api/person/update_email',
    mobilecode: NZAOM_API_DOMAIN + '/api/person/mobile_code',
    updatemobile: NZAOM_API_DOMAIN + '/api/person/update_mobile',
    activeCoupons: NZAOM_API_DOMAIN + '/api/wealth/active_coupons',

    /*home stuff*/
    guideList: NZAOM_API_DOMAIN + '/api/guide/list',
    guideNavigation: NZAOM_API_DOMAIN + '/api/guide/navigation',
    guideHome: NZAOM_API_DOMAIN + '/api/guide/home',

    /*---products stuff---*/
    home: NZAOM_API_DOMAIN + '/api/home',
    praise: NZAOM_API_DOMAIN + '/api/home/praise',
    item: NZAOM_API_DOMAIN + '/api/item',

    /*---cart stuff---*/
    add: NZAOM_API_DOMAIN + '/api/cart/add',
    list: NZAOM_API_DOMAIN + '/api/cart/list',
    delete: NZAOM_API_DOMAIN + '/api/cart/delete',
    update: NZAOM_API_DOMAIN + '/api/cart/update',


    /*---buy action stuff---*/
    dobuy: NZAOM_API_DOMAIN + '/api/buy/dobuy',
    submitOrder: NZAOM_API_DOMAIN + '/api/buy/submitOrder',
    payNow: NZAOM_API_DOMAIN + '/api/pay/payNow',
    confirmPay: NZAOM_API_DOMAIN + '/api/pay/confirm_pay',
    weixinOpenid: NZAOM_API_DOMAIN + '/api/pay/weixin_openid',
    confirm_receive: NZAOM_API_DOMAIN + '/api/order/confirm_receive',

    /*--- get address info ---*/

    address: NZAOM_API_DOMAIN + '/api/address/address',



    /*---activity---*/
    xmanPublish: NZAOM_API_DOMAIN + '/api/activity/xman/publish',
    xmanInfo: NZAOM_API_DOMAIN + '/api/activity/xman/',
    xmanCoupon: NZAOM_API_DOMAIN + '/api/activity/xman/coupon',
    dapeiUpload: NZAOM_API_DOMAIN + '/api/activity/ctest/upload',
    dapeiCoupon: NZAOM_API_DOMAIN + '/api/activity/ctest/coupon',

    /*--- 获取服务器时间 ---*/
    qrcodeCreate: NZAOM_API_DOMAIN + '/api/qrcode/create',
    time: NZAOM_API_DOMAIN + '/api/system/time'
}

module.exports = INTERFACE;