const DAYROOM = '全天房',
    HOURROOM = '时租房',
    SERVICECALL = "021-50881962";

//默认图片
var defaultHeadImg = '../img/iconfont-yonghu.svg';
//本地储存
var Storage = {
    get: function(key) {
        var object = sessionStorage.getItem(key);
        if (object) {
            object = JSON.parse(object);
        }
        return object;
    },
    set: function(key, object) {
        var i,
            o = Storage.get(key);

        if (object) {
            if (o) {
                for (i in object) {
                    if (object.hasOwnProperty(i)) {
                        o[i] = object[i];
                    }
                }

                sessionStorage.setItem(key, JSON.stringify(o));
            } else {
                sessionStorage.setItem(key, JSON.stringify(object));
            }
        } else {
            sessionStorage.setItem(key, null);
        }
    },
    delete: function(key) {
        sessionStorage.removeItem(key);
    },
    getLocal: function(key) {
        var object = localStorage.getItem(key);
        if (object) {
            object = JSON.parse(object);
        }
        return object;
    },
    setLocal: function(key, object) {
        var i,
            o = Storage.getLocal(key);

        if (object) {
            if (o) {
                for (i in object) {
                    if (object.hasOwnProperty(i)) {
                        o[i] = object[i];
                    }
                }

                localStorage.setItem(key, JSON.stringify(o));
            } else {
                localStorage.setItem(key, JSON.stringify(object));
            }
        } else {
            localStorage.setItem(key, null);
        }
    }
};

var positionIniData = {
    mode: {
        value: 1,
        city: 1,
        center: 2,
        nearby: 3
    },
    center: {
        name: '盘古创业',
        lng: 121.516546,
        lat: 31.217467
    },
    city: { name: '上海市', cid: 803 }
};

//获取参数
function getParam(paramName) {
    var paramList = location.search.replace("?", "").split("&");
    for (var i = 0; i < paramList.length; i++) {
        if (paramList[i].split("=")[0] == paramName)
            return decodeURI(paramList[i].substring(paramList[i].indexOf("=") + 1, paramList[i].length));
    }
    return "";
}

//获取入住人id类信息
function getGuest() {
    var oid = getParam("oid"),
        rid = getParam("rid"),
        orid = getParam("orid");
    if (oid != '') { //优先取链接的id
        Storage.set('guest', { oid: oid, orid: orid, rid: rid });
    } else { //其次storage中找
        var guest = Storage.get("guest");
        console.log(guest);
        if (guest) {
            oid = guest.oid;
            rid = guest.rid;
            orid = guest.orid;
        } else {  //链接、storage均没有，
            if (location.pathname.indexOf("service/orderList")<0) {
                location.href = "../index.html";
            }
        }
    }
    return { oid: oid, orid: orid, rid: rid };
}

//获取连接令牌
function getAccessToken(callback) {
    //先获取本地储存的 令牌
    var token = '',
        openid = '',
        user = Storage.getLocal('user');
    if (user) {
        token = user.accessToken || '';
        openid = user.openId || '';
    }
    callback(token, openid);
}

//ajax 封装，需要令牌
function ajaxJsonp(param) {
    if (typeof param.successCallback !== "function") {
        param.successCallback = false;
    }

    getAccessToken(function(token, openid) {
        if (param.url !== "") {
            param.data = param.data || {};
            param.data.accessToken = token;
            param.data.openId = openid;

            $.ajax({
                type: "post",
                async: param.async || true,
                // url: param.url + "?accessToken=" + token + "&openId=" + openid,
                url: param.url,
                dataType: "json",
                // dataType: "jsonp",
                // jsonp: "jsonpcallback",
                data: param.data,
                beforeSend: function() {
                    if (param.data.loading) {
                        console.log(123);
                    }
                },
                success: function(json) {
                    if (json.status === -1) {
                        if (!param.noSkip) {
                            window.location.replace("../register-1.html?prePage=" + window.location.pathname + window.location.search);
                        }
                    } else {
                        if (param.successCallback) {
                            param.successCallback(json);
                        }
                    }
                },
                error: function(XMLHttpRequest, type, errorThrown) {
                    console.log(XMLHttpRequest.responseText + "\n" + type + "\n" + errorThrown);
                }
            });
        }
    });
}

var controlCore = {
    hotel: {},
    getHotel: function() {
        this.hotel = Storage.get("hotel");

        if (!(this.hotel && this.hotel.hid)) {
            location.href = "homepage.html";
        } else {
            return this.hotel;
        }
    }
}

function dateAdd(date, strInterval, number) {
    switch (strInterval) {
        case 's':
            return new Date(Date.parse(date) + (1000 * number));
        case 'n':
            return new Date(Date.parse(date) + (60000 * number));
        case 'h':
            return new Date(Date.parse(date) + (3600000 * number));
        case 'd':
            return new Date(Date.parse(date) + (86400000 * number));
        case 'w':
            return new Date(Date.parse(date) + ((86400000 * 7) * number));
        case 'q':
            return new Date(date.getFullYear(), (date.getMonth()) + number * 3, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        case 'm':
            return new Date(date.getFullYear(), (date.getMonth()) + number, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        case 'y':
            return new Date((date.getFullYear() + number), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    }
}

//传入完整时间，返回 MM月DD日
function formatDate(str) {
    var date = new Date(str.replace(/-/g, "/"));

    return (date.getMonth() + 1) + "月" + date.getDate() + "日";
}

function formatDateObj(date, type) {
    switch (type) {
        case 'yyyy-mm-dd hh:00':
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':00';
        case 'yyyy-mm-dd':
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
}

//传入完整时间，返回 hh:mm
function getHourTime(date) {
    return date.slice(11, 16);
}

//判断是否是闰年
function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

//获取指定年月的当月天数
function getDayNum(year, month) {
    if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1) {
        return 31;
    } else if ([4, 6, 9, 11].indexOf(month) > -1) {
        return 30;
    } else if (self.isLeapYear(year)) {
        return 29;
    } else {
        return 28;
    }
}

//获取以今天为基础的日期时间字符串，addDayCount＝0就是当前时间，1为明天的此时，－1为前一天的此时
function getDates(addDayCount) {
    var d = new Date();

    d.setDate(d.getDate() + addDayCount);

    var year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        h = d.getHours(),
        mins = d.getMinutes(),
        s = d.getSeconds();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (h < 10) h = "0" + h;
    if (mins < 10) mins = "0" + mins;
    if (s < 10) s = "0" + s;

    return year + "-" + month + "-" + day + " " + h + ":" + mins + ":" + s;
}

//根据指定日期和天数，返回新的时间字符串
function calDates(date, addDayCount) {
    var d = new Date(date.replace(/-/g, "/"));

    d.setDate(d.getDate() + addDayCount);

    var year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        h = d.getHours(),
        mins = d.getMinutes(),
        s = d.getSeconds();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (h < 10) h = "0" + h;
    if (mins < 10) mins = "0" + mins;
    if (s < 10) s = "0" + s;

    return year + "-" + month + "-" + day + " " + h + ":" + mins + ":" + s;
}

function getWeekday(date) {
    var w_array = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"),
        d = new Date(date.replace(/-/g, "/"));
    return w_array[d.getDay()];
}

//type
//date yyyy-MM-dd
//month yyyy年m月
//monthFirst yyyy-MM-01
//yearFirst yyyy-01-01
//time hh:mm:ss
//day d
//hour h
//空 yyyy-MM-dd hh:mm:ss
function getToday(type, serverTime) {
    var d;
    if (serverTime) {
        d = new Date(serverTime.replace(/-/g, '/'));
    } else {
        d = new Date();
    }
    var year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        week = d.getDay(),
        h = d.getHours(),
        mins = d.getMinutes(),
        s = d.getSeconds();
    if (month < 10) {
        month = "0" + month;
    } else {
        month = month + '';
    }
    if (day < 10) day = "0" + day;
    if (h < 10) h = "0" + h;
    if (mins < 10) mins = "0" + mins;
    if (s < 10) s = "0" + s;

    switch (type) {
        case "date":
            return year + "-" + month + "-" + day;
        case "monthNotFormat":
            return year + "-" + month;
        case "preMonthNotFormat":
            if (month == "01") {
                year = year - 1;
                month = 12;
            } else {
                month = d.getMonth();
                if (month < 10) month = "0" + month;
            }
            return year + "-" + month;
        case "month":
            if (month.indexOf("0") == 0) {
                month = month[1];
            }
            return year + " 年 " + month + " 月 ";
        case "monthFirst":
            return year + "-" + month + "-01";
        case "yearFirst":
            return year + "-01-01";
        case "time":
            return h + ":" + mins + ":" + s;
        case "day":
            return d.getDate();
        case "hour":
            return d.getHours();
        default:
            return year + "-" + month + "-" + day + " " + h + ":" + mins + ":" + s;
    }
}

//返回上月第一天和最后一天的字符串 2016-2-1, 2016-2-29
//type: start, end
function getLastMonth(type) {
    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1;

    if (month == 1) {
        year = year - 1;
        if (type == 'start') {
            return year + "-12-1";
        } else if (type == 'end') {
            return year + "-12-31";
        }
    } else {
        month = month - 1;
        if (type == 'start') {
            return year + "-" + month + "-1";
        } else if (type == 'end') {
            return year + "-" + month + "-" + getDayNum(year, month);
        }
    }
}

//返回上一个月的时间字符串
function getPreMonth(date) {
    var d = new Date(date.replace(/-/g, '/')),
        year = d.getFullYear(),
        month = d.getMonth() + 1;

    if (month == 1) {
        year = year - 1;
        return year + "-12";
    } else {
        month = month - 1;
        if (month < 10) {
            month = "0" + month;
        }
        return year + "-" + month;
    }
}

//返回上一天的时间字符串
function getPreDay(date) {
    var d = new Date(date.replace(/-/g, '/'));
    d.setDate(d.getDate() - 1);

    var year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;
}

//保留 scale 位小数
function round(value, scale) {
    scale = isEmpty(scale) ? 2 : scale;
    var num = new Number(value);
    var str = num.toFixed(scale);
    if (str.substring(str.length - 3, str.length) == '.00') {
        return str.substring(0, str.length - 3);
    } else {
        return str;
    }
}

//格式化为中文货币格式
function fmoney(value) {
    return '￥' + round(value, 2);
}

//判断是否为空
function isEmpty(obj) {
    return obj === "" || obj == null || obj == undefined;
}

//判断是否为空
function isNotEmpty(obj) {
    return !isEmpty(obj);
}
//拼接picker字符串通用方法
// function mapList(json,key1,key2){
//     var vmData = [];
//     json.map(function(item){
//          vmData.push({value:item.key1,text:item.key2});
//     });
//     return vmData;
// }
function mapList(json) {
    var vmData = [];
    json.map(function(item) {
        vmData.push({ value: item.id, text: item.name, unit: item.unit, price: item.price });
    });
    return vmData;
}

//防止滑动跳转的闭包模块
var stopSwipeSkip = (function() {
    var tapCount = 0;
    return {
        do: function(callback) {
            tapCount++;
            if (tapCount > 1) {
                callback();
            }
            //滑动只触发一次
            //tap 会连续触发两次，间隔小于100ms
            setTimeout(function() {
                tapCount = 0;
            }, 100);
        }
    }
})();

function getDateByDays(date, days) {
    var d = new Date();
    d.setFullYear(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2]);
    d.setDate(d.getDate() + days);

    var year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}

//时租房的本地数据读取呈现-老的
function loadSessionPartTime() {
    var index, number;

    select_bar = document.getElementById('select_bar');
    select_bar.style.width = $('#select_time').width() + 'px';

    if (newOrder.partTime.partTimeIndex && newOrder.partTime.partTimeIndex >= 0) {
        index = newOrder.partTime.partTimeIndex;
        number = newOrder.partTime.partTimeNumber;

        vmPart.partTimeNumber = number;
        vmPart.partTimeIndex = index;

        vmPart.selectTime(newOrder.partTime.partTimeIndex);

        select_bar.style.top = 21 * (vmPart.partTimeIndex - vmPart.minIndex + 1) + 'px';
        select_bar.style.height = 21 * vmPart.partTimeNumber + 'px';
    }
}

//获取入住时间
function getStartTime(type) {
    if (type == 1) {
        var today = new Date();
        return today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + "-" + today.getDate() + " " + vmPart.partTimeStart;
    } else if (type == 0) {
        return getDate(vmCalendar.startIndex) + ' ' + clockObj.getStartHour() + ":00";;
    } else if (type == 2) {
        return getToday();
    }
}

//获取退房时间
function getEndTime(type) {
    var today = new Date(),
        date = today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + "-" + today.getDate();

    if (type == 1) {
        return date + " " + vmPart.partTimeEnd;
    } else if (type == 0) {
        //夜房默认退房时间
        return getDate(vmCalendar.endIndex) + ' ' + clockObj.getEndHour() + ":00";
    } else if (type == 2) {
        return date + " 14:00";
    }
}

//根据日历日期index返回时间字符串
function getDate(index) {
    var date;
    if (index == -1) {
        return "";
    } else {
        date = vmCalendar.calendarDates[index];
        return date.year + '-' + (date.month < 10 ? ('0' + date.month) : date.month) + '-' + (date.day < 10 ? ('0' + date.day) : date.day);
    }
}

//获取系统时间
function getServerTime(callback) {
    ajaxJsonp({
        url: urls.getServerTime,
        successCallback: function(json) {
            if (json.status == 1) {
                return callback(json.data.serverTime);
            } else {
                mui.alert(json.message);
            }
        }
    });
}

//获取当前小时序号
function getHourIndex() {
    var now = getToday('time').split(':'),
        index = parseInt(now[0]) * 2;

    if (parseInt(now[1]) >= 0) {
        index++;
    }

    return index;
}

function isSameDay(a, b) {
    return a.getFullYear() == b.getFullYear() &&
        a.getMonth() == b.getMonth() &&
        a.getDate() == b.getDate();
}

//注册导航接口
function registerWeixinConfig(callback) {
    ajaxJsonp({
        url: urls.weiXinConfig,
        data: { url: window.location.href },
        successCallback: function(json) {
            if (json.status === 1) {
                wx.config({
                    debug: false,
                    appId: json.data.appId,
                    timestamp: json.data.timestamp,
                    nonceStr: json.data.nonceStr,
                    signature: json.data.signature,
                    jsApiList: [
                        'checkJsApi',
                        'openLocation',
                        'getLocation',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'hideMenuItems'
                    ],
                });
                isSuccess = true;

                if (typeof callback == 'function') {
                    callback();
                }
            }
        }
    });
}

//验证url的数字传参
function verifyIntParam(p) {
    if (p != "") {
        if (isNaN(p)) {
            location.href = document.referrer || "index.html";
        } else {
            return parseInt(p);
        }
    } else {
        location.href = "index.html";
    }
}

function getRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function numToHan(num) {
    switch (num) {
        case 1:
            return '一';
        case 2:
            return '二';
        case 3:
            return '三';
        case 4:
            return '四';
        case 5:
            return '五';
        case 6:
            return '六';
        case 7:
            return '七';
        case 8:
            return '八';
        case 9:
            return '九';
    }
}

function goPromotion() {
    var promotionUrl = '';
    ajaxJsonp({
        url: urls.promotionList,
        successCallback: function(json) {
            if (json.status == 1) {
                if (json.data.length > 0) {
                    json.data.map(function(p) {
                        if (p.status == 2) {
                            promotionUrl = 'promotion-detail.html';
                        }
                    });
                }

                if (promotionUrl == '') {
                    promotionUrl = 'promotion-apply.html';
                }

                location.href = promotionUrl;
            }
        }
    });
}

function isLocalStorageNameSupported() {
    var testKey = 'test',
        storage = window.localStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

//弹出框-小
//显示
function modalShow(url, type, callback) {
    $('.mask').show();
    switch (type) {
        case 1:
            $('#modal-text').load(url, function() {
                avalon.scan(document.getElementById('modal-text-content'));
                if (typeof callback == "function") {
                    callback();
                }
            });
            break;
        case 2:
            $('#modal-text').html(url);
            avalon.scan(document.getElementById('modal-text-content'));
            break;
        default:
            break;
    }
}
//弹出框-小
//隐藏
function modalClose() {
    $('.mask').hide();
}

var Observer = (function() {
    var _message = {};
    return {
        regist: function(type, fn) {
            if (typeof _message[type] === 'undefined') {
                _message[type] = [fn];
            } else {
                _message[type].push(fn);
            }
        },
        fire: function(type, args) {
            if (!_message[type])
                return;
            var events = {
                    type: type,
                    args: args || {}
                },
                i = 0,
                len = _message[type].length;

            for (; i < len; i++) {
                _message[type][i].call(this, events);
            }
        },
        remove: function(type, fn) {
            if (_message[type] instanceof Array) {
                var i = _message[type].length - 1;
                for (; i >= 0; i--) {
                    _message[type][i] === fn && _message[type].splice(i, 1);
                }
            }
        }
    }
})();

//初始化时间
var iniOrderTime = function() {
    var order = Storage.get('newOrder');
    if (!newOrder) {
        var now = new Date(),
            h1 = now.getHours(), 
            interval = 3;
        if (23 - h1 < 3) {
            interval = 23 - h1;
        }

        order = {
            day: {
                start: formatDateObj(now, 'yyyy-mm-dd hh:00'), //yyyy-mm-dd hh:mm
                end: formatDateObj(dateAdd(now, 'd', 1), 'yyyy-mm-dd') + ' 12:00', //yyyy-mm-dd hh:mm
                startHour: now.getHours(),
                endHour: 12
            },
            partTime: {
                start: formatDateObj(now, 'yyyy-mm-dd hh:00'), //yyyy-mm-dd hh:mm
                end: formatDateObj(dateAdd(now, 'h', 3), 'yyyy-mm-dd hh:00'), //yyyy-mm-dd hh:mm
                startHour: h1,
                endHour: h1 + interval,
                amount: interval
            }
        }
        Storage.set('newOrder', order);
    }
    return order;
}

// ajaxJsonp({  //测试所用，默认登录该账号
//     url: urlAPI + '/web/usr/user/loginPwd',
//     data: {
//         username: 18321958468,
//         password: 123456
//     },
//     successCallback: function(json) {
//         if (json.status !== 1) {
//             alert(json.message);
//             vmLogin.isDisabled = false;
//         } else {
//             var user = {
//                 uid: json.data.id,
//                 mobile: json.data.mobile,
//                 openId: json.data.openId,
//                 name: json.data.name,
//                 nickname: json.data.nickname,
//                 headImg: json.data.headUrl,
//                 logState: 1,
//                 accessToken: json.data.accessToken,
//                 idUrl: json.data.idUrl,
//                 idNo: json.data.idNo,
//                 authStatus: json.data.authStatus,
//                 invoiceMoney: json.data.invoiceMoney
//             };
//             Storage.setLocal('user', user);
//             //location.replace('../index.html');
//         }
//     }
// });
