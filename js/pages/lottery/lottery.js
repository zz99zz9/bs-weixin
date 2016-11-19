var vmLottery = avalon.define({
    $id: 'lottery',
    chance: 0, //拥有的抽奖机会
    count: 0, //当天已抽次数
    max: 3, //每天抽奖上限
    getChance: function() {
        ajaxJsonp({
            url: urls.getLotteryTimes,
            successCallback: function(json) {
                if (json.status > 0) {
                    vmLottery.chance = json.data.total;
                    vmLottery.count = json.data.today;
                    vmLottery.max = json.data.max;
                } 
            }
        });
    },
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
    getPrize: function() {
        ajaxJsonp({
            url: urls.getPrize,//1-iPhone 7 Plus；2-锤子M1L；3-小米手环2；4-床品礼包；5-免费入住iroom max；6-免费入住iroom；7-洗护礼包；8-现金红包
            successCallback: function(json) {
                if (json.status > 0) {
                    switch(json.data.flag) {
                        case 1:
                            vmLottery.prizeIndex = 7;
                            break;
                        case 2:
                            vmLottery.prizeIndex = 4;
                            break;
                        case 3:
                            vmLottery.prizeIndex = 6;
                            break;
                        case 4:
                            vmLottery.prizeIndex = 3;
                            break;
                        case 5:
                            vmLottery.prizeIndex = 0;
                            break;
                        case 6:
                            vmLottery.prizeIndex = 1;
                            break;
                        case 7:
                            vmLottery.prizeIndex = 2;
                            break;
                        case 8:
                            vmLottery.prizeIndex = 5;
                            vmLottery.cash = json.data.amount;
                            break;
                    }

                    rotateFunc(vmLottery.prize[vmLottery.prizeIndex].angle);
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    winnerList: [],
    getWinnerList: function() {
        ajaxJsonp({
            url: urls.getWinnerList,
            data: { pageSize: 10, pageNo:1 },
            successCallback: function(json) {
                if (json.status > 0) {
                    var rank = -1;
                    json.data.list.map(function(o) {
                        switch(o.flag) {
                            case 1:
                                rank = 7;
                                break;
                            case 2:
                                rank = 4;
                                break;
                            case 3:
                                rank = 6;
                                break;
                            case 4:
                                rank = 3;
                                break;
                            case 5:
                                rank = 0;
                                break;
                            case 6:
                                rank = 1;
                                break;
                            case 7:
                                rank = 2;
                                break;
                            case 8:
                                rank = 5;
                                break;
                        }

                        vmLottery.winnerList.push({
                            name: o.user.mobile,
                            rank: rank,
                            amount: o.amount,
                        })
                    });
                } 
            }
        });
    },
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
    getText: function(type) {
        if(vmLottery.cardTypeList.indexOf(4)>-1) {
            if(type==4) {
                return '完成';
            } else {
                return '升级';
            }
        } else {
            return '完成';
        }
    },
    openLog: function() {
        popover('./util/lottery-log.html', 1);
    },
    openRule: function() {
        popover('./util/lottery-rule.html', 1);
    },
    goPromotion: function(type) {
        if(vmLottery.cardTypeList.indexOf(4)>-1) {
            if(type<4) {
                location.href = 'card-list.html';
            } else {
                location.href = 'promotion-detail.html';
            }
        } else {
            if(vmLottery.cardTypeList.indexOf(type)>-1) {
                location.href = 'promotion-detail.html';
            }
        }
        
    },
    cardTypeList: [],
    getCardList: function() {
        ajaxJsonp({
            url: urls.getCardList,
            successCallback: function(json) {
                if (json.status == 1) {
                    json.data.map(function(o) {
                        vmLottery.cardTypeList.push(o.type);
                    })
                }
            }
        });
    },
    cardDataList: {id: ''},
    getCard: function() {
        ajaxJsonp({
            url: urls.getCardAccountList,
            successCallback: function(json) {
                if (json.status === 1) {
                    if (json.data.length) {
                        vmLottery.cardDataList.id = json.data[0].id;
                    }
                }
            }
        });
    },
    goLog: function() {
        if (vmLottery.prizeIndex == 5) {
            location.href = 'card-log.html?cid=' + vmLottery.cardDataList.id;
        } else {
            vmLottery.openLog();
        }
    },
    //获取所有会员卡列表
    data: [],
    getData: function() {
        ajaxJsonp({
            url: urls.getAllDicCardList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmLottery.data = [];
                    json.data.map(function(c) {
                        if (c.id == 4) {
                            c.imgUrl = 'img/card/card_null.svg';
                        } else {
                            c.imgUrl = 'img/card/card_No' + c.id + '.svg';
                        }
                        vmLottery.data.push(c);
                    });
                    console.log(111);
                }
            }
        });
        
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
    showLoadmore: true,
    list: [],
    pageNo: 1,
    pageSize: 10,
    getList: function() {
        ajaxJsonp({
            url: urls.getPrizeLogList,
            data: { 
                pageSize: vmLog.pageSize, 
                pageNo:vmLog.pageNo, 
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmLog.pageNo ++;

                    if(json.data.pageCount <= json.data.pageNo) {
                        vmLog.showLoadmore = false;
                    }

                    var rank = -1;
                    json.data.list.map(function(o) {
                        switch(o.flag) {
                            case 1:
                                rank = 7;
                                break;
                            case 2:
                                rank = 4;
                                break;
                            case 3:
                                rank = 6;
                                break;
                            case 4:
                                rank = 3;
                                break;
                            case 5:
                                rank = 0;
                                break;
                            case 6:
                                rank = 1;
                                break;
                            case 7:
                                rank = 2;
                                break;
                            case 8:
                                rank = 5;
                                break;
                        }

                        vmLog.list.push({
                            name: vmLottery.prize[rank].text,
                            img: vmLottery.prize[rank].img,
                            amount: o.amount,
                            createTime: o.createTime,
                            quantity: o.quantity
                        })
                    });
                } 
            }
        });
    }
});

vmLottery.getChance();
vmLottery.getWinnerList();
vmLottery.getCardList();
vmLottery.getCard();
vmLottery.getData();
vmLog.getList();

function rotateFunc(angle) { //angle:奖项对应的角度
    vmLottery.isRotate = true;
    vmLottery.chance--;

    // $('#rotatebg').stopRotate();
    $("#rotatebg").rotate({
        angle: 0,
        duration: 5000,
        animateTo: angle + 1440, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
        callback: function() {
            // $('.mask').show();
            modalShow('./util/prizeModal.html', 1, function() {
                vmLottery.isRotate = false;
                vmLottery.count ++;
            });
        }
    });
};

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

    $("#lotteryBtn").rotate({
        bind: {
            click: function() {
                if (!vmLottery.isRotate) {
                    if (vmLottery.chance > 0) {
                        if(vmLottery.count < vmLottery.max) {
                            // vmLottery.prizeIndex = Math.floor(Math.random() * 8);
                            // if(vmLottery.prizeIndex == 5) {
                            //     vmLottery.cash = round(Math.random() * 15);
                            // }
                            vmLottery.getPrize();
                        } else {
                            mui.alert('您已经达到每日抽奖上限，每天抽奖次数为' + vmLottery.max + '次，请明天继续抽奖～');
                        }
                    } else {
                        mui.alert('您的抽奖机会用完了，快去完成下面的任务获得更多的抽奖机会吧～');
                    }
                }
            }
        }
    });
});

registerWeixinConfig(function() {
    wx.ready(function() {

        //隐藏菜单项
        wx.hideMenuItems({
            menuList: [
                "menuItem:share:qq", // 分享到QQ
                "menuItem:share:weiboApp", // 分享到Weibo
                "menuItem:share:QZone" // 分享到 QQ 空间
            ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });

        wx.onMenuShareTimeline({
            title: '抽奖进行中', // 分享标题
            link: location.href, // 分享链接
            imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
                mui.alert("感谢您的厚爱与支持");
            },
            cancel: function() {
                console.log('取消分享到朋友圈');
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareAppMessage({
            title: '抽奖进行中', // 分享标题
            desc: '厉害了我的本宿', // 分享描述
            link: location.href, // 分享链接
            imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // 用户确认分享后执行的回调函数
                mui.alert("感谢您的厚爱与支持");
            },
            cancel: function() {
                console.log("取消分享到个人");
                // 用户取消分享后执行的回调函数
            }
        });
    });
});