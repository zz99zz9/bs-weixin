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
            mui.confirm("请通过圆圈内的影像仔细观察门外的人", "看看门外", ["<span style='color:blue;'>确定无误，开门</span>", "回去看"], function(e) {
                // if (e.index==0) {
                //     location.href = "../checkOut.html";
                // }
            }, "div");
        })
    },
    goCheckout: function() {
        stopSwipeSkip.do(function() {
            mui.confirm("<div style='text-align: left;padding: 20px 14px;'>摸摸口袋/看看床上/翻翻包裹,再检查一下哦～</div><div style='display: flex;justify-content: space-around;margin-bottom: 30px;'><img src='../img/icon/mobile.svg' alt=''><img src='../img/icon/key.svg' alt=''><img src='../img/icon/watch.svg' alt=''><img src='../img/icon/wallet.svg' alt=''></div>", " ", ["万无一失 闪人", "稍等"], function(e) {
                if (e.index == 0) {
                    location.href = "../checkOut.html";
                }
            }, "div");
        })
    },
    isNight: 0, //0-正常模式  1-睡眠模式
    serviceList: [
        { name: '预约早餐', coverUrl: '../img/qietu-zaocan.png' },
        { name: '洗衣服务', coverUrl: '../img/qietu-xiyi.png' },
        { name: '代驾服务', coverUrl: '../img/qietu-dajia.png' }
    ], //预约服务列表
    swiper1Render: function() {
        //先销毁老的 再实例化新的
        swiper1 = new Swiper('.swiper1', {
            slidesPerView: 2,
            spaceBetween: 6,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 3,
        });
    },
    peripheryList: [ //预约服务列表
        { name: '野生动物园', coverUrl: '../img/qietu-yeshengdongwuyuan.png' },
        { name: '迪斯尼', coverUrl: '../img/qietu-disini.png' },
        { name: '小吃', coverUrl: '../img/qietu-xiaochi.png' }
    ],
});

document.getElementById("night").addEventListener("toggle", function(event) {
    if (event.detail.isActive) {
        vmInroom.isNight = 1;
        modalShow('./util/popNight.html', 1);
        console.log(vmInroom.isNight);
    } else {
        vmInroom.isNight = 0;
        console.log(vmInroom.isNight);
    }
})

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


