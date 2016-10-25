var vmLottery = avalon.define({
    $id: 'lottery',
    chance: 6,
    count: 0,
    isRotate: false,
    cash: 0,
    prizeIndex: 5,
    prize: [{
        angle: 22,
        text: 'iroom max 体验券',
        img: '../img/card/free.svg'
    }, {
        angle: 67,
        text: 'iroom 体验券',
        img: '../img/card/free.svg'
    }, {
        angle: 112,
        text: '本宿定制洗护大礼包',
        img: '../img/card/gift.png',
    }, {
        angle: 157,
        text: '本宿定制床品',
        img: '../img/card/bedding.png',
    }, {
        angle: 202,
        text: '锤子M1L',
        img: '../img/card/hammer.png',
    }, {
        angle: 247,
        text: '现金红包',
        img: '../img/card/redPacket.png',
    }, {
        angle: 292,
        text: '小米手环2',
        img: '../img/card/miBand2.png',
    }, {
        angle: 337,
        text: 'iPhone7 Plus',
        img: '../img/card/iphone7plus.png',
    }],
    task: [{
        img: 'img/card/card_null.svg',
        name: '会员',
        chance: 2,
        add: 2
    }, {
        img: 'img/card/card_No3.svg',
        name: '银卡会员',
        chance: 10,
        add: 4
    }, {
        img: 'img/card/card_No2.svg',
        name: '金卡会员',
        chance: 25,
        add: 6
    }, {
        img: 'img/card/card_No1.svg',
        name: '黑卡会员',
        chance: 60,
        add: 8
    }],
    winnerList: [{
        name: '1383998****',
        rank: 4
    },{
        name: '1353785****',
        rank: 2
    },{
        name: '1589345****',
        rank: 6
    },{
        name: '1353785****',
        rank: 1
    },{
        name: '1870184****',
        rank: 3
    },{
        name: '1353785****',
        rank: 4
    },{
        name: '1561895****',
        rank: 2
    },{
        name: '1353785****',
        rank: 6
    },{
        name: '1366617****',
        rank: 7
    }],
    renderSwiper: function() {
        swiper = new Swiper('.swiper', {
            direction: 'vertical',
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            loop: true,
            slidesPerView: 1,
            width: window.innerWidth,
            height: 32,
            noSwiping : true
        });
    },
    openLog: function() {
        popover('./util/lottery-log.html', 1);
    },
    openRule: function() {
        popover('./util/lottery-rule.html', 1);
    },
    goPromotion: function() {
        location.href = 'promotion-detail.html';
    }
})

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

var vmLog = avalon.define({
    $id: 'log',
    list: [{
        name: '现金红包',
        img: '../img/card/redPacket.png',
        num: 1.5,
        date: '2016-10-21'
    },{
        name: '现金红包',
        img: '../img/card/redPacket.png',
        num: 4.1,
        date: '2016-10-21'
    },{
        name: 'iPhone 7 Plus',
        img: '../img/card/iphone7plus.png',
        num: 1,
        date: '2016-10-21'
    },{
        name: '小米手环2',
        img: '../img/card/miBand2.png',
        num: 1,
        date: '2016-10-21'
    },{
        name: '现金红包',
        img: '../img/card/redPacket.png',
        num: 0.5,
        date: '2016-10-21'
    },{
        name: '本宿定制洗护大礼包',
        img: '../img/card/gift.png',
        num: 1,
        date: '2016-10-21'
    },{
        name: '现金红包',
        img: '../img/card/redPacket.png',
        num: 8.5,
        date: '2016-10-21'
    },{
        name: '锤子M1L',
        img: '../img/card/hammer.png',
        num: 1,
        date: '2016-10-21'
    },{
        name: '本宿定制床品',
        img: '../img/card/bedding.png',
        num: 1,
        date: '2016-10-21'
    }]
});

$(function() {
    var timeOut = function() { //超时函数
        // $("#lotteryBtn").rotate({
        $("#rotatebg").rotate({
            angle: 0,
            duration: 10000,
            animateTo: 2160, //这里是设置请求超时后返回的角度，所以应该还是回到最原始的位置，2160是因为我要让它转6圈，就是360*6得来的
            callback: function() {
                alert('网络超时')
            }
        });
    };
    var rotateFunc = function(angle) { //angle:奖项对应的角度
        vmLottery.isRotate = true;
        vmLottery.chance--;

        // $('#rotatebg').stopRotate();
        $("#rotatebg").rotate({
            angle: 0,
            duration: 5000,
            animateTo: angle + 1440, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
            callback: function() {
                $('.mask').show();
                vmLottery.isRotate = false;
                vmLottery.count ++;
            }
        });
    };

    $("#lotteryBtn").rotate({
        bind: {
            click: function() {
                if (!vmLottery.isRotate) {
                    if (vmLottery.chance > 0) {
                        if(vmLottery.count < LOTTERYPEYDAY) {
                            vmLottery.prizeIndex = Math.floor(Math.random() * 8);
                            if(vmLottery.prizeIndex == 5) {
                                vmLottery.cash = round(Math.random() * 15);
                            }

                            rotateFunc(vmLottery.prize[vmLottery.prizeIndex].angle);
                        } else {
                            mui.alert('您已经达到每日抽奖上限，每天抽奖次数为' + LOTTERYPEYDAY + '次，请明天继续抽奖～');
                        }
                    } else {
                        mui.alert('您的抽奖机会用完了，快去完成下面的任务获得更多的抽奖机会吧～');
                    }
                }
            }
        }
    });
});

$(function() {
    $('.prizeModal-close').click(function() {
        $('.mask').hide();
    });
    $('#closeBtn').click(function() {
        $('.mask').hide();
    });
})