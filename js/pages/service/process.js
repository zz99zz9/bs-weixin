/*
    Created by zwh on 2017/4
    Edited by zwh on 2017/5/8  页面重做，原先picker选择样式页面，看web/weixin 2017-4-27
*/


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
var currentRoom = Storage.get("guest"),
    rid = currentRoom.rid,
    orid = currentRoom.orid;

var vmServiceProcess = avalon.define({
    $id: 'serviceProcess',
    name: '',
    headerUrl: '../img/qietu-process-title.svg',
    pageNo: 1,
    pageSize: 10,
    data: [],
    goNextStep: function() {
        stopSwipeSkip.do(function() {
            vmServiceProcess.selectContent = vmServiceProcess.selectValue.join(",");
            console.log(vmServiceProcess.selectContent);
            vmServiceProcess.savePreService();
            location.href = '../service/ready.html';
        });
    },
    prelist: [],
    selectList: [], //存放显示的名称
    selectValue: [], //存放服务内容，最后要转换成字符串，进行传输
    selectContent: '',
    listNum: 0, //数组的数量
    getPreList: function() {
        ajaxJsonp({
            url: urls.getPreServiceList,
            data: {
                hid: 1,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmServiceProcess.list = json.data;
                    var b = vmServiceProcess.$model.list;
                    b.selectNum = [];
                    b.map(function(e) {
                        vmServiceProcess.selectNum.push('');
                        e.selectIndex = -1;
                    });
                    vmServiceProcess.list = b;
                }
            }
        });
    },
    goal: '选择',
    goalId: -1,
    selectNum: [],
    number: -1,
    list: [{
        id: 8,
        sid: 1,
        hid: 1,
        sort: "",
        preService: {
            id: "",
            name: "定制服务",
            serviceProblem: "请问您此行的目的？",
            serviceReplyContentList: [{
                id: 23,
                sid: 1,
                serviceReply: "旅游休闲",
                imgUrl: "../img/qietu-shangwu.png",
                serviceContent: "jkgdf"
            }, {
                id: 24,
                sid: 1,
                serviceReply: "商务出差",
                imgUrl: "../img/qietu-older.svg",
                serviceContent: "222"
            }, {
                id: 25,
                sid: 1,
                serviceReply: "临时入住",
                imgUrl: "../img/qietu-couple.svg",
                serviceContent: "ks"
            }, {
                id: 26,
                sid: 1,
                serviceReply: "不需要 ",
                imgUrl: "../img/qietu-children.svg",
                serviceContent: "wewe"
            }]
        }
    }, {
        id: 6,
        sid: 2,
        hid: 1,
        sort: "",
        preService: {
            id: "",
            name: "定制服务",
            serviceProblem: "请问您此行的目的？",
            serviceReplyContentList: [{
                id: 23,
                sid: 1,
                serviceReply: "旅游休闲",
                imgUrl: "../img/qietu-children.svg",
                serviceContent: "看电视"
            }, {
                id: 24,
                sid: 1,
                serviceReply: "商务出差",
                imgUrl: "../img/qietu-older.svg",
                serviceContent: 222
            }, {
                id: 25,
                sid: 1,
                serviceReply: "临时入住",
                imgUrl: "../img/qietu-couple.svg",
                serviceContent: 333
            }, {
                id: 26,
                sid: 1,
                serviceReply: "临时入住",
                imgUrl: "../img/qietu-couple.svg",
                serviceContent: 333
            }, {
                id: 27,
                sid: 1,
                serviceReply: "不需要",
                imgUrl: "../img/qietu-couple.svg",
                serviceContent: 333
            }, {
                id: 28,
                sid: 1,
                serviceReply: "不需要",
                imgUrl: "../img/qietu-couple.svg",
                serviceContent: 333
            }, {
                id: 29,
                sid: 1,
                serviceReply: "临时入住 ",
                imgUrl: "../img/qietu-children.svg",
                serviceContent: 0
            }]
        }
    }, {
        id: 10,
        sid: 8,
        hid: 1,
        sort: "",
        preService: {
            id: "",
            name: "发货 ",
            serviceProblem: "电饭锅 ",
            serviceReplyContentList: [{
                id: 17,
                sid: 8,
                serviceReply: "是大法官 ",
                imgUrl: "../img/qietu-children.svg",
                serviceContent: 111
            }, {
                id: 18,
                sid: 8,
                serviceReply: "暗室逢灯 ",
                imgUrl: "../img/qietu-older.svg",
                serviceContent: 222
            }]
        }
    }],
    giveList: function() {
        var b = vmServiceProcess.$model.list;
        b.selectNum = [];
        b.map(function(e) {
            vmServiceProcess.selectNum.push(-1);
            e.selectIndex = -1;
        });
        vmServiceProcess.list = b;
    },
    select: function(sid, id, queIndex, index, value) {
        stopSwipeSkip.do(function() {
            vmServiceProcess.selectNum[queIndex] = value;
            vmServiceProcess.list[queIndex].selectIndex = index;
        });
    },
    over: function() {
        stopSwipeSkip.do(function() {
            var btn = document.getElementsByClassName("btn-word")[0];
            btn.style.cssText = "color: black; background-color: #fdd942;";
            vmServiceProcess.selectContent = vmServiceProcess.selectNum.join(",");
            vmServiceProcess.savePreService();
        });
    },
    savePreService: function() {
        ajaxJsonp({
            url: urls.savePreService,
            data: {
                hid: 1,
                orid: orid, //房间号目前不通
                contents: vmServiceProcess.selectContent
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert(json.message);
                    location.href = '../service/ready.html';
                } else {
                    alert(json.message);
                }
            }
        });
    },
});
//vmServiceProcess.giveList();
vmServiceProcess.getPreList();
