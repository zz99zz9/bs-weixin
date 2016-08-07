
var vmContactList = avalon.define({
    $id: "contactList",
    list: [],
    selectedList: [],
    selectDone: function() {
        if (vmContactList.$model.selectedList.length > 2) {
            alert("入住人员请不要多于两位");
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
            alert("姓名不能为空");
            return false;
        }
        if (vmContactList.mobile == "") {
            alert("手机号不能为空");
            return false;
        }
        if (vmContactList.idNo == "") {
            alert("身份证号不能为空");
            return false;
        }
        if (vmContactList.name.length > 20) {
            alert("姓名格式不正确");
            return false;
        }
        if (vmContactList.mobile.length !== 11) {
            alert("手机号格式不正确");
            return false;
        }

        if (vmContactList.idNo.length !== 18) {
            alert("身份证号格式不正确");
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
                    vmContactList.name == "";
                    vmContactList.mobile == ""
                    vmContactList.list.push(json.data);
                    vmContactList.selectedList.push(vmContactList.list.length-1);
                }
                vmContactList.disable = false;
            }
        });
    }
});

vmContactList.$watch('selectedList.length',function(l){
    if(l > 2 ) {
        alert("入住人员请不要多于两位");
        vmContactList.selectedList.pop();
    }
});