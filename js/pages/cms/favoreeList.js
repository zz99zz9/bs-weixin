var vmFavoreeList = avalon.define({
    $id: 'favoreeList',
    num: 0,
    list: [],
    fid: 0,
    getFid: function() {
        ajaxJsonp({
            url: urls.getFoundationByUid,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmFavoreeList.fid = json.data.id;

                    vmFavoreeList.getList();
                } else {
                    mui.alert(json.message, function() {
                        location.href = document.referrer || '../index.html';
                    });
                }
            }
        })
    },
    pageNo: 1,
    pageSize: 9,
    getList: function() {
        ajaxJsonp({
            url: urls.benefitStudentList,
            data: {
                pageNo: vmFavoreeList.pageNo,
                pageSize: vmFavoreeList.pageSize,
                fid: vmFavoreeList.fid
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmFavoreeList.pageNo++;
                    vmFavoreeList.num = json.data.count;
                    vmFavoreeList.list = json.data.list;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    goEdit: function(id) {
        stopSwipeSkip.do(function() {
            location.href = 'favoree.html?id=' + id;
        });
    },
    goAdd: function() {
        location.href = 'favoree.html';
    }
});

vmFavoreeList.getFid();

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
        url: urls.benefitStudentList,
        data: {
            fid: vmFavoreeList.fid,
            pageSize: vmFavoreeList.pageSize,
            pageNo: vmFavoreeList.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmFavoreeList.pageNo++;
                vmFavoreeList.list.push.apply(vmFavoreeList.list, json.data.list);
                if (vmFavoreeList.pageNo <= json.data.pageCount) {
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
