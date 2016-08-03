var vmOrders = avalon.define({
    $id: 'orders',
    list1: [], //当前订单列表
    list2: [], //历史订单列表
    goDetail: function(id) {
        location.href = "order.html?&id=" + id;
    },
    showActionText: function(status) {
        switch (status) {
            case 1: //待付款
                return "支付";
            case 2: //未入住
                return "退订房间";
            case 3: //已入住
                return "退房";
            case 4: //已离店
                return "去评价";
        }
    },
    showStatus: function(status) {
        //1-待付款；2-待入住；3-已入住；4-已离店；8-已退订；9-已取消
        switch (status) {
            case 1:
                return "待支付";
            case 2:
                return "未入住";
            case 3:
                return "已入住";
            case 4:
                return "已完成";
            case 8:
                return "已退订";
            case 9:
                return "已取消";  
        }
    }
});

show1();
show2();

function show1() {
    ajaxJsonp({
        url: urls.getOrderList,
        data: {
            statusList: '1,2,3'
        },
        successCallback: function(json) {
            if (json.status !== 1) {
                alert(json.message)
                return;
            } else {
                vmOrders.list1 = json.data.list;
            }
        }
    });
}

function show2() {
    ajaxJsonp({
        url: urls.getOrderList,
        data: {
            statusList: '4'
        },
        successCallback: function(json) {
            if (json.status !== 1) {
                alert(json.message)
                return;
            } else {
                vmOrders.list2 = json.data.list;
            }
        }
    });
}
