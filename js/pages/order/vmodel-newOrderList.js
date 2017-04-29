var vmOrders = avalon.define({
    $id: 'orders',
    list1: [{
        "id": 272,
        "orderNo": "20170404163331882505",
        "status": 2,
        "needAmount": 240,
        "isComment": 0,
        "hotel": {
            "id": 1,
            "name": "本宿酒店",
            "address": "惠南镇西门路18号彩虹商务大厦11楼",
        },
        "orderRoomList": [{
            "id": 278,
            "name": "NO.102",
            "startTime": "2017-03-29 18:00:00",
            "endTime": "2017-03-30 12:00:00",
            "timeCount": 1,
            "status": 1,
            "coverUrl": "uploadsImg/20160323/img/b09163eb-213d-4f0c-9e87-a9c3aaa3f764100.jpg"
        }]
    }], //当前订单列表
    list2: [], //历史订单列表
    name: '朱杰',
    mobile: '18745940055',
    goDetail: function(id, status) {
        if (status == 2 || status == 3) {
            location.href = "service/ready.html";
        } else if (status == 1) {
            location.href = "order.html?&id=" + id;
        }
        vmOrders.saveRoom();
    },
    showActionText: function(status) {
        switch (status) {
            case 1: //待付款
                return "支付";
            case 2: //未入住
                return "去入住";
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
    },
    saveRoom: function() {  //存储要开的房间信息，session里
        Storage.set("currentRoom", { roomId: 1, roomName: '一号' });
    },
});

//show1();
show2();

//function show1() {
//  ajaxJsonp({
//      url: urls.getOrderList,
//      data: {
//          statusList: '1,2,3'
//      },
//      successCallback: function(json) {
//          if (json.status !== 1) {
//              alert(json.message)
//              return;
//          } else {
//              vmOrders.list1 = json.data.list;
//          }
//      }
//  });
//}

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

