var newOrder = Storage.get("newOrder");
var vmContactList = avalon.define({
    $id: "contactList",
    list: [],
    selectedList: [],
    selectDone: function() {
        if (vmContactList.$model.selectedList.length > 2) {
            alert("入住人员请不要多于两位");
        } else {
            newOrder.contact = [];
            vmContactList.$model.selectedList.map(function(index) {
                newOrder.contact.push(vmContactList.$model.list[index]);
            });
            Storage.set("newOrder", newOrder);
            location.href = "pay.html";
        }
    },
    trash: function(id) {
        ajaxJsonp({
            url: urls.deleteContact,
            data: { id: id },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmContactList.list.splice(li.dataset.index, 1);
                }
            }
        });
    }
});

(function($) {
    $('#OA_task_2').on('tap', '.mui-btn-blue', function(event) {
        var elem = this;
        var li = elem.parentNode.parentNode;
        location.href = "contact.html?id=" + vmContactList.list[li.dataset.index].id;
    });
})(mui);

(function($) {
    var btnArray = ['确认', '取消'];
    $('#OA_task_2').on('tap', '.mui-btn-red', function(event) {
        var elem = this;
        var li = elem.parentNode.parentNode;
        mui.confirm('确认删除该入住人吗？', 'INI', btnArray, function(e) {
            if (e.index == 0) {
                //从后台删除
                vmContactList.trash(vmContactList.list[li.dataset.index].id);
                //从本地删除
                li.parentNode.removeChild(li);
                Storage.set("newOrder", newOrder);
            } else {
                setTimeout(function() {
                    $.swipeoutClose(li);
                }, 0);
            }
        });
    });
})(mui);

//获取联系人详情
ajaxJsonp({
    url: urls.getContactList,
    data: { pageSize: 20 },
    successCallback: function(json) {
        if (json.status === 1) {
            vmContactList.list = json.data.list;
            if (json.data.list.length == 0) {
                self.location.href = "contact.html";
            } else {
                if (newOrder.hasOwnProperty("contact")) {
                    for (var i in json.data.list) {
                        //绑定本地储存已选联系人
                        newOrder.contact.map(function(c) {
                            if (c.id == json.data.list[i].id) {
                                vmContactList.selectedList.push(parseInt(i));
                            }
                        });
                    }
                }
            }
        }
    }
});
