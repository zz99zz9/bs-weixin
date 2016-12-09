var id = getParam("id");
var cid = getParam("cid");
console.log(cid);
var vmDetail = avalon.define({
    $id: 'detail',
    data: {
        cnName: '',
        enName: '',
        logoUrl: '',
        brief: ''
    },
    pageNo: 1,
    pageSize: 10,
    list1: [], //左侧列表
    list2: [], //右侧列表
    amount: '', //该用户捐赠总额
    join: '',
    //判断是否显示下方按钮
    getAmount: function() {
        //每月捐赠金额
        ajaxJsonp({
            url: urls.getDonationAmount,
            data: {
                cid: cid,
                fid: id
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetail.join = json.data.join;
                    vmDetailPop.amount = json.data.amount;
                    vmDetailPop.join = json.data.join;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    //基金信息
    getData: function() {
        //每月捐赠金额
        ajaxJsonp({
            url: urls.getFoundationInfo,
            data: {
                id: id
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetail.data = json.data;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    studentCount: 0, //该基金资助学生人数
    getChildren: function() {
        ajaxJsonp({
            url: urls.benefitStudentList,
            data: { fid: id },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetail.pageNo++;
                    vmDetail.list1 = [];
                    vmDetail.studentCount = json.data.count;
                    json.data.list.map(function(d) {
                        vmDetail.list1.push({
                            id: d.id,
                            name: d.name,
                            grade: d.grade,
                            imgUrl: d.imgUrl,
                            reason: d.reason
                        })
                    });
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    getDonor: function() {
        ajaxJsonp({
            url: urls.getDonationList,
            data: { fid: id },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetail.pageNo++;
                    vmDetail.list2 = [];
                    json.data.list.map(function(c) {
                        vmDetail.list2.push({
                            id: c.id,
                            name: c.user.name,
                            imgUrl: c.user.headUrl,
                            number: c.sumAmount,
                        })
                    })
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    moneySum: 0, //该基金捐赠总额
    //捐赠总额
    getSum: function() {
        ajaxJsonp({
            url: urls.benefitAmount,
            data: { fid: id },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetail.moneySum = json.data.totalDonateAmount;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    listType: 1, //1、左边列表  2、右边列表
    getButton: function(id) {
        //mui('#pullrefresh').pullRefresh().refresh(true);
        if (id == 1) {
            vmDetail.listType = 1;
            $(".detail-left-tab").css("border-bottom", "2px solid #baa071");
            $(".detail-left-up").css("color", "#baa071");
            $(".detail-left-down").css("color", "#baa071");
            $(".detail-right-tab").css("border-bottom", "1px solid #999");
            $(".detail-right-up").css("color", "#999");
            $(".detail-right-down").css("color", "#999");
        } else {
            vmDetail.listType = 2;
            $(".detail-right-tab").css("border-bottom", "2px solid #baa071");
            $(".detail-right-up").css("color", "#baa071");
            $(".detail-right-down").css("color", "#baa071");
            $(".detail-left-tab").css("border-bottom", "1px solid #999");
            $(".detail-left-up").css("color", "#999");
            $(".detail-left-down").css("color", "#999");
        }
    },
    openPop: function() {
        modalShow('./util/commonweal-pop.html', 1);
    },
    //旋转右侧图片角度
    isUp: 0, //0:：向上   1：向下
    selectId: -1, //传的人id
    goRoate: function(id) {
        stopSwipeSkip.do(function() {
            console.log(0);
            if (vmDetail.isUp == 0) {
                $(".arrow").css("transform", "rotate(90deg)");
                vmDetail.selectId = id;
                vmDetail.isUp = 1;
            } else if (vmDetail.isUp == 1) {
                $(".arrow").css("transform", "rotate(0)");
                vmDetail.selectId = -1;
                vmDetail.isUp = 0;
            }
        });
    },
});

vmDetail.getAmount();
vmDetail.getData();
vmDetail.getChildren();
vmDetail.getDonor();
vmDetail.getSum();

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
    vmDetail.getChildren();
    vmDetail.getDonor();
    vmDetail.pageNo = 1;
    vmDetail.list1 = [];
    vmDetail.list2 = [];
    ajaxJsonp({
        url: urls.benefitStudentList,
        data: {
            fid: id,
            pageSize: vmDetail.pageSize,
            pageNo: vmDetail.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDetail.pageNo = 2;
                vmDetail.list1 = [];
                json.data.list.map(function(d) {
                    vmDetail.list1.push({
                        id: d.id,
                        name: d.name,
                        grade: d.grade,
                        imgUrl: d.imgUrl,
                        reason: d.reason,
                    })
                });
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                mui('#pullrefresh').pullRefresh().refresh(true);
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);

            }
        }
    });
    ajaxJsonp({
        url: urls.getDonationList,
        data: {
            fid: id,
            pageSize: vmDetail.pageSize,
            pageNo: vmDetail.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDetail.pageNo = 2;
                vmDetail.list2 = [];
                json.data.list.map(function(c) {
                    vmDetail.list2.push({
                        id: c.id,
                        name: c.user.name,
                        imgUrl: c.user.headUrl,
                        number: c.sumAmount,
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
        url: urls.benefitStudentList,
        data: {
            fid: id,
            pageSize: vmDetail.pageSize,
            pageNo: vmDetail.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDetail.pageNo++;
                json.data.list.map(function(d) {
                    vmDetail.list1.push({
                        id: d.id,
                        name: d.name,
                        grade: d.grade,
                        imgUrl: d.imgUrl,
                        reason: d.reason,
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
        url: urls.getDonationList,
        data: {
            fid: id,
            pageSize: vmDetail.pageSize,
            pageNo: vmDetail.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDetail.pageNo++;
                json.data.list.map(function(c) {
                    vmDetail.list2.push({
                        id: c.id,
                        name: c.user.name,
                        imgUrl: c.user.headUrl,
                        number: c.sumAmount,
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

var vmDetailPop = avalon.define({
    $id: 'detailPop',
    amount: 0,
    join: '', //true表示加入
    close: function() {
        modalClose();
    },
    go: function() {
        ajaxJsonp({
            url: urls.goDonate,
            data: {
                cid: cid,
                fid: id,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    mui.alert(json.message);
                    modalClose();
                    vmDetail.getAmount();
                    vmDetail.getChildren();
                    vmDetail.getDonor();
                    vmDetail.getButton(2);
                } else {
                    mui.alert(json.message);
                    modalClose();
                    vmDetail.getAmount();
                    vmDetail.getChildren();
                    vmDetail.getDonor();
                    vmDetail.getButton(2);
                }
            }
        });
    },
});
