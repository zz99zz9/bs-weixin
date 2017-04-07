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

var vmServiceReady = avalon.define({
    $id: 'serviceReady',
    name: '',
    pageNo: 1,
    pageSize: 10,
    data: [],
    temperature: "一键预温",
    orderList: {
        roomNo: 1123,
        startTime: 22,
    },
    list: [
        { id: 1, information: "儿童专用耗材及浴衣一套" },
        { id: 2, information: "周边地图一份" },
        { id: 3, information: "旅游景点介绍手册一份" },
        { id: 4, information: "已预约VR体验" },
    ],
    addService: function() { //添加更多定制服务
        stopSwipeSkip.do(function() {
            mui.prompt('您还需要？', '在此输入', ' ', ['提交', '取消'], null, 'div')
            document.querySelector('.mui-popup-input input').type = 'password'
        })
    },
    goIndex2: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index2.html";
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
    goUser: function() {
        stopSwipeSkip.do(function() {
            location.href = "../user-info.html";
        })
    },
    goOpendoor: function() {
        stopSwipeSkip.do(function() {
            mui.confirm("您已成功开启此趟旅程，请跟随我的脚步～","follow me",["去开门","取消"],function(e) {
                if (e.index==0) {
                    location.href = "../opendoor.html";
                } 
            },"div");
        })
    },
    blankTime: '',  //当前时间
    timeDiffer: 0,  //时间差值
    timePrompt: '点击，将于预定入住时间前半小时启动预温',  //提示
    goTem: function() {  //一键预温
        stopSwipeSkip.do(function() {
            vmServiceReady.blankTime = getToday("time").substring(0,5);
            vmServiceReady.timeDiffer = vmServiceReady.orderList.startTime - parseInt(vmServiceReady.blankTime.substring(0,2));
            vmServiceReady.timeDiffer = vmServiceReady.timeDiffer + ":" + vmServiceReady.blankTime.substring(3,5);
            console.log(vmServiceReady.timeDiffer);
            if (vmServiceReady.temperature=="一键预温" && parseInt(vmServiceReady.timeDiffer.substring(0,1)) >= 0) {
                vmServiceReady.temperature = "已准备";
                vmServiceReady.timePrompt = "将于 " + vmServiceReady.timeDiffer + " 后自启动预温";
                $(".cirque").css("color", "#b3dfdb");
                $(".cirque").css("border", "2px solid #b3dfdb");
            } else {
                vmServiceReady.temperature = "一键预温";
                vmServiceReady.timePrompt = "点击，将于预定入住时间前半小时启动预温";
                $(".cirque").css("color", "#fcc02f");
                $(".cirque").css("border", "2px solid #fcc02f");
            }
        })
    }
});
vmServiceReady.data = vmServiceReady.list;
