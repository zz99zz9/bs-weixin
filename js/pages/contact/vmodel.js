var cid = getParam("id");
if (cid != "") {
    if (isNaN(cid)) {
        location.href = document.referrer || "index.html";
    } else {
        cid = parseInt(cid);
    }
}
var vmContact = avalon.define({
    $id: 'contact',
    name: '',
    mobile: '',
    idNo: '',
    disable: false,
    save: function() {
        if (vmContact.name == "") {
            alert("姓名不能为空");
            return false;
        }
        if (vmContact.mobile == "") {
            alert("手机号不能为空");
            return false;
        }
        if (vmContact.name.length > 50) {
            alert("名字不能大于50个字");
            return false;
        }
        if (vmContact.mobile.length < 11) {
            alert("手机号不能小于11位");
            return false;
        }
        if (vmContact.mobile.length > 11) {
            alert("手机号不能大于11位");
            return false;
        }
        if (vmContact.idNo.length < 18) {
            alert("身份证号不能小于18位");
            return false;
        }
        if (vmContact.idNo.length > 18) {
            alert("身份证号不能大于18位");
            return false;
        }
        vmContact.disable = true;
        ajaxJsonp({
            url: urls.saveContact,
            data: {
                id: cid,
                mobile: vmContact.mobile,
                name: vmContact.name,
                idNo: vmContact.idNo,
                selectedList: []
            },
            successCallback: function(json) {
                if (json.status !== 1) {
                    alert(json.message);
                    vmContact.disable = false;
                    return;
                } else {
                    if (cid) {
                        //修改联系人
                        location.href = document.referrer || "index.html";
                    } else {
                        var newOrder = Storage.get("newOrder");
                        if (!newOrder.contact) {
                            newOrder.contact = [];
                        }
                        newOrder.contact.push(json.data);
                        Storage.set("newOrder", newOrder);
                        location.href = document.referrer || "index.html";
                    };
                }
            }
        });
    }
});
if (cid !== "") {
    ajaxJsonp({
        url: urls.getContact,
        data: {
            id: cid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmContact.name = json.data.name;
                vmContact.mobile = json.data.mobile;
                vmContact.idNo = json.data.idNo;
            }
        }
    });
}
