var inid = 45;

var vmFavoree = avalon.define({
    $id: 'favoree',
    fundId: '', //基金id
    //studentId: '',    //学生id  空：添加  非空：修改
    data: {
        id: '',
        name: '',
        education: '',
        grade: '',
        reason: '',
        imgUrl: defaultHeadImg, //显示的pic
        logoUrl: '', //传的pic
    },
    edu1: '',
    mobile: '',
    listEdu1: [{
        value: 1,
        text: "大学",
        children: [
            { value: 1, text: "大一" },
            { value: 2, text: "大二" },
            { value: 3, text: "大三" },
            { value: 4, text: "大四" },
            { value: 5, text: "大五" }
        ]
    }, {
        value: 2,
        text: "高中",
        children: [
            { value: 1, text: "高一" },
            { value: 2, text: "高二" },
            { value: 3, text: "高三" }
        ]
    }, {
        value: 3,
        text: "初中",
        children: [
            { value: 1, text: "初一" },
            { value: 2, text: "初二" },
            { value: 3, text: "初三" }
        ]
    }, {
        value: 4,
        text: "小学",
        children: [
            { value: 1, text: "一年级" },
            { value: 2, text: "二年级" },
            { value: 3, text: "三年级" },
            { value: 4, text: "四年级" },
            { value: 5, text: "五年级" },
            { value: 6, text: "六年级" }
        ]
    }],
    getFund: function() {
        ajaxJsonp({
            url: urls.benefitAmountUid,
            data: {},
            successCallback: function(json) {
                if (json.status == 1) {
                    vmFavoree.fundId = json.data.id;
                }
            }
        });
    },
    //根据学生id查询详情
    getData: function() {
        ajaxJsonp({
            url: urls.benefitStudentDetail,
            data: { id: inid },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmFavoree.data = json.data;
                    vmFavoree.data.logoUrl = json.data.imgUrl;
                    vmFavoree.edu1 = json.data.education + " " + json.data.grade;
                    vmFavoree.getPic();
                }
            }
        });
    },
    //学历
    getList1: function() {
        (function($, doc) {
            var userPicker = new $.PopPicker({ layer: 2 });
            userPicker.setData(vmFavoree.$model.listEdu1);
            var showUserPickerButton1 = doc.getElementById('edu1');
            showUserPickerButton1.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    vmFavoree.edu1 = items[0].text + " " + items[1].text;
                    vmFavoree.data.education = items[0].text;
                    vmFavoree.data.grade = items[1].text;
                    console.log(vmFavoree.edu1);
                });
            }, false);
        })(mui, document);
    },
    getPic: function() {
        var a = Storage.get("headImg");
        if (vmFavoree.data.logoUrl == '' && a == null) {
            vmFavoree.data.logoUrl = vmFavoree.data.imgUrl;
        } else if (vmFavoree.data.logoUrl == '' && a != null) {
            vmFavoree.data.imgUrl = urlAPINet + a.url;
            vmFavoree.data.logoUrl = a.url;
        } else if (vmFavoree.data.logoUrl != '' && a == null) {
            vmFavoree.data.imgUrl = urlAPINet + vmFavoree.data.imgUrl;
        } else if (vmFavoree.data.logoUrl != '' && a != null) {
            vmFavoree.data.imgUrl = urlAPINet + a.url;
            vmFavoree.data.logoUrl = a.url;
        }
        console.log(vmFavoree.data.logoUrl);
    },
    changeImg: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.userInfotUrl,
                data: {},
                successCallback: function(json) {
                    if (json.status == 1) { //已登录
                        location.href = '../avatar.html';
                    }
                }
            });
        });
    },
    save: function() {
        ajaxJsonp({
            url: urls.saveBenefitStudent,
            data: {
                id: inid,
                fid: vmFavoree.fundId,
                name: vmFavoree.data.name,
                imgUrl: vmFavoree.data.logoUrl,
                education: vmFavoree.data.education,
                grade: vmFavoree.data.grade,
                reason: vmFavoree.data.reason
            },
            successCallback: function(json) {
                if (json.status == 1) { //已登录
                    location.href = 'favoreeList.html';
                }
            }
        });
    },
});

vmFavoree.getFund();
vmFavoree.getList1();

if (inid == '') {
    $("#headerReplace").text("添加");
    vmFavoree.getPic();
} else {
    $("#headerReplace").text("修改");
    vmFavoree.getData();
}
