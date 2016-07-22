var hotel = controlCore.getHotel();

var vmStaff = avalon.define({
    $id:'staff',
    pageNo: 1,
    pageSize: 15,
    data: [],
    status: ['','正常','请假','调休','早退','旷工','迟到'],
    goPaiban: function(){
        stopSwipeSkip.do(function() {
            location.href="../manage/paiban-form.html";
        });
    },
    goAdd: function(){
        stopSwipeSkip.do(function() {
            hotel.staffUid = 0;
            Storage.set("hotel", hotel);

            location.href = "../manage/addstaff-form.html";
        });
    },
    goDetail: function(uid) {
        stopSwipeSkip.do(function() {
            hotel.staffUid = uid;

            Storage.set("hotel", hotel);
            location.href = "../manage/staff-detail.html";
        });
    }
});

//获取员工列表
ajaxJsonp({
    url: urls.employeeList,
    data: { 
        hid: hotel.hid, 
        pageNo: vmStaff.pageNo, 
        pageSize: vmStaff.pageSize 
    },
    successCallback: function(json) {
        if (json.status === 1) {
            vmStaff.pageNo ++;
            vmStaff.data = json.data.list;
        }
    }
});

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentrefresh: '正在加载...',
            contentnomore: "没有更多数据了",
            callback: loadmore
        }
    }
});

function loadmore() {
    ajaxJsonp({
        url: urls.employeeList,
        data: {
            hid: hotel.hid, 
            pageNo: vmStaff.pageNo, 
            pageSize: vmStaff.pageSize
        },
        successCallback: function(json) {
            if (json.data.count + json.data.pageSize > (vmStaff.pageNo * json.data.pageSize) && json.data.list.length > 0) {
                vmStaff.pageNo++;

                vmStaff.data.push.apply(vmStaff.data, json.data.list);

                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
            } else {
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
            }
        }
    });
}