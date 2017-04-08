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
    goq1: function() {
        $("#l1").css("display", "");
        $(".ask1").typed({
            strings: ["请问您此行的目的是？"],
            typeSpeed: 90,
            cursorChar: "·.·"
        });
        $("#q1").show();
        $("#q1").animate({ width: "200px" }, 500);
    },
    goa1: function() {
        $("#r1").css("display", "");
        $("#a1").show();
        $("#a1").animate({ width: "130px" }, 1000);
    },
    goq2: function() {
        $("#l2").css("display", "");
        $(".ask2").typed({
            strings: ["好的，跟谁一起？"],
            typeSpeed: 90,
            cursorChar: "·.·"
        });
        $("#q2").show();
        $("#q2").animate({ width: "200px" }, 500);
    },
    goa2: function() {
        $("#r2").css("display", "");
        $("#a2").show();
        $("#a2").animate({ width: "130px" }, 1000);
    },
    goq3: function() {
        $("#l3").css("display", "");
        $(".ask3").typed({
            strings: ["需要预约VR体验服务吗？"],
            typeSpeed: 90,
            cursorChar: "·.·"
        });
        $("#q3").show();
        $("#q3").animate({ width: "200px" }, 500);
    },
    goa3: function() {
        $("#r3").css("display", "");
        $("#a3").show();
        $("#a3").animate({ width: "130px" }, 1000);
    },
    goq4: function() {
        $("#l4").css("display", "");
        $(".ask4").typed({
            strings: ["有老花镜和儿童睡衣，请问？"],
            typeSpeed: 90,
            cursorChar: "·.·"
        });
        $("#q4").show();
        $("#q4").animate({ width: "230px" }, 500);
    },
    goa4: function() {
        $("#r4").css("display", "");
        $("#a4").show();
        $("#a4").animate({ width: "130px" }, 1000);
    },
    goq5: function() {
        $("#l5").css("display", "");
        $(".ask5").typed({
            strings: ["我们还为您准备了。。。"],
            typeSpeed: 90,
            cursorChar: "·.·"
        });
        $("#q5").show();
        $("#q5").animate({ width: "200px" }, 500);
    },
    goa5: function() {
        $("#r5").css("display", "");
        $("#a5").show();
        $("#a5").animate({ width: "130px" }, 1000);
    },
    goEnd: function() {
        $("#lEnd").css("display", "");
        $(".askEnd").typed({
            strings: ["感谢您的配合，点此下一步->"],
            typeSpeed: 90,
            cursorChar: ""
        });
        $("#end").show();
        $("#end").animate({ width: "230px" }, 500);
    },
    send: function() { //发送订单
        stopSwipeSkip.do(function() {
            mui.alert('注意提醒您的小伙伴查收订单哦。', "发送成功");
        })
    },
    goal: '',
    goalId: 0,
    goalList: [
        { value: 1, text: '旅游休闲' }, 
        { value: 2, text: '商务出差' },
        { value: 2, text: '临时入住' },
    ],
    companion: '',
    companionId: 0,
    companionList: [
        { value: 1, text: '一个人' }, 
        { value: 2, text: '情侣' },
        { value: 2, text: '父母' },
        { value: 2, text: '子女' },
        { value: 2, text: '朋友' },
    ],
    vr: '',
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
});

vmServiceProcess.goq1();
vmServiceProcess.goa1();

(function($, doc) {
    $.init();
    $.ready(function() {
        var toolPicker2 = new $.PopPicker();
        toolPicker2.setData(vmServiceProcess.goalList);
        var showUserPickerButton2 = doc.getElementById('goal');
        showUserPickerButton2.addEventListener('tap', function(event) {
            toolPicker2.show(function(items) {
                vmServiceProcess.goalId = items[0].value;
                vmServiceProcess.goal = items[0].text;
                vmServiceProcess.goq2();
                vmServiceProcess.goa2();
            });
        }, false);
    });
})(mui, document);

(function($, doc) {
    $.init();
    $.ready(function() {
        var toolPicker2 = new $.PopPicker();
        toolPicker2.setData(vmServiceProcess.companionList);
        var showUserPickerButton2 = doc.getElementById('companion');
        showUserPickerButton2.addEventListener('tap', function(event) {
            toolPicker2.show(function(items) {
                vmServiceProcess.companionId = items[0].value;
                vmServiceProcess.companion = items[0].text;
                vmServiceProcess.goq3();
                vmServiceProcess.goa3();
            });
        }, false);
    });
})(mui, document);

(function($, doc) {
    $.init();
    $.ready(function() {
        var toolPicker2 = new $.PopPicker();
        toolPicker2.setData(vmServiceProcess.vrList);
        var showUserPickerButton2 = doc.getElementById('vr');
        showUserPickerButton2.addEventListener('tap', function(event) {
            toolPicker2.show(function(items) {
                vmServiceProcess.vrId = items[0].value;
                vmServiceProcess.vr = items[0].text;
                // vmServiceProcess.goq4();
                // vmServiceProcess.goa4();
                vmServiceProcess.goEnd();
            });
        }, false);
    });
})(mui, document);

// (function($, doc) {
//     $.init();
//     $.ready(function() {
//         var toolPicker2 = new $.PopPicker();
//         toolPicker2.setData(vmServiceProcess.oldList);
//         var showUserPickerButton2 = doc.getElementById('old');
//         showUserPickerButton2.addEventListener('tap', function(event) {
//             toolPicker2.show(function(items) {
//                 vmServiceProcess.oldId = items[0].value;
//                 vmServiceProcess.old = items[0].text;
//                 vmServiceProcess.goq5();
//                 vmServiceProcess.goa5();
//             });
//         }, false);
//     });
// })(mui, document);

// (function($, doc) {
//     $.init();
//     $.ready(function() {
//         var toolPicker2 = new $.PopPicker();
//         toolPicker2.setData(vmServiceProcess.otherList);
//         var showUserPickerButton2 = doc.getElementById('other');
//         showUserPickerButton2.addEventListener('tap', function(event) {
//             toolPicker2.show(function(items) {
//                 vmServiceProcess.otherId = items[0].value;
//                 vmServiceProcess.other = items[0].text;
//                 vmServiceProcess.goEnd();
//             });
//         }, false);
//     });
// })(mui, document);
