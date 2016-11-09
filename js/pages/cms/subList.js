var vmSubList = avalon.define({
    $id: 'subList',
    num: 0,
    list: [],
    fid: 0,
    getFid: function() {
        ajaxJsonp({
            url: urls.getFoundationByUid,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmSubList.fid = json.data.id;

                    vmSubList.getList();
                } else {
                    mui.alert(json.message, function() {
                        location.href = document.referrer || '../index.html';
                    });
                }
            }
        })
    },
    pageNo: 1,
    pageSize: 3,
    getList: function() {
        vmSubList.pageNo = 1;
        ajaxJsonp({
            url: urls.getFoundationSubList,
            data: {
                pageNo: vmSubList.pageNo,
                pageSize: vmSubList.pageSize,
                fid: vmSubList.fid
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmSubList.pageNo++;
                    vmSubList.num = json.data.count;
                    vmSubList.list = json.data.list;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    goAdd: function() {
        location.href = "subAdd.html";
    },
    deleteSub: function(id) {
        stopSwipeSkip.do(function() {
            mui.confirm('确定要删除该账户吗？', function() {
                ajaxJsonp({
                    url: urls.deleteFoundationSub,
                    data: {
                        id: id
                    },
                    successCallback: function(json) {
                        if (json.status == 1) {
                            mui.alert('删除成功', function() {
                                mui('#pullrefresh').pullRefresh().refresh(true);
                                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);

                                vmSubList.getList();
                            });
                        } else {
                            mui.alert(json.message);
                        }
                    }
                });
            })
        });
    }
})


vmSubList.getFid();

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            height: 50, //可选.默认50.触发上拉加载拖动距离
            auto: false, //可选,默认false.自动上拉加载一次
            contentrefresh: '正在加载...',
            contentnomore: "没有更多数据了",
            callback: loadmore
        }
    }
});

function loadmore() {
    ajaxJsonp({
        url: urls.getFoundationSubList,
        data: {
            fid: vmSubList.fid,
            pageSize: vmSubList.pageSize,
            pageNo: vmSubList.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmSubList.pageNo++;
                vmSubList.list.push.apply(vmSubList.list, json.data.list);
                if (vmSubList.pageNo <= json.data.pageCount) {
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
