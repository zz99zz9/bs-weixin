var hotel = controlCore.getHotel();

var uid = getParam("id"), name = getParam("name");

if(uid != "") {
    if(isNaN(uid)) {
        location.href = document.referrer || "staff.html";
    } else {
        uid = parseInt(uid);
    }
} else {
    location.href = "staff.html";
}

var vmAssess = avalon.define({
	$id: 'form',
	time: getToday(),
	content: '',
	adminName: Storage.getLocal("user")&&Storage.getLocal("user").name,
	isDisabled: true,
	changed: function(a) {
		//符合一定规则再让按钮可以点击
        if(a != '') {
            vmAssess.isDisabled = false;
        } else {
            vmAssess.isDisabled = true;
        }
	},
	submit: function() {
		vmAssess.isDisabled = true;

		if(vmAssess.content.length > 500) {
			alert("评价内容请不要超过500字");
			return;
		}

        ajaxJsonp({
            url: urls.employeeEvaluateSave,
            data: {uid: uid, content: vmAssess.content},
            successCallback: function(json) {
                if (json.status === 1) {
                    document.referrer ? history.go(-1) : location.replace('../manage/staff.html');
                }
            }
        });

	},
	cancel: function() {
        document.referrer ? history.go(-1) : location.replace('../manage/staff.html');
    }
});

$("#headerReplace").text(name);
