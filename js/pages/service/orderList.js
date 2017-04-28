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
            if(isMe) {
                location.href = "process.html";
            } else {
                // mui.alert('注意提醒您的小伙伴查收订单哦。', "发送成功");
                if (vmServiceOrderList.isSend==0) {
                    vmServiceOrderList.isSend = 1;
                } else {
                   vmServiceOrderList.isSend = 0; 
                }
            }   
        })
    },
    goIndex: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index.html";
        })
    },
    goRoom: function() {
        stopSwipeSkip.do(function() {
            location.href = "service/orderList.html";
        })
    },
    goOrder: function() {
        stopSwipeSkip.do(function() {
            location.href = "../newOrderList.html";
        })
    },
    goMore: function() {
        stopSwipeSkip.do(function() {
            location.href = "../more.html";
        })
    },
    // isDisabled: true,
    // changed: function(a) {
    //     vmServiceOrderList.newActualQuantity = vmServiceOrderList.newActualQuantity.replace(/\D/g, '');
    //     if (a != vmServiceOrderList.actualQuantity) {
    //         vmServiceOrderList.isDisabled = false;
    //     } else {
    //         vmServiceOrderList.isDisabled = true;
    //     }

    // },
    modify: function() {
        if (!vmServiceOrderList.isDisabled) {
            vmServiceOrderList.isDisabled = true;
            ajaxJsonp({
                url: urls.articleModify,
                data: {
                    hid: hotel.hid,
                    cid: articleid,
                    actualQuantity: vmServiceOrderList.newActualQuantity
                },
                successCallback: function(json) {
                    if (json.status === 1) {
                        alert("修改成功");
                        vmServiceOrderList.actualQuantity = vmServiceOrderList.newActualQuantity;
                    } else {
                        vmServiceOrderList.isDisabled = false;
                        alert(json.massage);
                    }
                }
            });
        }
    },
});
vmServiceOrderList.getData();

// vmServiceOrderList.$watch("newActualQuantity", function(a) {
//     if (a != vmServiceOrderList.actualQuantity && a != '') {
//         vmServiceOrderList.isDisabled = false;
//     } else {
//         vmServiceOrderList.isDisabled = true;
//     }
//     vmServiceOrderList.newActualQuantity = vmServiceOrderList.newActualQuantity.replace(/\D/g, '');

// });

// var listData = {
//     vm: vmServiceOrderList,
//     url: urls.articleDetail,
//     data: {
//         //hid: hotel.hid,
//         //cid: articleid,
//         pageNo: vmServiceOrderList.pageNo,
//         pageSize: vmServiceOrderList.pageSize
//     }
// };

// ajaxJsonp({
//     url: urls.articleGoods,
//     data: { hid: hotel.hid, id: articleid },
//     successCallback: function(json) {
//         if (json.status === 1) {
//             vmServiceOrderList.name = json.data.name;
//             vmServiceOrderList.onlineStock = json.data.onlineStock;
//             vmServiceOrderList.monthAmount = json.data.monthAmount;
//             $("#headerReplace").text(vmServiceOrderList.name);
//         }
//     }
// });

// ajaxJsonp({
//     url: urls.articleDetail,
//     data: listData.data,
//     successCallback: function(json) {
//         if (json.status === 1) {
//             vmServiceOrderList.pageNo++;
//             vmServiceOrderList.list.push.apply(vmServiceOrderList.list, json.data.list);
//         } else {
//             alert(json.message);
//         }
//     }
// });
