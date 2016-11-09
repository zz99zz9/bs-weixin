var inid = 0;

var vmFavoree = avalon.define({
    $id: 'favoree',
    fundId: '', //基金id
    data: {
        id: '',
        name: '',
        edu1: '',
        edu2: '',
        reason: '',
        imgUrl: defaultHeadImg,
    },
    mobile: '',
    nickName: '',
    isVip: 0,
    isAdmin: 0,
    isAlliance: 0,
    isManage: isManageMode,
    isDisabled: true,
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
            data: { id: vmFavoree.fundId },
            successCallback: function(json) {
                vmFavoree.getList1();
                if (json.status === 1) {
                    vmFavoree.data = json.data.list;
                }
            }
        });
    },
    getList1: function() {
        //仓库选择
        (function($, doc) {
            var userPicker = new $.PopPicker({ layer: 2 });
            userPicker.setData(vmFavoree.$model.listEdu1);
            var showUserPickerButton1 = doc.getElementById('edu1');
            showUserPickerButton1.addEventListener('tap', function(event) {
                userPicker.show(function(items) {
                    vmFavoree.data.edu1 = items[0].text;
                    var a = vmFavoree.data.edu1;
                    console.log(a);
                    switch (a) {
                        case "大学":
                            vmFavoree.listEdu2 = vmFavoree.grade1;
                            break;
                        case "高中":
                            vmFavoree.listEdu2 = vmFavoree.grade2;
                            break;
                        case "初中":
                            vmFavoree.listEdu2 = vmFavoree.grade3;
                            break;
                        case "小学":
                            vmFavoree.listEdu2 = vmFavoree.grade4;
                            break;
                        default:
                            vmFavoree.listEdu2 = [];
                            break;
                    }
                    vmFavoree.getList2();
                    vmFavoree.changed();
                });
            }, false);
        })(mui, document);
    },
    getList2: function() {
        (function($, doc) {
            var userPicker = new $.PopPicker();
            var showUserPickerButton2 = doc.getElementById('edu2');
            showUserPickerButton2.addEventListener('tap', function(event) {
                userPicker.setData(vmFavoree.listEdu2);
                userPicker.show(function(items) {
                    vmFavoree.data.edu2 = items[0].text;
                    vmFavoree.changed();
                });
            }, false);
        })(mui, document);
    },
    changed: function() {
        if (vmFavoree.name == '' || vmFavoree.mobile == '' || vmFavoree.mobile.length != 11) {
            vmFavoree.isDisabled = true;
            return;
        }
        vmFavoree.isDisabled = false;
    },
    getPic: function() {
        var a = Storage.get("headImg");
        if (a == null) {
            vmFavoree.data.imgUrl = defaultHeadImg;
            console.log(vmFavoree.data.imgUrl);
        } else {
            vmFavoree.data.imgUrl = urlAPINet + Storage.get("headImg").url;
        }
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
                id: vmFavoree.data.id,
                fid: vmFavoree.fundId,
                mobile: vmFavoree.data.mobile,
                name: vmFavoree.data.name,
                imgUrl: vmFavoree.data.imgUrl,
                education: vmFavoree.data.edu1,
                grade: vmFavoree.data.edu2,
                reason: vmFavoree.data.reason
            },
            successCallback: function(json) {
                if (json.status == 1) { //已登录
                    console.log(123);
                    //location.href = 'favoreeList.html';
                }
            }
        });
    },
});

vmFavoree.getFund();
vmFavoree.getPic();

if (inid == 0) {
    $("#headerReplace").text("添加");
    vmFavoree.getList1();
} else {
    $("#headerReplace").text("修改");
    vmFavoree.getData();
}
