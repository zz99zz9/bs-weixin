/**
 * Created by lyh on 2016/7/28/028.
 */

var vmContactList = avalon.define({
    $id: 'contactList',
    list: [],
    add: function () {
        popover('./util/frequent-contact-add.html', 1);
    },
    del: function (index) {
        if (confirm('确定要删除吗？')) {
            ajaxJsonp({
                url: urls.deleteContact,
                data: {
                    id: vmContactList.list[index].id
                },
                successCallback: function (json) {
                    if (json.status !== 1) {
                        alert(json.message);
                        return;
                    } else {
                        vmContactList.list.splice(index, 1);
                    }
                }
            });
        }
    }
});

var vmAInfoBtn = avalon.define({
    $id: 'aInfoBtn',
    selectText: '确定',
    select: function () {
        vmContactAdd.save();
    }
});

var vmContactAdd = avalon.define({
    $id: 'contactAdd',
    name: '',
    mobile: '',
    idNo: '',
    save: function () {
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
                mobile: vmContactAdd.mobile,
                name: vmContactAdd.name,
                idNo: vmContactAdd.idNo
            },
            successCallback: function (json) {
                if (json.status !== 1) {
                    alert(json.message);
                    return;
                } else {
                    vmContactList.list.push(json.data);
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
    data: {pageSize: 20},
    successCallback: function (json) {
        if (json.status === 1) {
            vmContactList.list = json.data.list;
        }
    }
});