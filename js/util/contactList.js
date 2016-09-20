var vmContactList = avalon.define({
    $id: "contactList",
    list: [],
    selectedList: [],
    selectDone: function() {
        if (vmContactList.$model.list.length == 0) {
            mui.toast("请先添加入住人");
            return false;
        }

        if (vmContactList.$model.selectedList.length > 2) {
            mui.toast("入住人请不要多于两位");
            return false;
        } else if (vmContactList.$model.selectedList.length == 0) {
            mui.toast("请选择入住人");
            return false;
        } else {
            newOrder.contact = [];
            vmContactList.$model.selectedList.map(function(index) {
                newOrder.contact.push(vmContactList.$model.list[index]);
            });
            Storage.set("newOrder", newOrder);
            return true;
        }
    },
    name: '',
    mobile: '',
    idNo: '',
    disable: false,
    save: function() {
        if (vmContactList.name == "") {
            mui.toast("姓名不能为空");
            return false;
        }
        if (vmContactList.mobile == "") {
            mui.toast("手机号不能为空");
            return false;
        }
        if (vmContactList.idNo == "") {
            mui.toast("身份证号不能为空");
            return false;
        }
        if (vmContactList.name.length > 20) {
            mui.toast("姓名格式不正确");
            return false;
        }
        if (vmContactList.mobile.length !== 11) {
            mui.toast("手机号格式不正确");
            return false;
        }

        if (vmContactList.idNo.length !== 18) {
            mui.toast("身份证号格式不正确");
            return false;
        }

        vmContactList.disable = true;
        ajaxJsonp({
            url: urls.saveContact,
            data: {
                mobile: vmContactList.mobile,
                name: vmContactList.name,
                idNo: vmContactList.idNo,
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmContactList.name = "";
                    vmContactList.mobile = "";
                    vmContactList.idNo = "";
                    vmContactList.list.push(json.data);
                    if (vmContactList.selectedList.length < 2) {
                        vmContactList.selectedList.push(vmContactList.list.length - 1);
                    }
                }
                vmContactList.disable = false;
            }
        });
    }
});

vmContactList.$watch('selectedList.length', function(l) {
    if (l > 2) {
        mui.toast("入住人员请不要多于两位");
        // vmContactList.selectedList = vmContactList.$model.selectedList.slice(0, 2);
        // 自动移除，只能生效一次
    }
});