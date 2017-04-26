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

var vmServiceProcess = avalon.define({
    $id: 'serviceProcess',
    name: '',
    pageNo: 1,
    pageSize: 10,
    data: [],
    // goq1: function() {
    //     $("#l1").css("display", "");
    //     $(".ask1").typed({
    //         strings: ["请问您此行的目的是？"],
    //         typeSpeed: 90,
    //         cursorChar: ""
    //     });
    //     $("#q1").show();
    //     $("#q1").animate({ width: "200px" }, 500);
    // },
    goq1: function() {
        $("#l8").css("display", "");
        // $(".ask1").typed({
        //     strings: ["65654616"],
        //     typeSpeed: 90,
        //     cursorChar: ""
        // });
        $("#q8").show();
        $("#q8").animate({ width: "180px" }, 500);
    },
    goa1: function() {
        $("#r8").css("display", "");
        $("#a8").show();
        $("#a8").animate({ width: "150px" }, 1000);
    },
    goq2: function() {
        $("#l2").css("display", "");
        // $(".ask2").typed({
        //     strings: ["好的，跟谁一起？"],
        //     typeSpeed: 90,
        //     cursorChar: ""
        // });
        $("#q2").show();
        $("#q2").animate({ width: "200px" }, 500);
    },
    goa2: function() {
        $("#r2").css("display", "");
        $("#a2").show();
        $("#a2").animate({ width: "150px" }, 1000);
    },
    goq3: function() {
        $("#l3").css("display", "");
        // $(".ask3").typed({
        //     strings: ["需要预约VR体验服务吗？"],
        //     typeSpeed: 90,
        //     cursorChar: ""
        // });
        $("#q3").show();
        $("#q3").animate({ width: "200px" }, 500);
    },
    goa3: function() {
        $("#r3").css("display", "");
        $("#a3").show();
        $("#a3").animate({ width: "150px" }, 1000);
    },
    goq4: function() {
        $("#l4").css("display", "");
        $(".ask4").typed({
            strings: ["有老花镜和儿童睡衣，请问？"],
            typeSpeed: 90,
            cursorChar: ""
        });
        $("#q4").show();
        $("#q4").animate({ width: "230px" }, 500);
    },
    goa4: function() {
        $("#r4").css("display", "");
        $("#a4").show();
        $("#a4").animate({ width: "150px" }, 1000);
    },
    goq5: function() {
        $("#l5").css("display", "");
        $(".ask5").typed({
            strings: ["我们还为您准备了。。。"],
            typeSpeed: 90,
            cursorChar: ""
        });
        $("#q5").show();
        $("#q5").animate({ width: "200px" }, 500);
    },
    goa5: function() {
        $("#r5").css("display", "");
        $("#a5").show();
        $("#a5").animate({ width: "150px" }, 1000);
    },
    goEnd: function() {
        $("#lEnd").css("display", "");
        $(".askEnd").typed({
            strings: ["感谢您的配合，点此下一步"],
            typeSpeed: 90,
            cursorChar: "<img src='../img/icon/service-click.svg' class='arrow' style='height: 36px;width:28px;top:3px;'>"
        });
        $("#end").show();
        $("#end").animate({ width: "250px" }, 500);
    },
    send: function() { //发送订单
        stopSwipeSkip.do(function() {
            mui.alert('注意提醒您的小伙伴查收订单哦。', "发送成功");
        })
    },
    goQuestion: function(id) {
        console.log(id);
        if (id==undefined) {
            vmServiceProcess.goEnd();
        }
        $("#l" + id).css("display", "");
        // $(".ask1").typed({
        //     strings: ["65654616"],
        //     typeSpeed: 90,
        //     cursorChar: ""
        // });
        $("#q" + id).show();
        $("#q" + id).animate({ width: "180px" }, 500);
    },
    goAnswer: function(id) {
        $("#r" + id).css("display", "");
        $("#a" + id).show();
        $("#a" + id).animate({ width: "150px" }, 1000);
    },
    prelist: [],
    selectList: [],
    listNum: 0, //数组的数量
    getPreList: function() {
        ajaxJsonp({
            url: urls.getPreServiceList,
            data: {
                hid: 1,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmServiceProcess.emptyList();
                    vmServiceProcess.listNum = json.data.length;
                    json.data.map(function(a, m) {
                        vmServiceProcess.selectList.push('选择');
                        a.preService.serviceReplyContentList.map(function(e) {
                            e.value = e.serviceContent;
                            e.text = e.serviceReply;
                            delete e.serviceContent;
                            delete e.serviceReply;
                        })
                    })
                    vmServiceProcess.prelist = json.data;
                    console.log(vmServiceProcess.$model.prelist);
                    console.log(vmServiceProcess.$model.selectList);
                    // vmServiceProcess.prelist[0].preService.serviceReplyContentList.map(function(e) {
                    //     vmServiceProcess.goalList.push({ value: e.serviceContent, text: e.serviceReply });
                    // });
                }
            }
        });
    },
    goal: '选择',
    goalId: 0,
    // goalList: [],
    goalList: [
        { value: 1, text: '旅游休闲' },
        { value: 2, text: '商务出差' },
        { value: 2, text: '临时入住' },
    ],
    companion: '同伴是...',
    companionId: 0,
    companionList: [
        { value: 1, text: '一个人' },
        { value: 2, text: '情侣' },
        { value: 2, text: '父母' },
        { value: 2, text: '子女' },
        { value: 2, text: '朋友' },
    ],
    vr: '关于',
    vrId: 0,
    vrList: [
        { value: 1, text: '体验一下' },
        { value: 2, text: '不用了' },
    ],
    old: '',
    oldId: 0,
    oldList: [
        { value: 1, text: '老人' },
        { value: 2, text: '小孩' },
        { value: 3, text: '都有' },
        { value: 4, text: '都没来' }
    ],
    other: '',
    otherId: 0,
    otherList: [
        { value: 1, text: '泊车引导' },
        { value: 2, text: '水果' },
        { value: 3, text: '热饮／冷饮' },
        { value: 4, text: '贵重物品寄存' },
        { value: 5, text: '汽车清洁' },
        { value: 6, text: '不需要' }
    ],
    emptyList: function() {
        vmServiceProcess.goalList = [];
        vmServiceProcess.companionList = [];
        vmServiceProcess.vrList = [];
        vmServiceProcess.oldList = [];
        vmServiceProcess.otherList = [];
    }
});

vmServiceProcess.getPreList();


setTimeout(function() {
    (function($, doc) {
        $.init();
        for (var i = 0; i <= vmServiceProcess.listNum - 1; i++) {
            $.ready(function() {
                var toolPicker1 = new $.PopPicker();
                toolPicker1.setData(vmServiceProcess.prelist[i].preService.serviceReplyContentList);
                if (i < vmServiceProcess.listNum - 1) {
                    var id = vmServiceProcess.prelist[i + 1].id;
                }
                var showUserPickerButton1 = doc.getElementById('picker' + vmServiceProcess.prelist[i].id),
                    a = i;
                console.log(i);
                showUserPickerButton1.addEventListener('tap', function(event) {
                    toolPicker1.show(function(items) {
                        //vmServiceProcess.goalId = items[0].value;
                        vmServiceProcess.selectList[a] = items[0].text;
                        showUserPickerButton1.innerHTML = items[0].text;
                        vmServiceProcess.goQuestion(id);
                        vmServiceProcess.goAnswer(id);
                    });
                }, false);
            });

        }
    })(mui, document);
}, 500);

setTimeout(function() {
    vmServiceProcess.goQuestion(8);
    vmServiceProcess.goAnswer(8);
}, 1000);