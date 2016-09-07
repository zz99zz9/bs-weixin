/**
 * Created by lyh on 2016/7/28/028.
 * Edited by Michael on 2016/9/7
 */

var vmContactList = avalon.define({
    $id: 'contactList',
    list: [],
    selectedIndex: '',
    defaultList: [],
    setDefault: function(index) {
        // vmContactList.list[index].isDefault = !vmContactList.list[index].isDefault;
        var indexInDefaultList = vmContactList.$model.defaultList.indexOf(index);

        if (indexInDefaultList == -1) { //设为默认
            vmContactList.defaultList.push(index);
            vmContactList.setDefaultInAPI(vmContactList.list[index].id, 1);

            if (vmContactList.$model.defaultList.length > 2) { //超过2个自动删除第一个
                vmContactList.defaultList = vmContactList.$model.defaultList.slice(1);
            vmContactList.setDefaultInAPI(vmContactList.list[vmContactList.$model.defaultList[0]].id, 0);

            }
        } else { //取消默认
            vmContactList.defaultList.splice(indexInDefaultList, 1)
            vmContactList.setDefaultInAPI(vmContactList.list[index].id, 0);
        }
    },
    setDefaultInAPI: function(id, isDefault) {
        ajaxJsonp({
            url: urls.setDefaultContact,
            data: {
                id: id,
                isDefault: isDefault
            },
            successCallback: function(json) {
                if (json.status !== 1) {
                    alert(json.message);
                    return;
                }
            }
        });
    },
    add: function() {
        vmContactAdd.id = '';
        vmContactAdd.name = '';
        vmContactAdd.mobile = '';
        vmContactAdd.idNo = '';
        popover('./util/frequent-contact-add.html', 1);
    },
    del: function(index) {
        if (confirm('确定要删除吗？')) {
            ajaxJsonp({
                url: urls.deleteContact,
                data: {
                    id: vmContactList.list[index].id
                },
                successCallback: function(json) {
                    if (json.status !== 1) {
                        alert(json.message);
                        return;
                    } else {
                        vmContactList.list.splice(index, 1);
                    }
                }
            });
        }
    },
    edit: function(index) {
        vmContactList.selectedIndex = index;
        vmContactAdd.id = vmContactList.list[index].id;
        vmContactAdd.name = vmContactList.list[index].name;
        vmContactAdd.mobile = vmContactList.list[index].mobile;
        vmContactAdd.idNo = vmContactList.list[index].idNo;
        popover('./util/frequent-contact-add.html', 1);
    }
});

var vmAInfoBtn = avalon.define({
    $id: 'aInfoBtn',
    selectText: '确定',
    select: function() {
        vmContactAdd.save();
    }
});

var vmContactAdd = avalon.define({
    $id: 'contactAdd',
    id: '',
    name: '',
    mobile: '',
    idNo: '',
    save: function() {
        if (vmContactAdd.name == "") {
            alert("姓名不能为空");
            return false;
        }
        if (vmContactAdd.mobile == "") {
            alert("手机号不能为空");
            return false;
        }
        if (vmContactAdd.name.length > 50) {
            alert("名字不能大于50个字");
            return false;
        }
        if (vmContactAdd.mobile.length < 11) {
            alert("手机号不能小于11位");
            return false;
        }
        if (vmContactAdd.mobile.length > 11) {
            alert("手机号不能大于11位");
            return false;
        }
        if (vmContactAdd.idNo.length < 18) {
            alert("身份证号不能小于18位");
            return false;
        }
        if (vmContactAdd.idNo.length > 18) {
            alert("身份证号不能大于18位");
            return false;
        }

        ajaxJsonp({
            url: urls.saveContact,
            data: {
                id: vmContactAdd.id,
                mobile: vmContactAdd.mobile,
                name: vmContactAdd.name,
                idNo: vmContactAdd.idNo
            },
            successCallback: function(json) {
                if (json.status !== 1) {
                    alert(json.message);
                    return;
                } else {
                    if (isEmpty(vmContactAdd.id)) {
                        vmContactList.list.push(json.data);
                    } else {
                        vmContactList.list[vmContactList.selectedIndex].name = json.data.name;
                        vmContactList.list[vmContactList.selectedIndex].mobile = json.data.mobile;
                        vmContactList.list[vmContactList.selectedIndex].idNo = json.data.idNo;
                    }
                }
            }
        });

        $('#pop-text').empty();
        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

//获取联系人详情
ajaxJsonp({
    url: urls.getContactList,
    data: {
        pageSize: 20
    },
    successCallback: function(json) {
        if (json.status === 1) {
            vmContactList.list = json.data.list;
            for (var i = 0; i < json.data.list.length; i++) {
                if (json.data.list[i].isDefault) {
                    vmContactList.defaultList.push(i);
                }
            }
        }
    }
});