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
        Storage.setLocal('user', { openUserInfo: 0});

        location.href = "index.html";
    },
    list: [],
    getList: function() {
        ajaxJsonp({
            url: urls.promotionList,
            successCallback: function(json) {
                if (json.status == 1) {
                    if(json.data.length == 0) {
                        mui.alert('您还没有成为推广奖励', function(){
                            location.href = document.referrer || 'index.html';
                        });
                    } else {
                        vmDetail.list = json.data;
                        vmDetail.taskList = [
                            [0, 0, 0],
                            [0, 0, 0]
                        ];
                        for(var i = 0; i<json.data.length; i++) {
                            var num = 0;
                            for(var j = 0; j<json.data[i].currentMonthTaskList.length; j++) {
                                if(json.data[i].currentMonthTaskList[j].status==1 || json.data[i].currentMonthTaskList[j].status==2) {
                                    vmDetail.taskList[i][num] = 1;
                                    num++;
                                }
                            }
                        }
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
                data: {pid: vmDetail.list[index].id},
                successCallback: function(json) {
                    if (json.status == 1) {
                        vmDetail.getList();

                        vmDetail.isShowMask = true;
                    } else {
                        mui.alert(json.message);
                    }
                }
            });
        });
    },
    taskList: [
        [0, 0, 0],
        [0, 0, 0],
    ],
    getTaskStatus: function(prIndex, taskIndex) {
        return vmDetail.taskList[prIndex][taskIndex];
    },
    a: 0,
    complete: function(prIndex, taskIndex) {
        if(!vmDetail.taskList[prIndex][taskIndex]) {
            var todayDone = false;
            vmDetail.$model.list[prIndex].currentMonthTaskList.map(function(t) {
                if(t.submitTime.slice(0,10) == getToday('date')) {
                    todayDone = true;
                    mui.alert('Sorry, 每天只能完成一次任务！');
                }
            });

            if(!todayDone) {
                mui.confirm('已经完成本次推广？','',["否", "是"], function(e) {
                    if(e.index == 1) {
                        //记录当前轮播页
                        Storage.set('prData', { index: prIndex });
                        
                        ajaxJsonp({
                            url: urls.submitPromoteTaskList,
                            data: {pid: vmDetail.list[prIndex].id},
                            successCallback: function(json) {
                                if (json.status == 1) {
                                    vmDetail.taskList[prIndex][taskIndex] = 1;

                                    var done = true;
                                    for(var i = 0; i < vmDetail.$model.list[prIndex].monthShareTimes; i++ ) {
                                        if(vmDetail.$model.taskList[prIndex][i] == 0) {
                                            done = false;
                                        }
                                    }

                                    if(done) {
                                        mui.alert('感谢您的支持，本宿工作人员审核后，推广奖励将汇入您的钱包，请及时查询！');
                                    }

                                    vmDetail.getList();
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
    swiper: function() {
        var swiper = new Swiper('.swiper', {
            initialSlide: prData.index,
            slidesPerView: 1,
            width: window.innerWidth - 20,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4,
            // onSlideChangeEnd: function(swiper) {
            //     prData.index = swiper.activeIndex;
            //     Storage.set('prData', prData);
            // }
        });
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
