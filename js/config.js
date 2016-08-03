//文档图片目录
var urlAPINet = "http://img.ini.xin/";
var urln = {
    UploadFile: urlAPINet + "/UploadFile.ashx", //上传地址 
};
//微信域名
var urlWeixin = "http://weixin.ini.xin";
//接口根目录
var urlAPI = "http://web.api.benjiudian.com/test";
// var urlAPI = "http://liuyuhua.wicp.net:27450/ini-web";

var urls = {
        //登录注册
        loginURL: urlAPI + '/usr/user/login',
        getCodeURL: urlAPI + '/usr/sms/register',
        getRegisterLogURL: urlAPI + '/usr/user/exists',
        userInfotUrl: urlAPI + '/usr/user/info',
        weiXinConfig: urlAPI + '/wx/wechat/config',
        saveUserInfo: urlAPI + '/usr/user/save',
        saveInvoiceLog: urlAPI + '/usr/invoiceLog/save',
        getInviteCode: urlAPI + '/usr/user/invitationCode',
        getHomeBannerList: urlAPI + '/sys/homeBanner/list',
        //首页
        getCityGallery: urlAPI + '/res/cityImage/list', //城市图片列表
        getHotelByPosition: urlAPI + '/res/hotel/aroundList', //查找周边酒店列表
        getRecentViewLog: urlAPI + '/usr/viewLog/roomList', //最近浏览
        getFilter: urlAPI + '/res/searchCriteriaAmenity/list', //筛选条件

        getINIrecommendURL: urlAPI + '/res/room/recommendList',
        getHotelInfoList: urlAPI + '/res/hotel/localList', //根据地区获取酒店信息列表
        getUserFundURL: urlAPI + '/usr/userFund/list', //用户基金列表
        getInvitationLogURL: urlAPI + '/usr/invitationLog/list', //用户邀请列表
        //酒店
        getHotelDetail: urlAPI + '/res/hotel/detail',//酒店详细信息
        //联系人
        getContactList: urlAPI + '/usr/frequentContact/list', //常用联系人列表
        getContact: urlAPI + '/usr/frequentContact/get', //获取常用联系人信息
        saveContact: urlAPI + '/usr/frequentContact/save', //常用联系人增加、修改
        deleteContact: urlAPI + '/usr/frequentContact/delete', //常用联系人删除
        //发票管理
        getInvoiceList: urlAPI + '/trd/orderInfo/invoiceList', //可以开发票的订单列表
        saveInvoice: urlAPI + '/usr/invoiceLog/save', //申请发票
        payInvoice: urlAPI + '/trd/pay/invoiceExpressFeePay/cashier', //支付发票快递费用
        //收货地址
        saveDeliveryAddress: urlAPI + '/usr/deliveryAddress/save', //收货地址增加、修改getInvoiceExpressFee
        getDeliveryAddress: urlAPI + '/usr/deliveryAddress/get', //获取收货地址
        getInvoiceExpressFee: urlAPI + '/usr/invoiceLog/invoiceExpressFee', //获取发票快递费用
        //房间相关
        getRoomTypeList: urlAPI + '/res/roomType/list', //房间类型列表
        getRoomList: urlAPI + '/res/room/list', //房间列表
        getRoomDetail: urlAPI + '/res/room/detail', //房间详情
        getRoomAssess: urlAPI + '/trd/orderComment/list', //房间评价列表
        getRoomGoodsList: urlAPI + '/res/goods/roomGoods', //房间物品列表
        getFundAvailable: urlAPI + '/usr/userFund/availableList', //可用基金列表
        getRoomBookDate: urlAPI + '/res/roomStatus/busy', //查询房间已预订日期
        getRoomStatus: urlAPI + '/res/roomStatus/get', //查询房间当天所有时间段预订状态
        getRoomPartTimePrice: urlAPI + '/res/partTimePrice/list', //房间时租房价格列表
        getRoomPartTimeRange: urlAPI + '/res/partTimePrice/range', //房间时租房时间范围
        getRoomNightDiscount: urlAPI + '/res/nightDiscount/list', //查询房间夜房优惠价格
        getNightDiscount: urlAPI + '/res/nightDiscount/times', //查询搜索时，要显示的夜房优惠价格列表
        //设计师相关
        getDesigner: urlAPI + '/usr/designer/get', //设计师详情
        //订单相关
        getOrderList: urlAPI + '/trd/orderInfo/list', //订单列表
        getOrderDetail: urlAPI + '/trd/orderInfo/detail', //订单详情
        submitOrder: urlAPI + '/trd/orderInfo/submit', //提交订单
        cancelOrder: urlAPI + '/trd/orderInfo/cancel', //取消订单
        saveSub: urlAPI + '/trd/orderComment/save', //用户提交评论
        payOrder: urlAPI + '/trd/pay/orderInfoPay/cashier', //支付订单
        UnsubscribeOrder: urlAPI + '/trd/refund/orderInfoRefund/refund', //退订订单
        
        //客控
        inStoreGoods: urlAPI + '/svr/inStoreGoods/list',//店内商品列表
        hotelService: urlAPI + '/svr/hotelService/list',//店内服务列表
        socialService: urlAPI + '/svr/socialServiceCategory/list',//社会化服务列表

        //管理
        //欢迎页
        regionList: urlAPI + '/sys/area/getMyList',//用户拥有的区域列表
        hotelList: urlAPI + '/mgr/hotelManage/myHotelList',//用户拥有的酒店列表
        menuList: urlAPI + '/usr/menu/list',//用户拥有的菜单列表

        //房间管理
        roomList: urlAPI + '/mgr/hotelManage/roomList',//客房管理列表
        occupancyRate: urlAPI + '/mgr/reportManage/hotelOccupancyRate',//酒店入住率
        roomDetail: urlAPI + '/mgr/hotelManage/roomDetail',//酒店客房状态详情
        roomRepairLogSave: urlAPI + '/mgr/roomRepairLog/save',//添加维修
        disableRoom: urlAPI + '/mgr/hotelManage/disableRoom',//停用房间
        confirmRepair: urlAPI + '/mgr/hotelManage/confirmRepair',//确认维修
        roomRepairLog: urlAPI + '/mgr/roomRepairLog/detail',//维修详情

        //耗材
        articleList: urlAPI + '/mgr/materialManage/findListConsumables',//日用品列表
        articleGoods: urlAPI + '/mgr/materialManage/goodsByGid',//日用品商品信息
        articleDetail: urlAPI + '/mgr/materialManage/storageDetails',//日用品明细
        articleModify: urlAPI + '/mgr/materialManage/insertStock',//日用品修改
        beddingList: urlAPI + '/mgr/materialManage/bedLiningsList',//床上用品列表
        beddingGoods: urlAPI + '/mgr/materialManage/bedLiningsDetail',//床上用品商品信息
        beddingDetail: urlAPI + '/mgr/materialManage/findListbedLiningsDetailLog',//床上用品明细
        beddingModify: urlAPI + '/mgr/materialManage/updateBedLinings',//床上用品修改
        assetList: urlAPI + '/mgr/materialManage/damagedOutlay',//固定资产列表
        assetGoods: urlAPI + '/mgr/materialManage/byHidCidBedLinings',//固定资产信息
        assetDetail: urlAPI + '/mgr/materialManage/findListDamagedOutlay',//固定资产明细

        //人员管理
        employeeList: urlAPI + '/mgr/employee/list',//人员列表
        employeeDetail: urlAPI + '/mgr/employee/detail',//人员详情
        employeeCheckList: urlAPI + '/mgr/employeeCheckingIn/list',//人员当月考勤列表
        employeeCheckSave: urlAPI + '/mgr/employeeCheckingIn/save',//人员添加考勤
        employeeEvaluateList: urlAPI + '/mgr/employeeEvaluate/list',//员工评价列表
        employeeFired: urlAPI + '/mgr/employee/dimission',//员工离职
        employeeEvaluateSave: urlAPI + '/mgr/employeeEvaluate/save',//添加评价
        employeeSave: urlAPI + '/mgr/employee/save',//添加员工
        scheduleList: urlAPI + '/mgr/scheduleTime/list',//排版时间段表
        employeeScheduleList: urlAPI + '/mgr/employeeSchedule/list',//员工排班时间表
        employeeScheduleSave: urlAPI + '/mgr/employeeSchedule/save',//当天排班人员添加修改
        employeeScheduleDay: urlAPI + '/mgr/employeeSchedule/day',//当天排班详情
        dictList: urlAPI + '/sys/dict/list',//字典列表

        //财务
        income: urlAPI + '/mgr/financeManage/income', //收入统计
        outlay: urlAPI + '/mgr/financeManage/outlay', //支出统计
        invoiceManage: urlAPI + '/mgr/invoiceManage/flist', //发票管理
        invoiceDetail: urlAPI + '/mgr/invoiceManage/detail', //发票详情
        invoiceSend: urlAPI + '/mgr/invoiceManage/send', //寄出发票
        fRoomIncome: urlAPI + '/trd/orderInfo/fRoomIncome', //房间收入列表
        fGoodsIncome: urlAPI + '/trd/orderInfo/fGoodsIncome', //非房收入列表
        commodityOut: urlAPI + '/mgr/commodityOutlay/flist', //日用品或能耗或设备支出列表
        damagedOut: urlAPI + '/mgr/damagedOutlay/flist', //物品损坏支出列表
        salaryOut: urlAPI + '/mgr/salaryInfoOutlay/flist', //人员工资支出列表
        taxOut: urlAPI + '/mgr/taxOutlay/flist', //税务支出支出列表
        otherOut: urlAPI + '/mgr/otherOutlay/flist', //其它支出支出列表
        outLog: urlAPI + '/mgr/outlayLog/list', //支出修改明细列表
        commodityList: urlAPI +'/res/commodity/slist',//日用品项列表
        commoditySave: urlAPI +'/mgr/commodityOutlay/save',//日用品等修改添加
        commodityDetail: urlAPI + '/mgr/commodityOutlay/detail',//日用品等详情接口
        damagedOutDetail: urlAPI + '/mgr/damagedOutlay/detail',//物品损坏详情
        damagedOutSave: urlAPI + '/mgr/damagedOutlay/save',//物品损坏添加
        taxOutDetail: urlAPI + '/mgr/taxOutlay/detail',//税务支出详情
        taxOutSave : urlAPI + '/mgr/taxOutlay/save',//税务支出添加
        otherOutDetail: urlAPI + '/mgr/otherOutlay/detail',//其他支出详情
        otherOutSave: urlAPI + '/mgr/otherOutlay/save',//其他支出添加
        salaryOutDetail: urlAPI + '/mgr/salaryInfoOutlay/detail',//人员工资详情
        salaryOutSave: urlAPI + '/mgr/salaryInfoOutlay/save',//人员工资添加

        //仓库
        supplierList: urlAPI + '/mgr/supplier/slist',//供应商列表
        commodityStockList: urlAPI +'/mgr/stockInNote/commodityList',//仓库商品列表
        warehouseList: urlAPI + '/mgr/warehouse/slist',//仓库列表
        warehouseInList: urlAPI + '/mgr/stockInNote/list',//入库单列表
        warehouseInDetail: urlAPI + '/mgr/stockInNote/detail',//入库单详情
        warehouseInSave: urlAPI + '/mgr/stockInNote/save',//入库单添加
        warehouseWayList: urlAPI + '/mgr/warehousePutWay/slist',//出入库方式列表
        warehouseOutList: urlAPI + '/mgr/stockOutNote/list',//出库单列表
        warehouseOutDetail: urlAPI + '/mgr/stockOutNote/detail',//出库单详情
        warehouseOutSave: urlAPI + '/mgr/stockOutNote/save',//出库单添加
        warehouseAllocateList: urlAPI + '/mgr/stockAllotNote/list',//调拨单列表
        warehouseAllocateDetail: urlAPI + '/mgr/stockAllotNote/detail',//调拨单详情
        warehouseAllocateSave: urlAPI + '/mgr/stockAllotNote/save',//调拨单添加
        warehouseStockList: urlAPI + '/mgr/materialManage/findListstockTaking',//库存盘点列表
        warehouseStockDetail: urlAPI + '/mgr/materialManage/findListByIdStockTaking',//库存盘点详情
        warehouseStockAdd: urlAPI + '/mgr/materialManage/byHidCidStock',//库存盘点添加详细
        warehouseStockSave: urlAPI + '/mgr/materialManage/stockTalingInsert',//库存盘点添加

        //统计报表
        reportIn: urlAPI + '/mgr/reportManage/income',//收入统计
        reportOut: urlAPI + '/mgr/reportManage/outlay',//支出统计
    }
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
//获取参数
function getParam(paramName) {
    var paramList = location.search.replace("?", "").split("&");
    for (var i = 0; i < paramList.length; i++) {
        if (paramList[i].split("=")[0] == paramName)
            return decodeURI(paramList[i].substring(paramList[i].indexOf("=") + 1, paramList[i].length));
    }
    return "";
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
            $.ajax({
                type: "get",
                async: param.async || true,
                url: param.url + "?accessToken=" + token + "&openId=" + openid,
                dataType: "jsonp",
                jsonp: "jsonpcallback",
                data: param.data,
                success: function(json) {
                    if (json.status === -1) {
                        window.location.replace("../register-1.html?prePage=" + window.location.pathname + window.location.search);
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

        if(!(this.hotel && this.hotel.hid)) {
            location.href = "homepage.html";
        } else {
            return this.hotel;
        }
    }
}

//传入完整时间，返回 MM月DD日
function formatDate(str) {
    var date = new Date(str.replace(/-/g, "/"));

    return (date.getMonth() + 1) + "月" + date.getDay() + "日";
}

//判断是否是闰年
function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

//获取指定年月的当月天数
function getDayNum(year, month) {
    if ([1, 3, 5, 7, 8, 10, 12].indexOf(month)>-1) {
        return 31;
    } else if ([4, 6, 9, 11].indexOf(month)>-1) {
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

function getWeekday(date) {
    var w_array = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
    ,d = new Date(date.replace(/-/g, "/"));
    return w_array[d.getDay()];
}

//type
//date yyyy-MM-dd
//month yyyy年m月
//monthFirst yyyy-MM-01
//yearFirst yyyy-01-01
//time hh:mm:ss
//空 yyyy-MM-dd hh:mm:ss
function getToday(type) {
    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        week = d.getDay(),
        h = d.getHours(),
        mins = d.getMinutes(),
        s = d.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (h < 10) h = "0" + h;
    if (mins < 10) mins = "0" + mins;
    if (s < 10) s = "0" + s;

    switch(type) {
        case "date":
            return year + "-" + month + "-" + day;
        case "monthNotFormat":
            return year + "-" + month;
        case "preMonthNotFormat":
            if(month == "01") {
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
        default:
            return year + "-" + month + "-" + day + " " + h + ":" + mins + ":" + s;
    }
}

//返回上一个月的时间字符串
function getPreMonth(date) {
    var d = new Date(date.replace(/-/g, '/')),
    year = d.getFullYear(),
    month = d.getMonth() + 1;

    if(month == 1) {
        year = year - 1;
        return year + "-12";
    } else {
        month = month - 1;
        if(month < 10) {
            month = "0" + month;
         }
        return year + "-" + month;
    }
}

//返回上一天的时间字符串
function getPreDay(date) {
    var d = new Date(date.replace(/-/g, '/'));
    d.setDate(d.getDate()-1);

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
function mapList(json){
    var vmData = [];
    json.map(function(item){
         vmData.push({value:item.id,text:item.name,unit:item.unit,price:item.price});
    });
    return vmData;
}

//防止滑动跳转的闭包模块
var stopSwipeSkip = (function() {
    var tapCount = 0;
    return {
        do: function(callback) {
            tapCount ++;
            if(tapCount>1) {
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

function getDateByDays(date,days){
    var d = new Date();
    d.setFullYear(date.split('-')[0],date.split('-')[1]-1,date.split('-')[2]);
    d.setDate(d.getDate() + days);

    var year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}

function loadSessionPartTime() {
    var index, number;
    $('.select-time').height($(window).height() - 260);

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
    if (type) {
        if (vmPart.partTimeStart) {
            var today = new Date();
            return today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + "-" + today.getDate() + " " + vmPart.partTimeStart;
        } else {
            return '';
        }
    } else {
        return getDate(vmCalendar.startIndex);
    }
}

//获取退房时间
function getEndTime(type) {
    if (type) {
        if (vmPart.partTimeEnd) {
            var today = new Date();
            return today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + "-" + today.getDate() + " " + vmPart.partTimeEnd;
        } else {
            return '';
        }
    } else {
        //夜房默认退房时间
        return getDate(vmCalendar.endIndex) + " 14:00";
    }
}

//根据日历日期index返回时间字符串
function getDate(index) {
    var date;
    if (index == -1) {
        return "";
    } else {
        date = vmCalendar.calendar[index];
        return date.year + '-' + (date.month < 10 ? ('0' + date.month) : date.month) + '-' + (date.day < 10 ? ('0' + date.day) : date.day);
    }
}
