// var assess_oid = getParam("oid"), assess_orid = getParam("orid"),
//     assess_room = getParam("room"), assess_time = getParam("time"),
//     assess_hid = getParam("hid");

// assess_oid = verifyIntParam(assess_oid);
// assess_orid = verifyIntParam(assess_orid);
// assess_hid = verifyIntParam(assess_hid);

var vmSub = avalon.define({
    $id: "sub",
    scoreList: [
        { name: '洗浴舒适度', r: 1, s: 5, list: [1, 2, 3, 4, 5] },
        { name: '睡眠舒适度', r: 2, s: 5, list: [1, 2, 3, 4, 5] },
        { name: '服务态度', r: 3, s: 5, list: [1, 2, 3, 4, 5] },
    ],
    data: {
        content: '',
        post: '迪斯尼店店长',
        name: 'joanna',
        headImg: 'http://img.bensue.com/uploadsImg/20160331/img/d708d83c-3835-443e-ae94-02c639509127100.jpg',
        message: '君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。',
        inHome: '',
        inTime: '',
    },
    isDisabled: false,
    // changed: function() {
    //     if (vmSub.data.content.length > 200 ) {
    //         vmSub.isDisabled = true;
    //         return;
    //     }
    //     console.log(vmSub.data.content.length);
    //     vmSub.isDisabled = false;
    // },
    click: function(r, s) {
        vmSub.scoreList[r - 1].s = s;
    },
    save: function() {
        if (vmSub.data.content.length >= 200) {
            alert("内容请少于200字哦！");
            return false;
        }
        vmSub.isDisabled = true;

        ajaxJsonp({
            url: urls.saveSub,
            data: {
                oid: assess_oid,
                orid: assess_orid,
                content: vmSub.data.content,
                score1: vmSub.scoreList[0].s,
                score2: vmSub.scoreList[1].s,
                score3: vmSub.scoreList[2].s
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    location.href = document.referrer || "index.html";
                } else {
                    alert(json.message);
                    vmSub.isDisabled = false;
                }
            }
        });
    }
});

vmSub.data.inHome = assess_room;
vmSub.data.inTime = assess_time;

ajaxJsonp({
    url: urls.getManager,
    data: {
        hid: assess_hid
    },
    successCallback: function(json) {
        if (json.status == 1) {
            vmSub.data.headImg = json.data.headUrl;
            vmSub.data.name = json.data.name;
            vmSub.data.message = json.data.note;
            vmSub.data.post = json.data.position;
        }
    }
});