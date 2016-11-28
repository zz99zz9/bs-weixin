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
            }
        });
    },
    calDates: function(date, count) {
        return calDates(date, count);
    },
    round: function(a, b) {
       return round(a, b); 
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
