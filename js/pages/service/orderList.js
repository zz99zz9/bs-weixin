//var hotel = controlCore.getHotel();

// var articleid = getParam("id");
// if (articleid != "") {
//     if (isNaN(articleid)) {
//         location.href = document.referrer || "homepage.html";
//     } else {
//         articleid = parseInt(articleid);
//     }
// } else {
//     articleid = 0;
// }

var vmServiceOrderList = avalon.define({
    $id: 'serviceOrderList',
    name: '',
    pageNo: 1,
    pageSize: 10,
    data: [],
    getData: function() {
        ajaxJsonp({
            url: urls.getWaitRoomList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmServiceOrderList.data = json.data;
                }
            }
        });
    },
    isSend: 0, //0-不显示  1-显示
    sendBtnText: '发送订单',
    send: function(isMe) { //发送订单
        stopSwipeSkip.do(function() {
            if (isMe) {
                location.href = "process.html";
            } else {
                if (vmServiceOrderList.isSend == 0) {
                    console.log(22);
                    vmServiceOrderList.isSend = 1;
                } else {
                    vmServiceOrderList.isSend = 0;
                }
            }
        });
    },
    close: function() {
        vmServiceOrderList.isSend = 0;
    },
});
vmServiceOrderList.getData();
