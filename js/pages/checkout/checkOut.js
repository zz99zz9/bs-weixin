// var assess_oid = getParam("oid"), assess_orid = getParam("orid"),
//     assess_room = getParam("room"), assess_time = getParam("time"),
//     assess_hid = getParam("hid");

// assess_oid = verifyIntParam(assess_oid);
// assess_orid = verifyIntParam(assess_orid);
// assess_hid = verifyIntParam(assess_hid);
var currentRoom = getGuest();
var vmCheckOut = avalon.define({
    $id: 'checkOut',
    tb: 5,
    tbTime: 3,
    tbRate: 10,
    list: [{
        "name": '睡眠',
        typeList: [{ "typeName": '入睡时间', "number": "11:30" },
            { "typeName": '深睡', "number": "4h" }, { "typeName": '浅睡', "number": "3h" }
        ],
        "suggest": '提前半小时入睡，睡前请勿做剧烈运动'
    }, {
        "name": '心率',
        typeList: [{ "typeName": '最低', "number": "58" },
            { "typeName": '平均心率', "number": "68" }, { "typeName": '最高', "number": "120" }
        ],
        "suggest": '属于正常范围，剧烈运动时间过长，请节制'
    }, {
        "name": '呼吸',
        typeList: [{ "typeName": '呼吸次数', "number": '8000' },
            { "typeName": '呼吸频率', "number": '15次/分钟' }
        ],
        "suggest": '略低于平均值，请平常多注意肺部保护'
    }],
    remarks: '最好在11点前入睡，保证每天8小时的充足睡眠；睡前做简单的放松活动；尽量避免剧烈运动；在上海时刻注意肺部保护；建议多吃甘梨、橙子和鱼肉类食物。',
    nowDate: '',
    date: function() {
        vmCheckOut.nowDate = getToday('month') + getToday('day') + '日';
    },
    scoreList: [
        { name: '洗浴舒适度', r: 1, s: 5, list: [1, 2, 3, 4, 5] },
        { name: '睡眠舒适度', r: 2, s: 5, list: [1, 2, 3, 4, 5] },
        { name: '服务态度', r: 3, s: 5, list: [1, 2, 3, 4, 5] },
    ],
    alert: function() {
        mui.alert('欢迎下次再来哦', '谢谢您的意见!', '<span id="ss" ms-on-tap="goIndex">3</span>', function() {
            location.href = '../index.html';
        }, 'div');
        window.setInterval("vmCheckOut.run();", 1000)
        vmCheckOut.addEvaluationContent();
    },
    click: function(r, s) {
        console.log(r);
        console.log(s);
        vmCheckOut.scoreList[r - 1].s = s;
    },
    content: "",
    addEvaluationContent: function(){
            ajaxJsonp({
                url: urls.saveSub,
                data: {
                    oid: currentRoom.oid,
                    orid: currentRoom.orid,
                    content: vmCheckOut.content,
                    score1: vmCheckOut.scoreList[0].s,
                    score2: vmCheckOut.scoreList[1].s,
                    score3: vmCheckOut.scoreList[2].s
                },
                successCallback: function(json) {
                    if (json.status === 1) {
                        location.href = document.referrer || "index.html";
                    } else {
                        mui.alert(json.message);
                    }
                }
            });
    },
    run: function() {
        var s = document.getElementById("ss");
        if (s != null) {
            if (s.innerHTML == 0) {
                location.href = '../index.html';
                return false;
            }
            s.innerHTML = s.innerHTML * 1 - 1;
        }

    },
    isSend: 0, //0-不显示  1-显示
    send: function() { //发送订单
        stopSwipeSkip.do(function() {
            if (vmCheckOut.isSend == 0) {
                vmCheckOut.isSend = 1;
            } else {
                vmCheckOut.isSend = 0;
            }

        });
    },
    isHealth: false,
});

vmCheckOut.date();
