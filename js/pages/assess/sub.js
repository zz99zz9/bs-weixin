// var orderid = getParam("oid");
// if(orderid != "") {
//     if(isNaN(orderid)) {
//         location.href = document.referrer || "index.html";
//     } else {
//         orderid = parseInt(orderid);
//     }
// } else {
//     location.href = "index.html";
// }
var vmSub = avalon.define({
    $id: "sub",
    scoreList: [
        { name: '洗浴舒适度', r: 1, s: 5, list: [1, 2, 3, 4, 5] },
        { name: '睡眠舒适度', r: 2, s: 5, list: [1, 2, 3, 4, 5] },
        { name: '服务态度', r: 3, s: 5, list: [1, 2, 3, 4, 5] },
    ],
    data: {
        content: '',
        post: '上海南汇迪斯尼店店长',
        name: '唐朝李白',
        message: '君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。',
        inHome: '上海迪斯尼店 MAX-031',
        inTime: '2016.8.31——2016.9.31',
    },
    isDisabled: false,
    // changed: function() {
    //     if (vmSub.content.length > 200 ) {
    //         vmSub.isDisabled = true;
    //         return;
    //     }
    //     console.log(vmSub.content.length);
    //     vmSub.isDisabled = false;
    // },
    click: function(r, s) {
        vmSub.scoreList[r - 1].s = s;
    },
    save: function() {
        if (vmSub.content.length >= 200) {
            alert("内容请少于200字哦！");
            return false;
        }
        vmSub.isDisabled = true;

        ajaxJsonp({
            url: urls.saveSub,
            data: {
                oid: 1,
                content: vmSub.content,
                score1: vmSub.scoreList[0].s,
                score2: vmSub.scoreList[1].s,
                score3: vmSub.scoreList[2].s
            },
            successCallback: function(json) {
                if (json.status != 1) {
                    alert(json.message);
                    vmSub.isDisabled = false;
                } else if (json.status == 1) {
                    location.href = document.referrer || "index.html";
                }
            }
        });
    }
});

