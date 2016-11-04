var vmDetail = avalon.define({
    $id: 'detail',
    data: 'kill',
    pageNo: 1,
    pageSize: 10,
    list1: [],   //左侧列表
    list2: [],   //右侧列表
    foundation: "基金创始于2012年，从最初发起人个人资助特贫困大学生完成学业开始，迅速发展成苏北地区具有较高影响力的助学公益组织，秉承基金创始人杜玉莲女士“让每个孩子只少能够拥有受教育的机会”之理念，坚持资助必须有始有终，不为名利，只为能够保留孩子心中那一丝对未来的期望！",
    getData1: function() {
        ajaxJsonp({
            url: urls.getAuditList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetail.pageNo++;
                    vmDetail.list1 = [];
                    json.data.list.map(function(e) {
                        vmDetail.list1.push({
                            id: e.id,
                            name1: e.user.name,
                            cardNo: e.userBuyCard.cardNo,
                            headUrl: e.user.headUrl,
                            mobile: e.user.mobile,
                            time: e.submitTime,
                        })
                    });
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },

    getData: function() {
        ajaxJsonp({
            url: urls.benefitStudentList,
            data: { fid: 1 },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetail.pageNo++;
                    vmDetail.list = [];
                    json.data.list.map(function(e) {
                        vmDetail.list1.push({
                            id: e.id,
                            name1: e.user.name,
                            cardNo: e.userBuyCard.cardNo,
                            headUrl: e.user.headUrl,
                            mobile: e.user.mobile,
                            time: e.submitTime,
                        })
                    });
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    getData2: function() {
        ajaxJsonp({
            url: urls.getAllDicCardList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetail.pageNo++;
                    vmDetail.list2 = [];
                    json.data.map(function(c) {
                        vmDetail.list2.push({
                            id: c.id,
                            name2: c.name,
                            number: c.lotteryDefaultTimes,
                        })
                    })
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    listType: 1, //1、左边列表  2、右边列表
    getButton: function(id) {
        mui('#pullrefresh').pullRefresh().refresh(true);
        if (id == 1) {
            vmDetail.listType = 1;
            $(".detail-left-tab").css("background-color", "#baa071");
            $(".detail-left-up").css("color", "white");
            $(".detail-right-tab").css("background-color", "white");
            $(".detail-right-up").css("color", "black");
        } else {
            vmDetail.listType = 2;
            $(".detail-right-tab").css("background-color", "#baa071");
            $(".detail-right-up").css("color", "white");
            $(".detail-left-tab").css("background-color", "white");
            $(".detail-left-up").css("color", "black");
        }
    },
    // goBuyCard: function(id) {
    //     location.href = "card-buy.html?cid=" + id;
    // }
});

vmDetail.getData1();
vmDetail.getData2();
vmDetail.getData();

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            height: 50, //可选,默认50.触发下拉刷新拖动距离,
            auto: false, //可选,默认false.自动下拉刷新一次
            contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: reload //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        up: {
            height: 50, //可选.默认50.触发上拉加载拖动距离
            auto: false, //可选,默认false.自动上拉加载一次
            contentrefresh: '正在加载...',
            contentnomore: "没有更多数据了",
            callback: loadmore
        }
    }
});

function reload() {
    vmDetail.getData1();
    vmDetail.getData2();
    vmDetail.pageNo = 1;
    vmDetail.list1 = [];
    vmDetail.list2 = [];
    ajaxJsonp({
        url: urls.getAuditList,
        data: {
            pageSize: vmDetail.pageSize,
            pageNo: vmDetail.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDetail.pageNo = 2;
                vmDetail.list1 = [];
                json.data.list.map(function(e) {
                    vmDetail.list1.push({
                        id: e.id,
                        name1: e.user.name,
                        cardNo: e.userBuyCard.cardNo,
                        headUrl: e.user.headUrl,
                        mobile: e.user.mobile,
                        time: e.submitTime,
                    })
                });
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                mui('#pullrefresh').pullRefresh().refresh(true);
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);

            }
        }
    });
    ajaxJsonp({
        url: urls.getAllDicCardList,
        data: {
            pageSize: vmDetail.pageSize,
            pageNo: vmDetail.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDetail.pageNo = 2;
                vmDetail.list2 = [];
                json.data.map(function(c) {
                    vmDetail.list2.push({
                        id: c.id,
                        name2: c.name,
                        number: c.lotteryDefaultTimes,
                    })
                });
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                mui('#pullrefresh').pullRefresh().refresh(true);
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);

            }
        }
    });
}

function loadmore() {
    ajaxJsonp({
        url: urls.getAuditList,
        data: {
            pageSize: vmDetail.pageSize,
            pageNo: vmDetail.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDetail.pageNo++;
                json.data.list.map(function(e) {
                    vmDetail.list1.push({
                        id: e.id,
                        name1: e.user.name,
                        cardNo: e.userBuyCard.cardNo,
                        headUrl: e.user.headUrl,
                        mobile: e.user.mobile,
                        time: e.submitTime,
                    })
                });
                if (vmDetail.pageNo <= json.data.pageCount) {
                    mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
                } else {
                    mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
                }
            } else {
                console.log(json.message);
            }
        }
    });
    ajaxJsonp({
        url: urls.getAllDicCardList,
        data: {
            pageSize: vmDetail.pageSize,
            pageNo: vmDetail.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDetail.pageNo++;
                json.data.map(function(c) {
                    vmDetail.list2.push({
                        id: c.id,
                        name2: c.name,
                        number: c.lotteryDefaultTimes,
                    })
                });
                if (vmDetail.pageNo <= json.data.pageCount) {
                    mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
                } else {
                    mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
                }
            } else {
                console.log(json.message);
            }
        }
    });
}
