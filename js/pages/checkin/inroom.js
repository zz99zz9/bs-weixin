/**
 * Created by lyh on 2017/4/4/004.
 */
var swiper1, swiper2;
var vmInroom = avalon.define({
    $id: 'inroom',
    goIndex: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index.html";
        })
    },
    goRoom: function() {
        stopSwipeSkip.do(function() {
            location.href = "service/orderList.html";
        })
    },
    goOrder: function() {
        stopSwipeSkip.do(function() {
            location.href = "../newOrderList.html";
        })
    },
    goMore: function() {
        stopSwipeSkip.do(function() {
            location.href = "../more.html";
        })
    },
    goOpendoor: function() {
        stopSwipeSkip.do(function() {
            mui.confirm(" ", "是否开门", ["回去看", "确定，开门"], function(e) {
                // if (e.index==0) {
                //     location.href = "../checkOut.html";
                // }
            }, "div");
        })
    },
    goCheckout: function() {
        stopSwipeSkip.do(function() {
            mui.confirm("<div style='text-align: left;padding: 20px 14px;'>摸摸口袋/看看床上/翻翻包裹,再检查一下哦～</div><div style='display: flex;justify-content: space-around;margin-bottom: 30px;'><img src='../img/icon/mobile.svg' alt=''><img src='../img/icon/key.svg' alt=''><img src='../img/icon/watch.svg' alt=''><img src='../img/icon/wallet.svg' alt=''></div>", " ", ["稍等", "万无一失 闪人"], function(e) {
                if (e.index == 1) {
                    location.href = "../checkOut.html";
                }
            }, "div");
        })
    },
    isNight: 0, //0-正常模式  1-睡眠模式
    serviceList: [
        { type: 0, name: '呼叫前台', engName: 'Call Reception', coverUrl: '../img/service-reception.jpg' },
        { type: 1, name: '更换客用品', engName: 'Change Supplies', coverUrl: '../img/service-changeSupplies.jpg' },
        { type: 2, name: '早餐服务', engName: 'Breakfast', coverUrl: '../img/service-breakfast.jpg' },
        { type: 3, name: '清洁服务', engName: 'cleaning', coverUrl: '../img/service-clean.jpg' }
    ], //预约服务列表
    swiper1Render: function() {
        //先销毁老的 再实例化新的
        swiper1 = new Swiper('.swiper1', {
            slidesPerView: 2.5,
            spaceBetween: 2,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.5,
        });
    },
    peripheryList: [ //预约服务列表
        { name: '上海野生动物园', coverUrl: '../img/around-ShangHaiWildAnimalPark.jpg' },
        { name: '迪斯尼乐园', coverUrl: '../img/around-disney.jpg' },
        { name: '美味小吃', coverUrl: '../img/around-snack.jpg' }
    ],
    openPop: function(type) {
        stopSwipeSkip.do(function() {
            modalShow('./util/popService.html', 1);
            vmPopService.lightList.map(function(e) {
                if (type==e.type) {
                    vmPopService.popList = e;
                    console.log(vmPopService.$model.popList);
                }
            })
        })
    },
});

//监听是否是睡眠模式
// document.getElementById("night").addEventListener("toggle", function(event) {
//     if (event.detail.isActive) {
//         vmInroom.isNight = 1;
//         modalShow('./util/popNight.html', 1);
//         console.log(vmInroom.isNight);
//     } else {
//         vmInroom.isNight = 0;
//         console.log(vmInroom.isNight);
//     }
// })

var vmPopNight = avalon.define({
    $id: 'popNight',
    closePop: function() {
        stopSwipeSkip.do(function() {
            modalClose();
        })
    },
    light: '不关闭',
    lightId: 0,
    lightList: [
        { value: 1, text: '不关闭' },
        { value: 2, text: '5分钟后关闭' },
        { value: 3, text: '10分钟后关闭' },
    ],
    alarm: '睡懒觉',
    alarmId: 0,
    alarmList: [
        { value: 0, text: '睡懒觉' },
        { value: 1, text: '6:00叫醒' },
        { value: 2, text: '7:00叫醒' },
        { value: 3, text: '8:00叫醒' },
    ],
});

var vmPopService = avalon.define({
    $id: 'popService',
    type: 0,
    callService: function() {
        stopSwipeSkip.do(function() {
            modalClose();
        })
    },
    closePop: function() {
        stopSwipeSkip.do(function() {
            modalClose();
        })
    },
    light: '不关闭',
    lightId: 0,
    lightList: [
        { type: 0, value: 1, name: '呼叫前台', engName: 'Call Reception', brief: '我们提供24小时前台呼叫服务。', url: '../img/reception-bg.jpg' },
        { type: 1, value: 2, name: '更换客用品', engName: 'Change Supplies', brief: '我们提供24小时前台呼叫服务。', url: '../img/changeSupplies-bg.jpg' },
        { type: 2, value: 3, name: '早餐服务', engName: 'Breakfast', brief: '我们提供24小时前台呼叫服务。', url: '../img/breakfast-bg.jpg' },
        { type: 3, value: 4, name: '清洁服务', engName: 'Cleaning', brief: '我们提供24小时前台呼叫服务。', url: '../img/clean-bg.jpg' },
    ],
    popList: {},
});


