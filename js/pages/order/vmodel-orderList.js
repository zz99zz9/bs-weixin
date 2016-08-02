var vmOrders = avalon.define({
    $id: 'orders',
    list1: [], //当前订单列表
    list2: [], //历史订单列表
    goDetail: function(id) {
        location.href = "order.html?&id=" + id;
    },
    action: function() {

        event.stopPropagation();
        console.log(123);
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
            statusList: '4,5,6,7,8,9'
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
