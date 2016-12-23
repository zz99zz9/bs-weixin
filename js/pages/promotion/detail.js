var prData = Storage.get('prData');

if (!prData) {
    prData = { index: 0 };
} else {
    if (!prData.index) {
        prData.index = 0;
    }
}

var vmDetail = avalon.define({
    $id: 'detail',
    isShowMask: false,
    hideMask: function() {
        vmDetail.isShowMask = false;
        Storage.setLocal('user', { openUserInfo: 1 });

        location.href = "index.html";
    },
    list: [],
    isNormal: true,
    getList: function() {
        ajaxJsonp({
            url: urls.promotionList,
            successCallback: function(json) {
                if (json.status == 1) {
                    if (json.data.length == 0) {
                        mui.alert('您还没有开通推广奖励计划', function() {
                            location.href = document.referrer || 'index.html';
                        });
                    } else {
                        vmDetail.taskList = [];
                        for (var x = 0; x < json.data.length; x++) {
                            vmDetail.taskList.push([0, 0, 0, 0]);
                        }

                        for (var i = 0; i < json.data.length; i++) {
                            //VIP卡才显示开通提示
                            if (json.data[i].userBuyCard.type < 4) {
                                vmDetail.isNormal = false;
                                vmDetail.circleGolden = i;
                            }

                            var num = 0;
                            for (var j = 0; j < json.data[i].currentMonthTaskList.length; j++) {
                                if (json.data[i].currentMonthTaskList[j].status == 1 || json.data[i].currentMonthTaskList[j].status == 2) {
                                    vmDetail.taskList[i][num] = 1;
                                    num++;
                                }
                            }
                        }

                        vmDetail.list = json.data;
                        vmDetail.a++;
                    }
                }
            }
        });
    },
    goPromotion: function(index) {
        mui.alert('开通成功', function() {
            //开通套餐
            ajaxJsonp({
                url: urls.goPromotion,
                data: { pid: vmDetail.list[index].id },
                successCallback: function(json) {
                    if (json.status == 1) {
                        vmDetail.getList();

                        if (!vmDetail.isNormal) {
                            vmDetail.isShowMask = true;
                        }
                    } else {
                        mui.alert(json.message);
                    }
                }
            });
        });
    },
    taskList: [],
    getTaskStatus: function(prIndex, taskIndex) {
        return vmDetail.taskList[prIndex][taskIndex];
    },
    a: 0,
    complete: function(prIndex, taskIndex) {
        if (!vmDetail.taskList[prIndex][taskIndex]) {
            var todayDone = false;

            vmDetail.list[prIndex].currentMonthTaskList.map(function(t) {
                if (t.submitTime.slice(0, 10) == getToday('date')) {
                    todayDone = true;
                    mui.alert('Sorry, 每天只能完成一次任务！');
                }
            });

            if (!todayDone) {
                vmShareList.ptid = vmDetail.list[prIndex].id;
                vmPopover.useCheck = 0;
                popover('./util/shareList.html', 1, function() {});
            }
        }
    },
    openRule: function() {
        vmPopover.useCheck = 0;
        popover('./util/promotion-rule.html', 1);
    },
    openCard: function() {
        location.href = "card-list.html";
    },
    swiper: function() {
        var swiper = new Swiper('.swiper', {
            initialSlide: prData.index,
            slidesPerView: 1,
            width: window.innerWidth - 20,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4,
            onSlideChangeEnd: function(swiper) {
                prData.index = swiper.activeIndex;
                Storage.set('prData', prData);
                vmDetail.animation(swiper.activeIndex); //画金圈，传的参数表示是第几个页面
            }
        });
        if (vmDetail.list.length == 1) {
            vmDetail.animation(prData.index);
        }
        vmDetail.$model.list.map(function(ob) {
            var canvasIni = vmDetail.canvasIni(ob);
            if (canvasIni) {
                vmDetail.drawCircle(canvasIni.context, "grey", -4); //先画第一个灰
            }
        })
    },
    calDates: function(date, count) {
        return calDates(date, count);
    },
    round: function(a, b) {
        return round(a, b);
    },
    //画布初始化
    canvasIni: function(ob) {
        var $circle = $("#circleGolden" + ob.id).get(0);//取到html对应id的canvas
        if ($circle) {
            var context = $circle.getContext('2d');
            $circle.height = 160;
            $circle.width = window.innerWidth;
            return { $circle: $circle, context: context };
        } else {
            return false;
        }
    },
    //画圈
    drawCircle: function(context, color, step) { //传参为context，填充颜色，度数
        context.beginPath();
        context.arc((window.innerWidth) / 2,
            95,
            75, getRadians(135), getRadians(135 + step * 22.5), false);
        context.lineWidth = 7;
        context.strokeStyle = color;
        context.stroke();
    },
    //动画画圈
    animation: function(index) {
        var ob = vmDetail.$model.list[index]; //选定第几个
        var canvasIni = vmDetail.canvasIni(ob);
        if (canvasIni) {
            var x = ob.finishedCount;
            var y = parseFloat((ob.finishedCount / 400).toFixed(3));//完成期数除以400
            function go() {
                canvasIni.context.clearRect(0, 0, canvasIni.$circle.width, 160);//清除一下
                vmDetail.drawCircle(canvasIni.context, "grey", -4); //先画第一个灰
                vmDetail.drawCircle(canvasIni.context, "rgb(186,160,113)", y); //画金色的
                y = y + parseFloat((ob.finishedCount / 400).toFixed(3));
                if (y < x) {
                    setTimeout(function() {
                        go()
                    }, 5);
                }
            }
            go();
        }
    }
});

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 1, //1 checkButton, 0 closeButton
    ok: function() {
        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

//分享内容弹窗
var vmShareList = avalon.define({
    $id: 'shareList',
    ptid: 0,
    list: [],
    getList: function() {
        ajaxJsonp({
            url: urls.getShareList,
            data: { pageSize: 5 },
            successCallback: function(json) {
                if (json.status == 1) {
                    json.data.list.map(function(o) {
                        o.imgUrl = urlAPINet + o.imgUrl;
                        vmShareList.list.push(o);
                    })
                } else {
                    mui.alert(json.message);
                }
            }
        });
    }
});

vmDetail.getList();
vmShareList.getList();
