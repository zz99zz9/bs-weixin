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
                        for(var x = 0; x<json.data.length; x++) {
                            vmDetail.taskList.push([0, 0, 0, 0]);
                        }

                        for (var i = 0; i < json.data.length; i++) {
                            if (json.data[i].name.indexOf('普通') == -1) {
                                vmDetail.isNormal = false;
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

                        /**
                         * canvas画圆形
                         */
                        $('.circle').each(function(i, o) {
                            var $circle = o;

                            var context = $circle.getContext('2d');
                            $circle.width = window.innerWidth;
                            $circle.height = 160;

                            context.beginPath();
                            context.arc((window.innerWidth) / 2,
                                95,
                                75, getRadians(135), getRadians(45), false);
                            context.lineWidth = 7;
                            context.strokeStyle = "rgb(186,160,113)";
                            context.stroke();
                        });
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
            console.log(prIndex);
            vmDetail.list[prIndex].currentMonthTaskList.map(function(t) {
                if (t.submitTime.slice(0, 10) == getToday('date')) {
                    todayDone = true;
                    mui.alert('Sorry, 每天只能完成一次任务！');
                }
            });

            if (!todayDone) {
                mui.confirm('请转发本宿相关内容到自己的朋友圈，内容可以采用本宿提供的，也可以自己创作编辑。', '', ["知道了", "已完成"], function(e) {
                    if (e.index == 1) {
                        //记录当前轮播页
                        Storage.set('prData', { index: prIndex });

                        ajaxJsonp({
                            url: urls.submitPromoteTaskList,
                            data: { pid: vmDetail.list[prIndex].id },
                            successCallback: function(json) {
                                if (json.status == 1) {
                                    vmDetail.taskList[prIndex][taskIndex] = 1;

                                    var done = 0;
                                    for (var i = 0; i < 4; i++) {
                                        if (vmDetail.taskList[prIndex][i]) {
                                            done++;
                                        }
                                    }

                                    if (done == vmDetail.list[prIndex].monthShareTimes) {
                                        mui.alert('感谢您的支持，本宿工作人员审核后，推广奖励将汇入您的钱包，请及时查询！');
                                    }

                                    location.href = 'promotion-detail.html';
                                } else {
                                    mui.alert(json.message);
                                }
                            }
                        });
                    }
                });
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
            }
        });
    },
    calDates: function(date, count) {
        return calDates(date, count);
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

vmDetail.getList();