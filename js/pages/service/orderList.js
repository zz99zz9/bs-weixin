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
    orderList: {
        roomNo: 1123,
    },
    list: [
        { orderNo: "a-8301", name: "赵先生", mobile: 13511123123 },
        { orderNo: "b-8301", name: "钱先生", mobile: 13511123123 },
        { orderNo: "c-8301", name: "孙女士", mobile: 12364567897 },
        { orderNo: "d-8301", name: "李先生", mobile: 13511123123 },
        { orderNo: "e-8301", name: "周先生", mobile: 78789123135 },
        { orderNo: "f-8301", name: "吴女士", mobile: 13511123123 },
        { orderNo: "c-8301", name: "孙女士", mobile: 12364567897 },
        { orderNo: "d-8301", name: "李先生", mobile: 13511123123 },
    ],
    isSend: 0, //0-不显示  1-显示
    send: function() { //发送订单
        stopSwipeSkip.do(function() {
            // mui.alert('注意提醒您的小伙伴查收订单哦。', "发送成功");
            if (vmServiceOrderList.isSend==0) {
                vmServiceOrderList.isSend = 1;
            } else {
               vmServiceOrderList.isSend = 0; 
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
vmServiceOrderList.data = vmServiceOrderList.list;
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
